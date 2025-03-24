package application

import (
	"vomo/internal/domain/menu"
	"vomo/internal/domain/permission"
	"vomo/internal/domain/role"

	"github.com/gin-gonic/gin"
)

type RoleService struct {
	repository     role.Repository
	permissionRepo permission.Repository
}

func NewRoleService(repo role.Repository, permRepo permission.Repository) *RoleService {
	return &RoleService{
		repository:     repo,
		permissionRepo: permRepo,
	}
}

func (s *RoleService) Create(role *role.Role, ctx *gin.Context) error {
	return s.repository.Create(role, ctx)
}

func (s *RoleService) FindByID(id int, ctx *gin.Context) (*role.Role, error) {
	return s.repository.FindByID(id, ctx)
}

func (s *RoleService) FindByName(name string, ctx *gin.Context) (*role.Role, error) {
	return s.repository.FindByName(name, ctx)
}

func (s *RoleService) Update(role *role.Role, ctx *gin.Context) error {
	return s.repository.Update(role, ctx)
}

func (s *RoleService) Delete(id int, ctx *gin.Context) error {
	return s.repository.Delete(id, ctx)
}

func (s *RoleService) AssignMenus(roleID int, menuIDs []int, ctx *gin.Context) error {
	return s.repository.AssignMenus(roleID, menuIDs, ctx)
}

func (s *RoleService) RemoveMenus(roleID int, menuIDs []int, ctx *gin.Context) error {
	return s.repository.RemoveMenus(roleID, menuIDs, ctx)
}

func (s *RoleService) GetRoleMenus(roleID int, ctx *gin.Context) ([]menu.Menu, error) {
	return s.repository.GetRoleMenus(roleID, ctx)
}

func (s *RoleService) AssignPermissions(roleID int, permissionIDs []int, ctx *gin.Context) error {
	return s.repository.AssignPermissions(roleID, permissionIDs, ctx)
}

func (s *RoleService) RemovePermissions(roleID int, permissionIDs []int, ctx *gin.Context) error {
	return s.repository.RemovePermissions(roleID, permissionIDs, ctx)
}

func (s *RoleService) GetRolePermissions(roleID int, ctx *gin.Context) ([]permission.Permission, error) {
	return s.repository.GetRolePermissions(roleID, ctx)
}

func (s *RoleService) FindAll(ctx *gin.Context) ([]role.Role, error) {
	return s.repository.FindAll(ctx)
}
