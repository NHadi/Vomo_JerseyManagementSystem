package handlers

import (
	"net/http"
	"strconv"
	"vomo/internal/application"
	"vomo/internal/domain/permission"

	"github.com/gin-gonic/gin"
)

// PermissionResponse represents the permission response structure
type PermissionResponse struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	CreatedAt   string `json:"created_at"`
	CreatedBy   string `json:"created_by"`
	UpdatedAt   string `json:"updated_at"`
	UpdatedBy   string `json:"updated_by"`
	TenantID    int    `json:"tenant_id"`
}

// CreatePermissionRequest represents the request structure for creating a permission
type CreatePermissionRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
}

// UpdatePermissionRequest represents the request structure for updating a permission
type UpdatePermissionRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
}

func toPermissionResponse(p *permission.Permission) PermissionResponse {
	return PermissionResponse{
		ID:          p.ID,
		Name:        p.Name,
		Description: p.Description,
		CreatedAt:   p.CreatedAt.String(),
		CreatedBy:   p.CreatedBy,
		UpdatedAt:   p.UpdatedAt.String(),
		UpdatedBy:   p.UpdatedBy,
		TenantID:    p.TenantID,
	}
}

// CreatePermission handles the creation of a new permission
func CreatePermission(service *application.PermissionService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req CreatePermissionRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
			return
		}

		perm := &permission.Permission{
			Name:        req.Name,
			Description: req.Description,
		}

		if err := service.Create(perm); err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
			return
		}

		c.JSON(http.StatusCreated, toPermissionResponse(perm))
	}
}

// GetPermission handles retrieving a permission by ID
func GetPermission(service *application.PermissionService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid permission ID"})
			return
		}

		perm, err := service.FindByID(id)
		if err != nil {
			c.JSON(http.StatusNotFound, ErrorResponse{Error: "Permission not found"})
			return
		}

		c.JSON(http.StatusOK, toPermissionResponse(perm))
	}
}

// GetAllPermissions handles retrieving all permissions
func GetAllPermissions(service *application.PermissionService) gin.HandlerFunc {
	return func(c *gin.Context) {
		permissions, err := service.FindAll()
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
			return
		}

		response := make([]PermissionResponse, len(permissions))
		for i, p := range permissions {
			perm := p // Create a new variable to avoid pointer issues
			response[i] = toPermissionResponse(&perm)
		}

		c.JSON(http.StatusOK, response)
	}
}

// UpdatePermission handles updating an existing permission
func UpdatePermission(service *application.PermissionService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid permission ID"})
			return
		}

		var req UpdatePermissionRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
			return
		}

		perm, err := service.FindByID(id)
		if err != nil {
			c.JSON(http.StatusNotFound, ErrorResponse{Error: "Permission not found"})
			return
		}

		perm.Name = req.Name
		perm.Description = req.Description

		if err := service.Update(perm); err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
			return
		}

		c.JSON(http.StatusOK, toPermissionResponse(perm))
	}
}

// DeletePermission handles deleting a permission
func DeletePermission(service *application.PermissionService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid permission ID"})
			return
		}

		if err := service.Delete(id); err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
			return
		}

		c.JSON(http.StatusOK, SuccessResponse{Message: "Permission deleted successfully"})
	}
}

// AssignPermissionsToRole handles assigning permissions to a role
func AssignPermissionsToRole(service *application.RoleService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid role ID"})
			return
		}

		var req struct {
			PermissionIDs []int `json:"permission_ids" binding:"required"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
			return
		}

		if err := service.AssignPermissions(id, req.PermissionIDs); err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
			return
		}

		c.JSON(http.StatusOK, SuccessResponse{Message: "Permissions assigned successfully"})
	}
}

// RemovePermissionsFromRole handles removing permissions from a role
func RemovePermissionsFromRole(service *application.RoleService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid role ID"})
			return
		}

		var req struct {
			PermissionIDs []int `json:"permission_ids" binding:"required"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
			return
		}

		if err := service.RemovePermissions(id, req.PermissionIDs); err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
			return
		}

		c.JSON(http.StatusOK, SuccessResponse{Message: "Permissions removed successfully"})
	}
}
