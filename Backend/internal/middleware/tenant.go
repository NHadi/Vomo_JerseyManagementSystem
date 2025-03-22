package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func TenantMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tenantIDRaw, exists := c.Get("tenant_id")
		if !exists {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Tenant ID not found in token"})
			c.Abort()
			return
		}

		// Convert interface{} to int
		tenantID, ok := tenantIDRaw.(int)
		if !ok {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tenant ID format"})
			c.Abort()
			return
		}

		// Set the parsed tenant ID back to context
		c.Set("tenant_id", tenantID)
		c.Next()
	}
}
