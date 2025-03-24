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

	// Initialize services
	auditService := audit.NewService(auditRepo)
	menuService := application.NewMenuService(menuRepo, auditService)
	userService := application.NewUserService(userRepo)
	roleService := application.NewRoleService(roleRepo, permissionRepo)
	permissionService := application.NewPermissionService(permissionRepo)

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
		protected := api.Group("")
		protected.Use(middleware.AuthMiddleware())
		protected.Use(middleware.TenantMiddleware())
		protected.Use(middleware.AuditContext())
		{
			// Menu routes
			menus := protected.Group("/menus")
			{
				menus.POST("", middleware.PermissionChecker("MENU_CREATE"), handlers.CreateMenu(menuService))
				menus.PUT("/:id", middleware.PermissionChecker("MENU_UPDATE"), handlers.UpdateMenu(menuService))
				menus.DELETE("/:id", middleware.PermissionChecker("MENU_DELETE"), handlers.DeleteMenu(menuService))
				menus.GET("/:id", middleware.PermissionChecker("MENU_VIEW"), handlers.GetMenu(menuService))
				menus.GET("", middleware.PermissionChecker("MENU_VIEW"), handlers.GetAllMenus(menuService))
				menus.GET("/by-role", middleware.PermissionChecker("MENU_VIEW"), handlers.GetMenusByRole(menuService))
				menus.GET("/by-user/:user_id", middleware.PermissionChecker("MENU_VIEW"), handlers.GetMenusByUser(menuService))
			}

			// User routes
			users := protected.Group("/users")
			{
				users.GET("", middleware.PermissionChecker("USER_VIEW"), handlers.GetUsers(userService))
				users.POST("", middleware.PermissionChecker("USER_CREATE"), handlers.CreateUser(userService))
				users.GET("/:id", middleware.PermissionChecker("USER_VIEW"), handlers.GetUser(userService))
				users.PUT("/:id", middleware.PermissionChecker("USER_UPDATE"), handlers.UpdateUser(userService))
				users.DELETE("/:id", middleware.PermissionChecker("USER_DELETE"), handlers.DeleteUser(userService))
			}

			// Role routes
			roles := protected.Group("/roles")
			{
				roles.POST("", middleware.PermissionChecker("ROLE_CREATE"), handlers.CreateRole(roleService))
				roles.GET("/:id", middleware.PermissionChecker("ROLE_VIEW"), handlers.GetRole(roleService))
				roles.PUT("/:id", middleware.PermissionChecker("ROLE_UPDATE"), handlers.UpdateRole(roleService))
				roles.DELETE("/:id", middleware.PermissionChecker("ROLE_DELETE"), handlers.DeleteRole(roleService))
				roles.POST("/:id/menus", middleware.PermissionChecker("ROLE_UPDATE"), handlers.AssignMenusToRole(roleService))
				roles.POST("/:id/permissions", middleware.PermissionChecker("ROLE_UPDATE"), handlers.AssignPermissionsToRole(roleService))
				roles.DELETE("/:id/permissions", middleware.PermissionChecker("ROLE_UPDATE"), handlers.RemovePermissionsFromRole(roleService))
				roles.GET("", middleware.PermissionChecker("ROLE_VIEW"), handlers.GetAllRoles(roleService))
			}

			// Permission routes
			permissions := protected.Group("/permissions")
			{
				permissions.POST("", middleware.PermissionChecker("PERMISSION_CREATE"), handlers.CreatePermission(permissionService))
				permissions.GET("", middleware.PermissionChecker("PERMISSION_VIEW"), handlers.GetAllPermissions(permissionService))
				permissions.GET("/:id", middleware.PermissionChecker("PERMISSION_VIEW"), handlers.GetPermission(permissionService))
				permissions.PUT("/:id", middleware.PermissionChecker("PERMISSION_UPDATE"), handlers.UpdatePermission(permissionService))
				permissions.DELETE("/:id", middleware.PermissionChecker("PERMISSION_DELETE"), handlers.DeletePermission(permissionService))
			}

			// Audit routes
			audits := protected.Group("/audits")
			{
				audits.GET("/entity/:type/:id", middleware.PermissionChecker("AUDIT_TRAIL_VIEW"), handlers.GetEntityAuditHistory(auditService))
				audits.GET("/tenant/:id", middleware.PermissionChecker("AUDIT_TRAIL_VIEW"), handlers.GetTenantAuditHistory(auditService))
				audits.GET("/date-range", middleware.PermissionChecker("AUDIT_TRAIL_VIEW"), handlers.GetAuditHistoryByDateRange(auditService))
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
