// @title           Vomo API
// @version         1.0
// @description     Vomo backend API documentation
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.url    http://www.swagger.io/support
// @contact.email  support@swagger.io

// @license.name  Apache 2.0
// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html

// @host      localhost:8080
// @BasePath  /api

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.

// @schemes http https
// @produce application/json
// @consumes application/json

package main

import (
	"log"
	"os"
	_ "vomo/docs"
	"vomo/internal/application"
	"vomo/internal/config"
	"vomo/internal/domain/audit"
	"vomo/internal/handlers"
	"vomo/internal/infrastructure/jwt"
	"vomo/internal/infrastructure/logging"
	"vomo/internal/infrastructure/postgres"
	"vomo/internal/middleware"
	"vomo/internal/routes"
	"vomo/internal/services"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func main() {
	// Initialize logger
	logger, err := logging.NewLogger(
		[]string{"http://localhost:9200"},
		"",
		"",
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
	auditRepo := postgres.NewAuditRepository(db)
	roleRepo := postgres.NewRoleRepository(db)
	permissionRepo := postgres.NewPermissionRepository(db)
	backupRepo := postgres.NewBackupRepository(db)

	// Initialize services
	auditService := audit.NewService(auditRepo)
	menuService := application.NewMenuService(menuRepo, auditService)
	userService := application.NewUserService(userRepo)
	roleService := application.NewRoleService(roleRepo, permissionRepo)
	permissionService := application.NewPermissionService(permissionRepo)
	backupService := application.NewBackupService(backupRepo, cfg)

	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(middleware.LoggingMiddleware(logger))

	// Setup CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, X-Tenant-ID")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Add services to Gin context
	r.Use(func(c *gin.Context) {
		c.Set("userService", userService)
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
		routes.SetupRoutes(api, &services.Services{
			MenuService:       menuService,
			UserService:       userService,
			RoleService:       roleService,
			PermissionService: permissionService,
			AuditService:      auditService,
			BackupService:     backupService,
		})
	}

	// Start Server
	port := cfg.GetServerPort()
	logger.Info("Server starting", map[string]interface{}{
		"port": port,
	})
	if err := r.Run(port); err != nil {
		logger.Error("Server failed to start", nil, err)
		os.Exit(1)
	}
}
