package routes

import (
	"vomo/internal/application"
	"vomo/internal/handlers"

	"github.com/gin-gonic/gin"
)

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
