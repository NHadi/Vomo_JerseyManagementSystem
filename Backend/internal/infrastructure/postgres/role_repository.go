package postgres

import (
	"time"
	"vomo/internal/domain/appcontext"
	"vomo/internal/domain/menu"
	"vomo/internal/domain/permission"
	"vomo/internal/domain/role"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type RoleRepository struct {
	db *gorm.DB
}

func NewRoleRepository(db *gorm.DB) *RoleRepository {
	return &RoleRepository{db: db}
}

func (r *RoleRepository) Create(role *role.Role, ctx *gin.Context) error {
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	role.CreatedBy = userCtx.Username
	role.UpdatedBy = userCtx.Username
	return r.db.WithContext(ctx.Request.Context()).Create(role).Error
}

func (r *RoleRepository) FindByID(id int, ctx *gin.Context) (*role.Role, error) {
	var role role.Role
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	if err := r.db.WithContext(ctx.Request.Context()).Preload("Permissions").Where("id = ? AND tenant_id = ?", id, userCtx.TenantID).First(&role).Error; err != nil {
		return nil, err
	}
	return &role, nil
}

func (r *RoleRepository) FindByName(name string, ctx *gin.Context) (*role.Role, error) {
	var role role.Role
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	if err := r.db.WithContext(ctx.Request.Context()).Preload("Permissions").Where("name = ? AND tenant_id = ?", name, userCtx.TenantID).First(&role).Error; err != nil {
		return nil, err
	}
	return &role, nil
}

func (r *RoleRepository) FindAll(ctx *gin.Context) ([]role.Role, error) {
	var roles []role.Role
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	if err := r.db.WithContext(ctx.Request.Context()).Preload("Permissions").Where("tenant_id = ?", userCtx.TenantID).Find(&roles).Error; err != nil {
		return nil, err
	}
	return roles, nil
}

func (r *RoleRepository) Update(role *role.Role, ctx *gin.Context) error {
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)

	// First verify the role exists and belongs to the tenant
	var existingRole struct {
		ID          int
		Name        string
		Description string
		TenantID    int
		CreatedBy   string
		UpdatedBy   string
		CreatedAt   time.Time
		UpdatedAt   time.Time
	}
	if err := r.db.WithContext(ctx.Request.Context()).
		Table("master_role").
		Where("id = ? AND tenant_id = ?", role.ID, userCtx.TenantID).
		First(&existingRole).Error; err != nil {
		return err
	}

	// Update only specific fields while preserving others
	return r.db.WithContext(ctx.Request.Context()).
		Table("master_role").
		Where("id = ? AND tenant_id = ?", role.ID, userCtx.TenantID).
		Updates(map[string]interface{}{
			"name":        role.Name,
			"description": role.Description,
			"updated_by":  userCtx.Username,
			"updated_at":  time.Now(),
		}).Error
}

func (r *RoleRepository) Delete(id int, ctx *gin.Context) error {
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)

	return r.db.WithContext(ctx.Request.Context()).Transaction(func(tx *gorm.DB) error {
		// First delete all role_menus associations
		if err := tx.Exec("DELETE FROM role_menus WHERE role_id = ?", id).Error; err != nil {
			return err
		}

		// Then delete all role_permissions associations
		if err := tx.Exec("DELETE FROM role_permissions WHERE role_id = ?", id).Error; err != nil {
			return err
		}

		// Finally delete the role itself
		if err := tx.Where("id = ? AND tenant_id = ?", id, userCtx.TenantID).Delete(&role.Role{}).Error; err != nil {
			return err
		}

		return nil
	})
}

func (r *RoleRepository) AssignPermissions(roleID int, permissionIDs []int, ctx *gin.Context) error {
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	return r.db.WithContext(ctx.Request.Context()).Transaction(func(tx *gorm.DB) error {
		// First verify the role exists and belongs to the tenant
		var existingRole struct {
			ID       int
			TenantID int
		}
		if err := tx.Table("master_role").
			Where("id = ? AND tenant_id = ?", roleID, userCtx.TenantID).
			First(&existingRole).Error; err != nil {
			return err
		}

		// Delete existing permissions
		if err := tx.Exec("DELETE FROM role_permissions WHERE role_id = ?", roleID).Error; err != nil {
			return err
		}

		// Insert new permissions
		for _, permissionID := range permissionIDs {
			now := time.Now()
			if err := tx.Exec(`
				INSERT INTO role_permissions (role_id, permission_id, created_by, updated_by, created_at, updated_at)
				VALUES (?, ?, ?, ?, ?, ?)
			`, roleID, permissionID, userCtx.Username, userCtx.Username, now, now).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

func (r *RoleRepository) RemovePermissions(roleID int, permissionIDs []int, ctx *gin.Context) error {
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	return r.db.WithContext(ctx.Request.Context()).Transaction(func(tx *gorm.DB) error {
		// Get the role to get tenant_id
		var role role.Role
		if err := tx.First(&role, roleID).Error; err != nil {
			return err
		}

		// Instead of deleting, we'll insert new records with the current state
		for _, permissionID := range permissionIDs {
			now := time.Now()
			if err := tx.Table("role_permissions").Create(map[string]interface{}{
				"role_id":       roleID,
				"permission_id": permissionID,
				"tenant_id":     role.TenantID,
				"created_by":    userCtx.Username,
				"updated_by":    userCtx.Username,
				"created_at":    now,
				"updated_at":    now,
				"deleted_at":    now, // Mark as deleted immediately
			}).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

func (r *RoleRepository) GetRolePermissions(roleID int, ctx *gin.Context) ([]permission.Permission, error) {
	permissions := make([]permission.Permission, 0) // Initialize with empty slice
	err := r.db.WithContext(ctx.Request.Context()).Table("role_permissions").
		Select("master_permission.*").
		Joins("JOIN master_permission ON master_permission.id = role_permissions.permission_id").
		Where("role_permissions.role_id = ?", roleID).
		Find(&permissions).Error
	return permissions, err
}

func (r *RoleRepository) AssignMenus(roleID int, menuIDs []int, ctx *gin.Context) error {
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	return r.db.WithContext(ctx.Request.Context()).Transaction(func(tx *gorm.DB) error {
		if err := tx.Delete(&role.RoleMenu{}, "role_id = ?", roleID).Error; err != nil {
			return err
		}

		for _, menuID := range menuIDs {
			now := time.Now()
			if err := tx.Table("role_menus").Create(map[string]interface{}{
				"role_id":    roleID,
				"menu_id":    menuID,
				"created_by": userCtx.Username,
				"updated_by": userCtx.Username,
				"created_at": now,
				"updated_at": now,
			}).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

func (r *RoleRepository) RemoveMenus(roleID int, menuIDs []int, ctx *gin.Context) error {
	return r.db.WithContext(ctx.Request.Context()).Delete(&role.RoleMenu{}, "role_id = ? AND menu_id IN ?", roleID, menuIDs).Error
}

func (r *RoleRepository) GetRoleMenus(roleID int, ctx *gin.Context) ([]menu.Menu, error) {
	var menus []menu.Menu
	err := r.db.WithContext(ctx.Request.Context()).Table("master_menu").
		Joins("JOIN role_menus ON role_menus.menu_id = master_menu.id").
		Where("role_menus.role_id = ?", roleID).
		Find(&menus).Error
	return menus, err
}
