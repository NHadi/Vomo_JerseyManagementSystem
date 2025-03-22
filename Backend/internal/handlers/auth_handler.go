package handlers

import (
	"net/http"
	"strings"
	"vomo/internal/application"
	"vomo/internal/infrastructure/jwt"

	"github.com/gin-gonic/gin"
)

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string         `json:"token"`
	User  UserResponse   `json:"user"`
	Menus []MenuResponse `json:"menus"`
}

// @Summary User login
// @Description Authenticate user with email and password
// @Tags auth
// @Accept json
// @Produce json
// @Param credentials body LoginRequest true "Login Credentials"
// @Success 200 {object} LoginResponse
// @Failure 401 {object} ErrorResponse
// @Router /auth/login [post]
func Login(userService *application.UserService, menuService *application.MenuService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req LoginRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
			return
		}

		user, err := userService.ValidateCredentials(req.Email, req.Password)
		if err != nil {
			c.JSON(http.StatusUnauthorized, ErrorResponse{Error: "Invalid credentials"})
			return
		}

		// Generate JWT token
		token, err := jwt.GenerateAccessToken(user)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "Failed to generate token"})
			return
		}

		// Get menus for the user's role with tenant
		menus, err := menuService.GetMenusByRoleID(user.RoleID, user.TenantID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "Failed to retrieve menus"})
			return
		}

		// Build menu hierarchy
		menuMap := make(map[int]MenuResponse)
		var rootMenus []MenuResponse

		// First pass: create all menu responses and store in map
		for _, m := range menus {
			menuResp := toMenuResponse(m)
			// menuResp.Children = make([]MenuResponse, 0) // Initialize empty children slice
			menuMap[m.ID] = menuResp
		}

		// Second pass: organize children
		for id, menu := range menuMap {
			if menu.ParentID != nil {
				if parent, exists := menuMap[*menu.ParentID]; exists {
					childCopy := menu // Create a copy of the child menu
					parent.Children = append(parent.Children, childCopy)
					menuMap[*menu.ParentID] = parent
				}
			} else {
				rootMenus = append(rootMenus, menuMap[id])
			}
		}

		c.JSON(http.StatusOK, LoginResponse{
			Token: token,
			User:  ToUserResponse(user),
			Menus: rootMenus,
		})
	}
}

func RefreshToken(userService *application.UserService) gin.HandlerFunc {
	return func(c *gin.Context) {
		refreshToken := c.GetHeader("Authorization")
		if refreshToken == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Refresh token is required"})
			return
		}

		refreshToken = strings.TrimPrefix(refreshToken, "Bearer ")

		// Validate refresh token and get user data
		tokenUser, err := jwt.ValidateRefreshToken(refreshToken)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token"})
			return
		}

		// Get user from database to verify existence
		user, err := userService.GetUserByID(tokenUser.ID)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			return
		}

		// Generate new access token
		accessToken, err := jwt.GenerateAccessToken(user)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "Failed to generate token"})
			return
		}

		// Generate new refresh token
		newRefreshToken, err := jwt.GenerateRefreshToken(user)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate refresh token"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"access_token":  accessToken,
			"refresh_token": newRefreshToken,
			"token_type":    "Bearer",
		})
	}
}
