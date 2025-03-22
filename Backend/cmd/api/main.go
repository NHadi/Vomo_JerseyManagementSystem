// @title Vomo API
// @version 1.0
// @description Vomo API Documentation
// @host localhost:8080
// @BasePath /api
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.
package main

import (
	"log"
	"os"
	_ "vomo/docs"
	"vomo/internal/application"
	"vomo/internal/config"
	"vomo/internal/handlers"
	"vomo/internal/infrastructure/jwt" // Add JWT package
	"vomo/internal/infrastructure/logging"
	"vomo/internal/infrastructure/postgres"
	"vomo/internal/middleware"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func main() {
	// Initialize logger
	logger, err := logging.NewLogger(
		[]string{"http://localhost:9200"},
		"", // No username needed with anonymous access
		"", // No password needed with anonymous access
		"vomo-logs",
	)
	if err != nil {
		log.Fatal("Failed to initialize logger:", err)
	}

	// Load config
	cfg, err := config.LoadConfig()
	if err != nil {
		logger.Error("Failed to load config", nil, err)
		os.Exit(1)
	}

	// Initialize JWT secrets
	jwt.SetSecrets(cfg.JWTSecret, cfg.JWTRefreshSecret)

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

	// Initialize repositories

	menuRepo := postgres.NewMenuRepository(db)
	userRepo := postgres.NewUserRepository(db)

	// Initialize services
	menuService := application.NewMenuService(menuRepo)
	userService := application.NewUserService(userRepo)

	r := gin.New() // Use gin.New() instead of gin.Default() to avoid default logger
	r.Use(gin.Recovery())
	r.Use(middleware.LoggingMiddleware(logger))

	// Setup CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Tenant-ID, X-CSRF-Token")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Expose-Headers", "Authorization")
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
		// Public routes (no tenant required)
		auth := api.Group("/auth")
		{
			auth.POST("/login", handlers.Login(userService, menuService))
			auth.POST("/refresh", handlers.RefreshToken(userService))
		}

		// Protected routes with tenant
		protected := api.Group("")
		protected.Use(middleware.AuthMiddleware())
		protected.Use(middleware.TenantMiddleware())
		{
			// Menu routes
			menus := protected.Group("/menus")
			{
				menus.POST("", handlers.CreateMenu(menuService))
				menus.PUT("/:id", handlers.UpdateMenu(menuService))
				menus.DELETE("/:id", handlers.DeleteMenu(menuService))
				menus.GET("/:id", handlers.GetMenu(menuService))
				menus.GET("", handlers.GetAllMenus(menuService))
				menus.GET("/by-role", handlers.GetMenusByRole(menuService))
				menus.GET("/by-user/:user_id", handlers.GetMenusByUser(menuService))
			}

			// Move user routes inside protected group
			users := protected.Group("/users")
			{
				users.GET("", handlers.GetUsers(userService))
				users.POST("", handlers.CreateUser(userService))
				users.GET("/:id", handlers.GetUser(userService))
				users.PUT("/:id", handlers.UpdateUser(userService))
				users.DELETE("/:id", handlers.DeleteUser(userService))
			}
		}
	}

	// Start server
	port := cfg.GetServerPort()
	logger.Info("Server starting", map[string]interface{}{
		"port": port,
	})
	if err := r.Run(port); err != nil {
		logger.Error("Server failed to start", nil, err)
		os.Exit(1)
	}
}
