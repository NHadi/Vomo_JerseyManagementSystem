package handlers

import (
	"net/http"
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
		token, err := jwt.GenerateToken(user.ID.String(), user.TenantID, user.Email)
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
			menuResp.Children = []MenuResponse{}
			menuMap[m.ID] = menuResp
		}

		// Second pass: organize children
		for _, menu := range menuMap {
			if menu.ParentID != nil {
				if parent, exists := menuMap[*menu.ParentID]; exists {
					parent.Children = append(parent.Children, menu)
					menuMap[*menu.ParentID] = parent
				}
			}
		}

		// Final pass: collect only root menus
		for _, menu := range menuMap {
			if menu.ParentID == nil {
				rootMenus = append(rootMenus, menu)
			}
		}

		c.JSON(http.StatusOK, LoginResponse{
			Token: token,
			User:  ToUserResponse(user),
			Menus: rootMenus,
		})
	}
}
