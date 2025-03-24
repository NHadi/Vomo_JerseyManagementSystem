package role

import (
	"time"
	"vomo/internal/domain/common"
	"vomo/internal/domain/menu"
	"vomo/internal/domain/permission"
)

// Role represents the master_role table
type Role struct {
	ID          int                     `gorm:"primaryKey;autoIncrement:true;column:id" json:"id"`
	Name        string                  `gorm:"type:varchar(100);not null;unique" json:"name"`
	Description string                  `gorm:"type:text" json:"description"`
	Menus       []menu.Menu             `gorm:"many2many:role_menus;" json:"menus,omitempty"`
	Permissions []permission.Permission `gorm:"many2many:role_permissions;" json:"permissions"`
	common.TenantModel
}

// RoleMenu represents the role_menus junction table
type RoleMenu struct {
	ID     int `gorm:"primaryKey;autoIncrement:true;column:id"`
	RoleID int `gorm:"column:role_id"`
	MenuID int `gorm:"column:menu_id"`
	common.TenantModel
}

// RolePermission represents the role_permissions table
type RolePermission struct {
	ID           int       `gorm:"primaryKey;autoIncrement:true;column:id"`
	RoleID       int       `gorm:"column:role_id"`
	PermissionID int       `gorm:"column:permission_id"`
	CreatedAt    time.Time `gorm:"column:created_at;default:CURRENT_TIMESTAMP"`
}

func (Role) TableName() string {
	return "master_role"
}

func (RoleMenu) TableName() string {
	return "role_menus"
}

func (RolePermission) TableName() string {
	return "role_permissions"
}
