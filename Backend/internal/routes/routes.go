package routes

import (
	"vomo/internal/application"
	"vomo/internal/handlers"
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
		SetupBackupRoutes(protected, services.BackupService)
		SetupZoneRoutes(protected, services.ZoneService)
		SetupRegionRoutes(protected, services.RegionService)
		SetupOfficeRoutes(protected, services.OfficeService)
	}
}

// SetupZoneRoutes initializes zone-related routes
func SetupZoneRoutes(router *gin.RouterGroup, service *application.ZoneService) {
	zones := router.Group("/zones")
	{
		zones.POST("", handlers.CreateZone(service))
		zones.GET("/:id", handlers.GetZone(service))
		zones.GET("", handlers.GetAllZones(service))
		zones.PUT("/:id", handlers.UpdateZone(service))
		zones.DELETE("/:id", handlers.DeleteZone(service))
		zones.GET("/by-region", handlers.GetZonesByRegion(service))
	}
}

// SetupRegionRoutes initializes region-related routes
func SetupRegionRoutes(router *gin.RouterGroup, service *application.RegionService) {
	regions := router.Group("/regions")
	{
		regions.POST("", handlers.CreateRegion(service))
		regions.GET("/:id", handlers.GetRegion(service))
		regions.GET("", handlers.GetAllRegions(service))
		regions.PUT("/:id", handlers.UpdateRegion(service))
		regions.DELETE("/:id", handlers.DeleteRegion(service))
	}
}

// SetupOfficeRoutes initializes office-related routes
func SetupOfficeRoutes(router *gin.RouterGroup, service *application.OfficeService) {
	offices := router.Group("/offices")
	{
		offices.POST("", handlers.CreateOffice(service))
		offices.GET("/:id", handlers.GetOffice(service))
		offices.GET("", handlers.GetAllOffices(service))
		offices.PUT("/:id", handlers.UpdateOffice(service))
		offices.DELETE("/:id", handlers.DeleteOffice(service))
		offices.GET("/by-zone", handlers.GetOfficesByZone(service))
	}
}
