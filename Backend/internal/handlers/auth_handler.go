package handlers

import (
	"net/http"
	"vomo/internal/application"

	"github.com/gin-gonic/gin"
)

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
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

		// Get menus for the user's role
		menus, err := menuService.GetMenusByRoleID(user.RoleID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "Failed to retrieve menus"})
			return
		}

		// Convert menus to response format
		menuResponses := make([]MenuResponse, len(menus))
		for i, m := range menus {
			menuResponses[i] = toMenuResponse(m)
		}

		c.JSON(http.StatusOK, LoginResponse{
			User:  ToUserResponse(user),
			Menus: menuResponses,
		})
	}
}