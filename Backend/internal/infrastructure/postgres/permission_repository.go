package postgres

import (
	"vomo/internal/domain/permission"

	"gorm.io/gorm"
)

type PermissionRepository struct {
	db *gorm.DB
}

func NewPermissionRepository(db *gorm.DB) permission.Repository {
	return &PermissionRepository{
		db: db,
	}
}

func (r *PermissionRepository) Create(permission *permission.Permission) error {
	return r.db.Create(permission).Error
}

func (r *PermissionRepository) FindByID(id int) (*permission.Permission, error) {
	var perm permission.Permission
	err := r.db.First(&perm, id).Error
	if err != nil {
		return nil, err
	}
	return &perm, nil
}

func (r *PermissionRepository) FindByName(name string) (*permission.Permission, error) {
	var perm permission.Permission
	err := r.db.Where("name = ?", name).First(&perm).Error
	if err != nil {
		return nil, err
	}
	return &perm, nil
}

func (r *PermissionRepository) FindAll() ([]permission.Permission, error) {
	var permissions []permission.Permission
	err := r.db.Find(&permissions).Error
	return permissions, err
}

func (r *PermissionRepository) Update(permission *permission.Permission) error {
	return r.db.Save(permission).Error
}

func (r *PermissionRepository) Delete(id int) error {
	return r.db.Delete(&permission.Permission{}, id).Error
}

func (r *PermissionRepository) FindByCode(code string) (*permission.Permission, error) {
	var perm permission.Permission
	err := r.db.Where("code = ?", code).First(&perm).Error
	if err != nil {
		return nil, err
	}
	return &perm, nil
}
