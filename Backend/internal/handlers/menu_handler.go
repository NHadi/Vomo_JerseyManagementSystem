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

type CreateMenuRequest struct {
	Name     string `json:"name" binding:"required"`
	URL      string `json:"url"`
	Icon     string `json:"icon"`
	ParentID *int   `json:"parent_id"`
	Sort     int    `json:"sort"`
}

type UpdateMenuRequest struct {
	Name     string `json:"name" binding:"required"`
	URL      string `json:"url"`
	Icon     string `json:"icon"`
	ParentID *int   `json:"parent_id"`
	Sort     int    `json:"sort"`
}

func CreateMenu(service *application.MenuService) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenantID, err := strconv.Atoi(c.GetHeader("X-Tenant-ID"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tenant ID"})
			return
		}

		var req CreateMenuRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		menuEntity := menu.Menu{
			Name:     req.Name,
			URL:      req.URL,
			Icon:     req.Icon,
			ParentID: req.ParentID,
			Sort:     req.Sort,
		}
		menuEntity.TenantID = tenantID

		if err := service.Create(&menuEntity); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, toMenuResponse(menuEntity))
	}
}

func UpdateMenu(service *application.MenuService) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenantID, err := strconv.Atoi(c.GetHeader("X-Tenant-ID"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tenant ID"})
			return
		}

		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid menu ID"})
			return
		}

		var req UpdateMenuRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		existingMenu, err := service.GetByID(id, tenantID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Menu not found"})
			return
		}

		existingMenu.Name = req.Name
		existingMenu.URL = req.URL
		existingMenu.Icon = req.Icon
		existingMenu.ParentID = req.ParentID
		existingMenu.Sort = req.Sort

		if err := service.Update(existingMenu); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, toMenuResponse(*existingMenu))
	}
}

func DeleteMenu(service *application.MenuService) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenantID, err := strconv.Atoi(c.GetHeader("X-Tenant-ID"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tenant ID"})
			return
		}

		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid menu ID"})
			return
		}

		if err := service.Delete(id, tenantID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Menu deleted successfully"})
	}
}

func GetMenu(service *application.MenuService) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenantID, err := strconv.Atoi(c.GetHeader("X-Tenant-ID"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tenant ID"})
			return
		}

		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid menu ID"})
			return
		}

		menu, err := service.GetByID(id, tenantID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Menu not found"})
			return
		}

		c.JSON(http.StatusOK, toMenuResponse(*menu))
	}
}

func GetAllMenus(service *application.MenuService) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenantID, err := strconv.Atoi(c.GetHeader("X-Tenant-ID"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid tenant ID"})
			return
		}

		menus, err := service.GetAll(tenantID)
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
