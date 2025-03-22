package postgres

import (
	"vomo/internal/domain/menu"

	"gorm.io/gorm"
)

type MenuRepository struct {
	db *gorm.DB
}

func NewMenuRepository(db *gorm.DB) *MenuRepository {
	return &MenuRepository{db: db}
}

func (r *MenuRepository) FindAll(tenantID int) ([]menu.Menu, error) {
	var menus []menu.Menu
	err := r.db.Where("tenant_id = ?", tenantID).
		Order("sort ASC, id ASC").
		Find(&menus).Error
	return menus, err
}

func (r *MenuRepository) FindByRoleID(roleID int, tenantID int) ([]menu.Menu, error) {
	var menus []menu.Menu
	err := r.db.Joins("JOIN role_menus ON role_menus.menu_id = master_menu.id").
		Where("role_menus.role_id = ? AND master_menu.tenant_id = ?", roleID, tenantID).
		Order("master_menu.sort ASC, master_menu.id ASC").
		Find(&menus).Error
	return menus, err
}

func (r *MenuRepository) FindByUserID(userID string, tenantID int) ([]menu.Menu, error) {
	var menus []menu.Menu
	err := r.db.Joins("JOIN user_menus ON user_menus.menu_id = master_menu.id").
		Where("user_menus.user_id = ? AND master_menu.tenant_id = ?", userID, tenantID).
		Order("master_menu.sort ASC, master_menu.id ASC").
		Find(&menus).Error
	return menus, err
}

func (r *MenuRepository) FindByID(id int, tenantID int) (*menu.Menu, error) {
	var menu menu.Menu
	err := r.db.Where("id = ? AND tenant_id = ?", id, tenantID).First(&menu).Error
	if err != nil {
		return nil, err
	}
	return &menu, nil
}

func (r *MenuRepository) Create(menu *menu.Menu) error {
	return r.db.Create(menu).Error
}

func (r *MenuRepository) Update(menu *menu.Menu) error {
	return r.db.Save(menu).Error
}

func (r *MenuRepository) Delete(id, tenantID int) error {
	return r.db.Where("id = ? AND tenant_id = ?", id, tenantID).Delete(&menu.Menu{}).Error
}
