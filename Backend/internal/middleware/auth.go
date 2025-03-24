package middleware

import (
	"net/http"
	"strings"
	"vomo/internal/application"
	"vomo/internal/infrastructure/jwt"

	"github.com/google/uuid"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware handles JWT authentication and loads user permissions
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		// Extract the token
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
			c.Abort()
			return
		}

		// Validate the token
		claims, err := jwt.ValidateToken(parts[1])
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// Parse UUID from claims
		userID, err := uuid.Parse(claims.UserID)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID in token"})
			c.Abort()
			return
		}

		// Set user ID, username, and tenant ID in context
		c.Set("userID", userID)
		c.Set("username", claims.Username)
		c.Set("tenantID", claims.TenantID)

		// Get user service from the application container
		userService := c.MustGet("userService").(*application.UserService)

		// Load user permissions
		permissions, err := userService.GetUserPermissions(userID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load user permissions"})
			c.Abort()
			return
		}

		// Set permissions in context
		c.Set("userPermissions", permissions)

		c.Next()
	}
}
