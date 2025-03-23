package middleware

import (
	"vomo/internal/domain/appcontext"

	"github.com/gin-gonic/gin"
)

// AuditContext middleware sets up the user context for audit trails
func AuditContext() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get values set by AuthMiddleware and TenantMiddleware
		username := c.GetString("username")
		tenantID := c.GetInt("tenant_id")

		// Create and set user context
		userCtx := &appcontext.UserContext{
			Username: username,
			TenantID: tenantID,
		}
		c.Set(appcontext.UserContextKey, userCtx)
		c.Next()
	}
}
