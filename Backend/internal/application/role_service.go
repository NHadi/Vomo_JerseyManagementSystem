package application

import (
	"vomo/internal/domain/menu"
	"vomo/internal/domain/permission"
	"vomo/internal/domain/role"
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

func (s *RoleService) Create(role *role.Role) error {
	return s.repository.Create(role)
}

func (s *RoleService) FindByID(id int) (*role.Role, error) {
	return s.repository.FindByID(id)
}

func (s *RoleService) FindByName(name string) (*role.Role, error) {
	return s.repository.FindByName(name)
}

func (s *RoleService) Update(role *role.Role) error {
	return s.repository.Update(role)
}

func (s *RoleService) Delete(id int) error {
	return s.repository.Delete(id)
}

func (s *RoleService) AssignMenus(roleID int, menuIDs []int) error {
	return s.repository.AssignMenus(roleID, menuIDs)
}

func (s *RoleService) RemoveMenus(roleID int, menuIDs []int) error {
	return s.repository.RemoveMenus(roleID, menuIDs)
}

func (s *RoleService) GetRoleMenus(roleID int) ([]menu.Menu, error) {
	return s.repository.GetRoleMenus(roleID)
}

func (s *RoleService) AssignPermissions(roleID int, permissionIDs []int) error {
	return s.repository.AssignPermissions(roleID, permissionIDs)
}

func (s *RoleService) RemovePermissions(roleID int, permissionIDs []int) error {
	return s.repository.RemovePermissions(roleID, permissionIDs)
}

func (s *RoleService) GetRolePermissions(roleID int) ([]permission.Permission, error) {
	return s.repository.GetRolePermissions(roleID)
}

func (s *RoleService) FindAll() ([]role.Role, error) {
	return s.repository.FindAll()
}
