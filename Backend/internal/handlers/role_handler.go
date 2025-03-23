package handlers

import (
	"net/http"
	"strconv"
	"vomo/internal/application"
	"vomo/internal/domain/role"

	"github.com/gin-gonic/gin"
)

// RoleResponse represents the role response structure
// @Description Role response model
type RoleResponse struct {
	ID          int                  `json:"id" example:"1"`
	Name        string               `json:"name" example:"Admin"`
	Description string               `json:"description" example:"Administrator role with full access"`
	Permissions []PermissionResponse `json:"permissions,omitempty"`
	Menus       []MenuResponse       `json:"menus,omitempty"`
	CreatedAt   string               `json:"created_at" example:"2024-01-01T12:00:00Z"`
	CreatedBy   string               `json:"created_by" example:"john.doe@example.com"`
	UpdatedAt   string               `json:"updated_at" example:"2024-01-01T12:00:00Z"`
	UpdatedBy   string               `json:"updated_by" example:"john.doe@example.com"`
	TenantID    int                  `json:"tenant_id" example:"1"`
}

// CreateRoleRequest represents the request structure for creating a role
// @Description Create role request model
type CreateRoleRequest struct {
	Name          string `json:"name" binding:"required" example:"Admin"`
	Description   string `json:"description" example:"Administrator role with full access"`
	PermissionIDs []int  `json:"permission_ids" example:"1,2,3"`
}

// UpdateRoleRequest represents the request structure for updating a role
// @Description Update role request model
type UpdateRoleRequest struct {
	Name          string `json:"name" binding:"required" example:"Admin"`
	Description   string `json:"description" example:"Administrator role with full access"`
	PermissionIDs []int  `json:"permission_ids" example:"1,2,3"`
}

// AssignMenusRequest represents the request structure for assigning menus to a role
// @Description Assign menus request model
type AssignMenusRequest struct {
	MenuIDs []int `json:"menu_ids" binding:"required" example:"[1, 2, 3]"`
}

func toRoleResponse(role *role.Role) RoleResponse {
	menuResponses := make([]MenuResponse, 0)
	if role.Menus != nil {
		for _, m := range role.Menus {
			menuResponses = append(menuResponses, toMenuResponse(m))
		}
	}

	permissionResponses := make([]PermissionResponse, 0)
	if role.Permissions != nil {
		for _, p := range role.Permissions {
			permissionResponses = append(permissionResponses, toPermissionResponse(&p))
		}
	}

	return RoleResponse{
		ID:          role.ID,
		Name:        role.Name,
		Description: role.Description,
		Permissions: permissionResponses,
		Menus:       menuResponses,
		CreatedAt:   role.CreatedAt.String(),
		CreatedBy:   role.CreatedBy,
		UpdatedAt:   role.UpdatedAt.String(),
		UpdatedBy:   role.UpdatedBy,
		TenantID:    role.TenantID,
	}
}

// @Summary Create a new role
// @Description Create a new role with specified permissions
// @Tags Role
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param X-Tenant-ID header string true "Tenant ID"
// @Param role body CreateRoleRequest true "Role Data"
// @Success 201 {object} RoleResponse
// @Failure 400 {object} ErrorResponse "Invalid request parameters"
// @Failure 401 {object} ErrorResponse "Unauthorized"
// @Failure 403 {object} ErrorResponse "Forbidden"
// @Failure 500 {object} ErrorResponse "Internal server error"
// @Router /roles [post]
func CreateRole(service *application.RoleService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req CreateRoleRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
			return
		}

		newRole := &role.Role{
			Name:        req.Name,
			Description: req.Description,
		}

		if err := service.Create(newRole); err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
			return
		}

		// Assign permissions if provided
		if len(req.PermissionIDs) > 0 {
			if err := service.AssignPermissions(newRole.ID, req.PermissionIDs); err != nil {
				c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "Failed to assign permissions"})
				return
			}
		}

		// Fetch the complete role with permissions
		role, err := service.FindByID(newRole.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "Failed to fetch created role"})
			return
		}

		permissions, err := service.GetRolePermissions(role.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "Failed to fetch role permissions"})
			return
		}
		role.Permissions = permissions

		c.JSON(http.StatusCreated, toRoleResponse(role))
	}
}

// @Summary Get a role by ID
// @Description Get role details by ID
// @Tags Role
// @Produce json
// @Security BearerAuth
// @Param X-Tenant-ID header string true "Tenant ID"
// @Param id path int true "Role ID"
// @Success 200 {object} RoleResponse
// @Failure 400 {object} ErrorResponse "Invalid request parameters"
// @Failure 401 {object} ErrorResponse "Unauthorized"
// @Failure 403 {object} ErrorResponse "Forbidden"
// @Failure 404 {object} ErrorResponse "Role not found"
// @Failure 500 {object} ErrorResponse "Internal server error"
// @Router /roles/{id} [get]
func GetRole(service *application.RoleService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid role ID format"})
			return
		}

		role, err := service.FindByID(id)
		if err != nil {
			c.JSON(http.StatusNotFound, ErrorResponse{Error: "Role not found"})
			return
		}

		// Fetch permissions for the role
		permissions, err := service.GetRolePermissions(id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "Failed to fetch role permissions"})
			return
		}
		role.Permissions = permissions

		c.JSON(http.StatusOK, toRoleResponse(role))
	}
}

// @Summary Update a role
// @Description Update an existing role
// @Tags Role
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param X-Tenant-ID header string true "Tenant ID"
// @Param id path int true "Role ID"
// @Param role body UpdateRoleRequest true "Role Data"
// @Success 200 {object} RoleResponse
// @Failure 400 {object} ErrorResponse "Invalid request parameters"
// @Failure 401 {object} ErrorResponse "Unauthorized"
// @Failure 403 {object} ErrorResponse "Forbidden"
// @Failure 404 {object} ErrorResponse "Role not found"
// @Failure 500 {object} ErrorResponse "Internal server error"
// @Router /roles/{id} [put]
func UpdateRole(service *application.RoleService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid role ID format"})
			return
		}

		var req UpdateRoleRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
			return
		}

		existingRole, err := service.FindByID(id)
		if err != nil {
			c.JSON(http.StatusNotFound, ErrorResponse{Error: "Role not found"})
			return
		}

		existingRole.Name = req.Name
		existingRole.Description = req.Description

		if err := service.Update(existingRole); err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
			return
		}

		// Update permissions
		if err := service.AssignPermissions(id, req.PermissionIDs); err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "Failed to update permissions"})
			return
		}

		// Fetch updated permissions
		permissions, err := service.GetRolePermissions(id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "Failed to fetch role permissions"})
			return
		}
		existingRole.Permissions = permissions

		c.JSON(http.StatusOK, toRoleResponse(existingRole))
	}
}

// @Summary Delete a role
// @Description Delete an existing role
// @Tags Role
// @Produce json
// @Security BearerAuth
// @Param X-Tenant-ID header string true "Tenant ID"
// @Param id path int true "Role ID"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse "Invalid request parameters"
// @Failure 401 {object} ErrorResponse "Unauthorized"
// @Failure 403 {object} ErrorResponse "Forbidden"
// @Failure 404 {object} ErrorResponse "Role not found"
// @Failure 500 {object} ErrorResponse "Internal server error"
// @Router /roles/{id} [delete]
func DeleteRole(service *application.RoleService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid role ID format"})
			return
		}

		if err := service.Delete(id); err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
			return
		}

		c.JSON(http.StatusOK, SuccessResponse{Message: "Role deleted successfully"})
	}
}

// @Summary Assign menus to a role
// @Description Assign multiple menus to a role
// @Tags Role
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param X-Tenant-ID header string true "Tenant ID"
// @Param id path int true "Role ID"
// @Param menus body AssignMenusRequest true "Menu IDs to assign"
// @Success 200 {object} SuccessResponse
// @Failure 400 {object} ErrorResponse "Invalid request parameters"
// @Failure 401 {object} ErrorResponse "Unauthorized"
// @Failure 403 {object} ErrorResponse "Forbidden"
// @Failure 404 {object} ErrorResponse "Role not found"
// @Failure 500 {object} ErrorResponse "Internal server error"
// @Router /roles/{id}/menus [post]
func AssignMenusToRole(service *application.RoleService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid role ID format"})
			return
		}

		var req AssignMenusRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
			return
		}

		if err := service.AssignMenus(id, req.MenuIDs); err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
			return
		}

		c.JSON(http.StatusOK, SuccessResponse{Message: "Menus assigned successfully"})
	}
}
