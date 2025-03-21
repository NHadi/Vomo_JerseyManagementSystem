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
	Children []MenuResponse `json:"children,omitempty"`
}

func toMenuResponse(m menu.Menu) MenuResponse {
	resp := MenuResponse{
		ID:       m.ID,
		Name:     m.Name,
		URL:      m.URL,
		Icon:     m.Icon,
		ParentID: m.ParentID,
	}

	if len(m.Children) > 0 {
		resp.Children = make([]MenuResponse, len(m.Children))
		for i, child := range m.Children {
			resp.Children[i] = toMenuResponse(child)
		}
	}

	return resp
}

// @Summary Get menus by role
// @Description Get menus accessible by a specific role
// @Tags menus
// @Produce json
// @Param role_id query int true "Role ID"
// @Success 200 {array} MenuResponse
// @Failure 400 {object} ErrorResponse
// @Router /menus/by-role [get]
func GetMenusByRole(service *application.MenuService) gin.HandlerFunc {
	return func(c *gin.Context) {
		roleIDStr := c.Query("role_id")
		roleID, err := strconv.Atoi(roleIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid role ID"})
			return
		}

		menus, err := service.GetMenusByRoleID(roleID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
			return
		}

		// Convert to response format
		response := make([]MenuResponse, len(menus))
		for i, m := range menus {
			response[i] = toMenuResponse(m)
		}

		c.JSON(http.StatusOK, response)
	}
}

// @Summary Get menus by user
// @Description Get menus accessible by a specific user
// @Tags menus
// @Produce json
// @Param user_id path string true "User ID"
// @Success 200 {array} MenuResponse
// @Failure 400 {object} ErrorResponse
// @Router /menus/by-user/{user_id} [get]
func GetMenusByUser(service *application.MenuService) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.Param("user_id")
		if userID == "" {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "User ID is required"})
			return
		}

		menus, err := service.GetMenusByUserID(userID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
			return
		}

		// Convert to response format
		response := make([]MenuResponse, len(menus))
		for i, m := range menus {
			response[i] = toMenuResponse(m)
		}

		c.JSON(http.StatusOK, response)
	}
}