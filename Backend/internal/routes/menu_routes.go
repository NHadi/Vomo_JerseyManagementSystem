package routes

import (
	"vomo/internal/application"
	"vomo/internal/handlers"
	"vomo/internal/middleware"

	"github.com/gin-gonic/gin"
)

func SetupMenuRoutes(router *gin.RouterGroup, menuService *application.MenuService) {
	menus := router.Group("/menus")
	{
		menus.POST("", middleware.PermissionChecker("MENU_CREATE"), handlers.CreateMenu(menuService))
		menus.PUT("/:id", middleware.PermissionChecker("MENU_UPDATE"), handlers.UpdateMenu(menuService))
		menus.DELETE("/:id", middleware.PermissionChecker("MENU_DELETE"), handlers.DeleteMenu(menuService))
		menus.GET("/:id", middleware.PermissionChecker("MENU_VIEW"), handlers.GetMenu(menuService))
		menus.GET("", middleware.PermissionChecker("MENU_VIEW"), handlers.GetAllMenus(menuService))
		menus.GET("/by-role", middleware.PermissionChecker("MENU_VIEW"), handlers.GetMenusByRole(menuService))
		menus.GET("/by-user/:user_id", middleware.PermissionChecker("MENU_VIEW"), handlers.GetMenusByUser(menuService))
	}
}
