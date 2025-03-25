package routes

import (
	"vomo/internal/application"
	"vomo/internal/handlers"
	"vomo/internal/middleware"

	"github.com/gin-gonic/gin"
)

func SetupUserRoutes(router *gin.RouterGroup, userService *application.UserService) {
	users := router.Group("/users")
	{
		users.GET("", middleware.PermissionChecker("USER_VIEW"), handlers.GetUsers(userService))
		users.POST("", middleware.PermissionChecker("USER_CREATE"), handlers.CreateUser(userService))
		users.GET("/:id", middleware.PermissionChecker("USER_VIEW"), handlers.GetUser(userService))
		users.PUT("/:id", middleware.PermissionChecker("USER_UPDATE"), handlers.UpdateUser(userService))
		users.DELETE("/:id", middleware.PermissionChecker("USER_DELETE"), handlers.DeleteUser(userService))
	}
}
