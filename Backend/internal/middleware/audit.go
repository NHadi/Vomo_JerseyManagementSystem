package middleware

import (
	"vomo/internal/domain/appcontext"

	"github.com/gin-gonic/gin"
)

// AuditContext middleware sets up the user context for audit trails
func AuditContext() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get values set by AuthMiddleware and TenantMiddleware
		username, exists := c.Get("username")
		if !exists {
			c.AbortWithStatusJSON(401, gin.H{"error": "Unauthorized - User context not found"})
			return
		}

		tenantID, exists := c.Get("tenant_id")
		if !exists {
			c.AbortWithStatusJSON(400, gin.H{"error": "Bad Request - Tenant ID not found"})
			return
		}

		// Create and set user context
		userCtx := &appcontext.UserContext{
			Username: username.(string),
			TenantID: tenantID.(int),
		}
		c.Set(appcontext.UserContextKey, userCtx)
		c.Next()
	}
}
