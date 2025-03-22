package handlers

import (
	"net/http"
	"strconv"
	"vomo/internal/application"

	"github.com/gin-gonic/gin"
)

func GetMenusByRole(menuService *application.MenuService) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenantID, _ := strconv.Atoi(c.GetString("tenant_id"))
		roleID, _ := strconv.Atoi(c.Query("role_id"))

		menus, err := menuService.GetMenusByRoleID(roleID, tenantID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, menus)
	}
}

// ... other handlers with tenant context ...
