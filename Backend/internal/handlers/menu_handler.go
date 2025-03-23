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
	ParentID *int           `json:"parent_id"`
	Sort     int            `json:"sort"`
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
		Sort:     menu.Sort,
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

// @Summary Create a new menu
// @Description Create a new menu item
// @Tags Menu
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param X-Tenant-ID header string true "Tenant ID"
// @Param menu body CreateMenuRequest true "Menu Data"
// @Success 201 {object} MenuResponse
// @Failure 400 {object} gin.H
// @Failure 401 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /menus [post]
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

// @Summary Update a menu
// @Description Update an existing menu item
// @Tags Menu
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param X-Tenant-ID header string true "Tenant ID"
// @Param id path int true "Menu ID"
// @Param menu body UpdateMenuRequest true "Menu Data"
// @Success 200 {object} MenuResponse
// @Failure 400,404 {object} gin.H
// @Failure 401 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /menus/{id} [put]
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

// @Summary Delete a menu
// @Description Delete an existing menu item
// @Tags Menu
// @Produce json
// @Security BearerAuth
// @Param X-Tenant-ID header string true "Tenant ID"
// @Param id path int true "Menu ID"
// @Success 200 {object} gin.H
// @Failure 400,404 {object} gin.H
// @Failure 401 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /menus/{id} [delete]
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

// @Summary Get a menu by ID
// @Description Get menu details by ID
// @Tags Menu
// @Produce json
// @Security BearerAuth
// @Param X-Tenant-ID header string true "Tenant ID"
// @Param id path int true "Menu ID"
// @Success 200 {object} MenuResponse
// @Failure 400,404 {object} gin.H
// @Failure 401 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /menus/{id} [get]
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

// @Summary Get all menus
// @Description Get all menu items
// @Tags Menu
// @Produce json
// @Security BearerAuth
// @Param X-Tenant-ID header string true "Tenant ID"
// @Success 200 {array} MenuResponse
// @Failure 400 {object} gin.H
// @Failure 401 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /menus [get]
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

// @Summary Get menus by role
// @Description Get menu items by role ID
// @Tags Menu
// @Produce json
// @Security BearerAuth
// @Param X-Tenant-ID header string true "Tenant ID"
// @Param role_id query int true "Role ID"
// @Success 200 {array} MenuResponse
// @Failure 400 {object} gin.H
// @Failure 401 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /menus/by-role [get]
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

// @Summary Get menus by user
// @Description Get menu items by user ID
// @Tags Menu
// @Produce json
// @Security BearerAuth
// @Param X-Tenant-ID header string true "Tenant ID"
// @Param user_id path string true "User ID"
// @Success 200 {array} MenuResponse
// @Failure 400 {object} gin.H
// @Failure 401 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /menus/by-user/{user_id} [get]
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
