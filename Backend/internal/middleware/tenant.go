package middleware

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func TenantMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tenantID := c.GetHeader("X-Tenant-ID")
		
		// Check if tenant ID is empty
		if tenantID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Tenant ID is required"})
			c.Abort()
			return
		}

		// Validate tenant ID format
		_, err := strconv.Atoi(tenantID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tenant ID format"})
			c.Abort()
			return
		}

		// Continue if validation passes
		c.Next()
	}
}
