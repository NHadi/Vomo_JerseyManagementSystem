package menu

import (
	"vomo/internal/domain/common"
)

type Menu struct {
	ID       int     `gorm:"primaryKey" json:"id"`
	Name     string  `gorm:"type:varchar(100);not null" json:"name"`
	URL      string  `gorm:"type:varchar(255)" json:"url"`
	Icon     string  `gorm:"type:varchar(50)" json:"icon"`
	ParentID *int    `gorm:"index" json:"parent_id"`
	Children []*Menu `gorm:"-" json:"children,omitempty"`
	common.TenantModel
}

func (Menu) TableName() string {
	return "master_menu"
}
