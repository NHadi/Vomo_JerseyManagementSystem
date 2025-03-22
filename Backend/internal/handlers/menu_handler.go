package handlers

import (
	"net/http"
	"strconv"
	"vomo/internal/application"
	"vomo/internal/domain/menu"

	"github.com/gin-gonic/gin"
)

type MenuResponse struct {
	ID       int            `json:"id"`
	Name     string         `json:"name"`
	URL      string         `json:"url"`
	Icon     string         `json:"icon"`
	ParentID *int          `json:"parent_id"`
	Children []MenuResponse `json:"children,omitempty"`
}

func toMenuResponse(menu menu.Menu) MenuResponse {
	children := make([]MenuResponse, 0)
	for _, child := range menu.Children {
		children = append(children, toMenuResponse(*child))
	}

	return MenuResponse{
		ID:       menu.ID,
		Name:     menu.Name,
		URL:      menu.URL,
		Icon:     menu.Icon,
		ParentID: menu.ParentID,
		Children: children,
	}
}

func GetMenusByRole(service *application.MenuService) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenantID, err := strconv.Atoi(c.GetHeader("X-Tenant-ID"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tenant ID"})
			return
		}

		roleIDStr := c.Query("role_id")
		roleID, err := strconv.Atoi(roleIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid role ID"})
			return
		}

		menus, err := service.GetMenusByRoleID(roleID, tenantID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		response := make([]MenuResponse, len(menus))
		for i, m := range menus {
			response[i] = toMenuResponse(m)
		}

		c.JSON(http.StatusOK, response)
	}
}

func GetMenusByUser(service *application.MenuService) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenantID, err := strconv.Atoi(c.GetHeader("X-Tenant-ID"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tenant ID"})
			return
		}

		userID := c.Param("user_id")
		if userID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
			return
		}

		menus, err := service.GetMenusByUserID(userID, tenantID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		response := make([]MenuResponse, len(menus))
		for i, m := range menus {
			response[i] = toMenuResponse(m)
		}

		c.JSON(http.StatusOK, response)
	}
}
