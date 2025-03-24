package role

import (
	"vomo/internal/domain/menu"
	"vomo/internal/domain/permission"

	"github.com/gin-gonic/gin"
)

type Repository interface {
	Create(role *Role, ctx *gin.Context) error
	FindByID(id int, ctx *gin.Context) (*Role, error)
	FindByName(name string, ctx *gin.Context) (*Role, error)
	FindAll(ctx *gin.Context) ([]Role, error)
	Update(role *Role, ctx *gin.Context) error
	Delete(id int, ctx *gin.Context) error
	AssignMenus(roleID int, menuIDs []int, ctx *gin.Context) error
	RemoveMenus(roleID int, menuIDs []int, ctx *gin.Context) error
	GetRoleMenus(roleID int, ctx *gin.Context) ([]menu.Menu, error)
	AssignPermissions(roleID int, permissionIDs []int, ctx *gin.Context) error
	RemovePermissions(roleID int, permissionIDs []int, ctx *gin.Context) error
	GetRolePermissions(roleID int, ctx *gin.Context) ([]permission.Permission, error)
}
