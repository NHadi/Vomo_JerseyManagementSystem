package common

import "time"

type TenantModel struct {
	TenantID  int       `gorm:"not null" json:"tenant_id"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}