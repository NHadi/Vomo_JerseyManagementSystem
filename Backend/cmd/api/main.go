// @title Vomo API
// @version 1.0
// @description Vomo API Documentation
// @host localhost:8080
// @BasePath /api
package main

import (
	"log"
	_ "vomo/docs"
	"vomo/internal/application"
	"vomo/internal/config"
	"vomo/internal/handlers"
	"vomo/internal/infrastructure/postgres"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatal("Failed to load config:", err)
	}

	db, err := postgres.NewConnection(
		cfg.DBHost,
		cfg.DBUser,
		cfg.DBPassword,
		cfg.DBName,
		cfg.GetDBPortInt(),
	)
	if err != nil {
		log.Fatal(err)
	}

	userRepo := postgres.NewUserRepository(db)
	userService := application.NewUserService(userRepo)

	menuRepo := postgres.NewMenuRepository(db)
	menuService := application.NewMenuService(menuRepo)

	r := gin.Default()

	// Setup CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Swagger documentation
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// API routes group
	api := r.Group("/api")
	{
		// Auth routes
		auth := api.Group("/auth")
		{
			auth.POST("/login", handlers.Login(userService, menuService))
		}

		// Menu routes
		menus := api.Group("/menus")
		{
			menus.GET("/by-role", handlers.GetMenusByRole(menuService))
			menus.GET("/by-user/:user_id", handlers.GetMenusByUser(menuService))
		}
		
		// User routes
		users := api.Group("/users")
		{
			users.GET("", handlers.GetUsers(userService))
			users.POST("", handlers.CreateUser(userService))
			users.GET("/:id", handlers.GetUser(userService))
			users.PUT("/:id", handlers.UpdateUser(userService))
			users.DELETE("/:id", handlers.DeleteUser(userService))
		}
	}

	// Start server
	port := cfg.GetServerPort()
	log.Printf("Server starting on port %s", port)
	if err := r.Run(port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
