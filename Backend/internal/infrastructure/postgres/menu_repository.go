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

func (r *MenuRepository) FindAll() ([]menu.Menu, error) {
	var menus []menu.Menu
	if err := r.db.Order("id ASC").Find(&menus).Error; err != nil {
		return nil, err
	}
	return menus, nil
}

func (r *MenuRepository) FindByID(id int) (*menu.Menu, error) {
	var m menu.Menu
	if err := r.db.First(&m, id).Error; err != nil {
		return nil, err
	}
	return &m, nil
}

func (r *MenuRepository) FindByRoleID(roleID int) ([]menu.Menu, error) {
	var menus []menu.Menu
	if err := r.db.Table("master_menu").
		Joins("JOIN role_menus ON master_menu.id = role_menus.menu_id").
		Where("role_menus.role_id = ?", roleID).
		Order("master_menu.id ASC").
		Find(&menus).Error; err != nil {
		return nil, err
	}
	return menus, nil
}

func (r *MenuRepository) FindByUserID(userID string) ([]menu.Menu, error) {
	var menus []menu.Menu
	if err := r.db.Table("master_menu").
		Joins("JOIN role_menus ON master_menu.id = role_menus.menu_id").
		Joins("JOIN users ON role_menus.role_id = users.role_id").
		Where("users.id = ?", userID).
		Order("master_menu.id ASC").
		Find(&menus).Error; err != nil {
		return nil, err
	}
	return menus, nil
}

func (r *MenuRepository) Create(menu *menu.Menu) error {
	return r.db.Create(menu).Error
}

func (r *MenuRepository) Update(menu *menu.Menu) error {
	return r.db.Save(menu).Error
}

func (r *MenuRepository) Delete(id int) error {
	return r.db.Delete(&menu.Menu{}, id).Error
}