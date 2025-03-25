package routes

import (
	"vomo/internal/application"
	"vomo/internal/handlers"
	"vomo/internal/middleware"

	"github.com/gin-gonic/gin"
)

func SetupPermissionRoutes(router *gin.RouterGroup, permissionService *application.PermissionService) {
	permissions := router.Group("/permissions")
	{
		permissions.POST("", middleware.PermissionChecker("PERMISSION_MANAGE"), handlers.CreatePermission(permissionService))
		permissions.GET("", middleware.PermissionChecker("PERMISSION_VIEW"), handlers.GetAllPermissions(permissionService))
		permissions.GET("/:id", middleware.PermissionChecker("PERMISSION_VIEW"), handlers.GetPermission(permissionService))
		permissions.PUT("/:id", middleware.PermissionChecker("PERMISSION_MANAGE"), handlers.UpdatePermission(permissionService))
		permissions.DELETE("/:id", middleware.PermissionChecker("PERMISSION_MANAGE"), handlers.DeletePermission(permissionService))
	}
}
