package middleware

import (
	"vomo/internal/domain/appcontext"
	"vomo/internal/infrastructure/jwt"

	"github.com/gin-gonic/gin"
)

const (
	UserContextKey = "user_context"
)

type UserContext struct {
	Username string
	TenantID int
}

// AuditContext middleware extracts user information from JWT token and stores it in context
func AuditContext() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get user from JWT token
		tokenString := c.GetHeader("Authorization")
		if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
			tokenString = tokenString[7:]
		}

		claims, err := jwt.ValidateToken(tokenString)
		if err == nil {
			userContext := &appcontext.UserContext{
				Username: claims.Username,
				TenantID: claims.TenantID,
			}
			c.Set(appcontext.UserContextKey, userContext)
		}

		c.Next()
	}
}
