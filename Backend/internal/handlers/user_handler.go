package handlers

import (
	"net/http"
	"strconv"
	"vomo/internal/application"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UserHandler struct {
	userService *application.UserService
}

// @Summary Create new user
// @Description Create a new user with the provided data
// @Tags users
// @Accept json
// @Produce json
// @Param user body CreateUserRequest true "User data"
// @Success 201 {object} UserResponse
// @Failure 400 {object} ErrorResponse
// @Router /users [post]  // Changed from /api/users
func CreateUser(service *application.UserService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req CreateUserRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
			return
		}

		user, err := service.CreateUser(req.Username, req.Email, req.Password, req.RoleID)
		if err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
			return
		}

		c.JSON(http.StatusCreated, ToUserResponse(user))
	}
}

// @Summary Get user by ID
// @Description Get user details by user ID
// @Tags users
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} UserResponse
// @Failure 404 {object} ErrorResponse
// @Router /users/{id} [get]  // Changed from /api/users/{id}
func GetUser(service *application.UserService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := uuid.Parse(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid ID format"})
			return
		}

		user, err := service.GetUserByID(id)
		if err != nil {
			c.JSON(http.StatusNotFound, ErrorResponse{Error: "User not found"})
			return
		}

		c.JSON(http.StatusOK, ToUserResponse(user))
	}
}

// @Summary List users
// @Description Get paginated list of users
// @Tags users
// @Produce json
// @Param page query int false "Page number"
// @Param size query int false "Page size"
// @Success 200 {array} UserResponse
// @Router /users [get]  // Changed from /api/users
func GetUsers(service *application.UserService) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Parse query parameters
		page := 1
		size := 10
		if pageStr := c.Query("page"); pageStr != "" {
			if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
				page = p
			}
		}
		if sizeStr := c.Query("size"); sizeStr != "" {
			if s, err := strconv.Atoi(sizeStr); err == nil && s > 0 {
				size = s
			}
		}

		users, err := service.ListUsers(page, size)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
			return
		}

		c.JSON(http.StatusOK, ToUserResponses(users))
	}
}

// @Summary Update user
// @Description Update user details
// @Tags users
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param user body UpdateUserRequest true "User data"
// @Success 200 {object} UserResponse
// @Failure 400,404 {object} ErrorResponse
// @Router /users/{id} [put]  // Changed from /api/users/{id}
func UpdateUser(service *application.UserService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := uuid.Parse(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid ID format"})
			return
		}

		var req UpdateUserRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
			return
		}

		user, err := service.UpdateUser(id, req.Username, req.Email)
		if err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
			return
		}

		c.JSON(http.StatusOK, ToUserResponse(user))
	}
}

// @Summary Delete user
// @Description Delete user by ID
// @Tags users
// @Produce json
// @Param id path string true "User ID"
// @Success 204 "No Content"
// @Failure 400,404 {object} ErrorResponse
// @Router /users/{id} [delete]  // Changed from /api/users/{id}
func DeleteUser(service *application.UserService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := uuid.Parse(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid ID format"})
			return
		}

		if err := service.DeleteUser(id); err != nil {
			c.JSON(http.StatusNotFound, ErrorResponse{Error: "User not found"})
			return
		}

		c.Status(http.StatusNoContent)
	}
}

// Add this near the top with other type definitions
type UpdateUserRequest struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
}
