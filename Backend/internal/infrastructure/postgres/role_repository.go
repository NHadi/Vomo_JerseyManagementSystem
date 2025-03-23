package postgres

import (
	"vomo/internal/domain/menu"
	"vomo/internal/domain/permission"
	"vomo/internal/domain/role"

	"gorm.io/gorm"
)

type RoleRepository struct {
	db *gorm.DB
}

func NewRoleRepository(db *gorm.DB) *RoleRepository {
	return &RoleRepository{db: db}
}

func (r *RoleRepository) Create(role *role.Role) error {
	return r.db.Create(role).Error
}

func (r *RoleRepository) FindByID(id int) (*role.Role, error) {
	var role role.Role
	if err := r.db.Preload("Permissions").First(&role, id).Error; err != nil {
		return nil, err
	}
	return &role, nil
}

func (r *RoleRepository) FindByName(name string) (*role.Role, error) {
	var role role.Role
	if err := r.db.Preload("Permissions").Where("name = ?", name).First(&role).Error; err != nil {
		return nil, err
	}
	return &role, nil
}

func (r *RoleRepository) FindAll() ([]role.Role, error) {
	var roles []role.Role
	if err := r.db.Preload("Permissions").Find(&roles).Error; err != nil {
		return nil, err
	}
	return roles, nil
}

func (r *RoleRepository) Update(role *role.Role) error {
	return r.db.Save(role).Error
}

func (r *RoleRepository) Delete(id int) error {
	return r.db.Delete(&role.Role{}, id).Error
}

func (r *RoleRepository) AssignPermissions(roleID int, permissionIDs []int) error {
	// Start a transaction
	return r.db.Transaction(func(tx *gorm.DB) error {
		// Clear existing permissions for the role
		if err := tx.Table("role_permission").Where("role_id = ?", roleID).Delete(&struct{}{}).Error; err != nil {
			return err
		}

		// Insert new permissions
		for _, permID := range permissionIDs {
			if err := tx.Table("role_permission").Create(map[string]interface{}{
				"role_id":       roleID,
				"permission_id": permID,
			}).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

func (r *RoleRepository) RemovePermissions(roleID int, permissionIDs []int) error {
	return r.db.Table("role_permission").
		Where("role_id = ? AND permission_id IN ?", roleID, permissionIDs).
		Delete(&struct{}{}).Error
}

func (r *RoleRepository) GetRolePermissions(roleID int) ([]permission.Permission, error) {
	var permissions []permission.Permission
	err := r.db.Table("master_permission").
		Joins("JOIN role_permission ON master_permission.id = role_permission.permission_id").
		Where("role_permission.role_id = ?", roleID).
		Find(&permissions).Error
	return permissions, err
}

func (r *RoleRepository) AssignMenus(roleID int, menuIDs []int) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		// Remove existing menu assignments
		if err := tx.Delete(&role.RoleMenu{}, "role_id = ?", roleID).Error; err != nil {
			return err
		}

		// Create new menu assignments
		for _, menuID := range menuIDs {
			roleMenu := &role.RoleMenu{
				RoleID: roleID,
				MenuID: menuID,
			}
			if err := tx.Create(roleMenu).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

func (r *RoleRepository) RemoveMenus(roleID int, menuIDs []int) error {
	return r.db.Delete(&role.RoleMenu{}, "role_id = ? AND menu_id IN ?", roleID, menuIDs).Error
}

func (r *RoleRepository) GetRoleMenus(roleID int) ([]menu.Menu, error) {
	var menus []menu.Menu
	err := r.db.Table("master_menu").
		Joins("JOIN role_menus ON role_menus.menu_id = master_menu.id").
		Where("role_menus.role_id = ?", roleID).
		Find(&menus).Error
	return menus, err
}
