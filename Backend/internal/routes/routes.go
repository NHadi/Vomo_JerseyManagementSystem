package routes

import (
	"vomo/internal/middleware"
	"vomo/internal/services"

	"github.com/gin-gonic/gin"
)

// SetupRoutes initializes all routes for the application
func SetupRoutes(router *gin.RouterGroup, services *services.Services) {
	// Protected routes with tenant
	protected := router.Group("")
	protected.Use(middleware.AuthMiddleware())
	protected.Use(middleware.TenantMiddleware())
	protected.Use(middleware.AuditContext())
	{
		SetupMenuRoutes(protected, services.MenuService)
		SetupUserRoutes(protected, services.UserService)
		SetupRoleRoutes(protected, services.RoleService)
		SetupPermissionRoutes(protected, services.PermissionService)
		SetupAuditRoutes(protected, services.AuditService)
	}
}
