package postgres

import (
	"vomo/internal/domain/menu"
	"vomo/internal/domain/role"

	"gorm.io/gorm"
)

type roleRepository struct {
	db *gorm.DB
}

func NewRoleRepository(db *gorm.DB) role.Repository {
	return &roleRepository{
		db: db,
	}
}

func (r *roleRepository) Create(role *role.Role) error {
	return r.db.Create(role).Error
}

func (r *roleRepository) FindByID(id int) (*role.Role, error) {
	var role role.Role
	err := r.db.Preload("Menus").First(&role, "id = ?", id).Error
	if err != nil {
		return nil, err
	}

	// Load permissions
	permissions, err := r.GetRolePermissions(id)
	if err != nil {
		return nil, err
	}
	role.Permissions = permissions

	return &role, nil
}

func (r *roleRepository) FindByName(name string) (*role.Role, error) {
	var role role.Role
	err := r.db.Preload("Menus").First(&role, "name = ?", name).Error
	if err != nil {
		return nil, err
	}

	// Load permissions
	permissions, err := r.GetRolePermissions(role.ID)
	if err != nil {
		return nil, err
	}
	role.Permissions = permissions

	return &role, nil
}

func (r *roleRepository) Update(role *role.Role) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		// Update role basic information
		if err := tx.Save(role).Error; err != nil {
			return err
		}

		// Update permissions if provided
		if role.Permissions != nil {
			if err := r.AssignPermissions(role.ID, role.Permissions); err != nil {
				return err
			}
		}

		return nil
	})
}

func (r *roleRepository) Delete(id int) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		// Delete role_menus associations
		if err := tx.Delete(&role.RoleMenu{}, "role_id = ?", id).Error; err != nil {
			return err
		}

		// Delete role_permissions associations
		if err := tx.Delete(&role.RolePermission{}, "role_id = ?", id).Error; err != nil {
			return err
		}

		// Delete the role
		return tx.Delete(&role.Role{}, "id = ?", id).Error
	})
}

func (r *roleRepository) AssignMenus(roleID int, menuIDs []int) error {
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

func (r *roleRepository) RemoveMenus(roleID int, menuIDs []int) error {
	return r.db.Delete(&role.RoleMenu{}, "role_id = ? AND menu_id IN ?", roleID, menuIDs).Error
}

func (r *roleRepository) GetRoleMenus(roleID int) ([]menu.Menu, error) {
	var menus []menu.Menu
	err := r.db.Table("master_menu").
		Joins("JOIN role_menus ON role_menus.menu_id = master_menu.id").
		Where("role_menus.role_id = ?", roleID).
		Find(&menus).Error
	return menus, err
}

func (r *roleRepository) AssignPermissions(roleID int, permissionIDs []int) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		// Remove existing permissions
		if err := tx.Delete(&role.RolePermission{}, "role_id = ?", roleID).Error; err != nil {
			return err
		}

		// Create new permissions
		for _, permissionID := range permissionIDs {
			rolePermission := &role.RolePermission{
				RoleID:       roleID,
				PermissionID: permissionID,
			}
			if err := tx.Create(rolePermission).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

func (r *roleRepository) RemovePermissions(roleID int, permissionIDs []int) error {
	return r.db.Delete(&role.RolePermission{}, "role_id = ? AND permission_id IN ?", roleID, permissionIDs).Error
}

func (r *roleRepository) GetRolePermissions(roleID int) ([]int, error) {
	var permissionIDs []int
	err := r.db.Model(&role.RolePermission{}).
		Where("role_id = ?", roleID).
		Pluck("permission_id", &permissionIDs).Error
	return permissionIDs, err
}
