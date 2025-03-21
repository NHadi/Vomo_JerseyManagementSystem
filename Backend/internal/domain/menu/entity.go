package menu

import (
	"time"
)

type Menu struct {
	ID        int       `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"type:varchar(100);not null" json:"name"`
	URL       string    `gorm:"type:varchar(255)" json:"url"`
	Icon      string    `gorm:"type:varchar(50)" json:"icon"`
	ParentID  *int      `gorm:"type:integer" json:"parent_id"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
	Children  []Menu    `gorm:"-" json:"children,omitempty"`
}

// TableName specifies the table name for the Menu entity
func (Menu) TableName() string {
	return "master_menu"
}