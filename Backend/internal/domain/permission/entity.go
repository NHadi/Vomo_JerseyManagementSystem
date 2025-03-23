package permission

import (
	"vomo/internal/domain/common"
)

// Permission represents the master_permission table
type Permission struct {
	ID          int    `gorm:"primaryKey;autoIncrement:true;column:id" json:"id"`
	Name        string `gorm:"type:varchar(100);not null" json:"name"`
	Description string `gorm:"type:text" json:"description"`
	Code        string `gorm:"type:varchar(100);not null;unique" json:"code"`
	Module      string `gorm:"type:varchar(100);not null" json:"module"`
	common.TenantModel
}

func (Permission) TableName() string {
	return "master_permission"
}

type Repository interface {
	Create(permission *Permission) error
	FindByID(id int) (*Permission, error)
	FindByCode(code string) (*Permission, error)
	FindByName(name string) (*Permission, error)
	FindAll() ([]Permission, error)
	Update(permission *Permission) error
	Delete(id int) error
}
