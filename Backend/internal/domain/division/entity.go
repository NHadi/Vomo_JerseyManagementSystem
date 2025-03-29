package division

import (
	"context"
	"vomo/internal/domain/common"
)

// Division represents the master_division table
type Division struct {
	ID          int    `gorm:"primaryKey;autoIncrement:true;column:id" json:"id"`
	Name        string `gorm:"type:varchar(100);not null" json:"name"`
	Description string `gorm:"type:text" json:"description"`
	common.TenantModel
}

func (Division) TableName() string {
	return "master_division"
}

type Repository interface {
	Create(division *Division, ctx context.Context) error
	FindByID(id int, ctx context.Context) (*Division, error)
	FindAll(ctx context.Context) ([]Division, error)
	Update(division *Division, ctx context.Context) error
	Delete(id int, ctx context.Context) error
}
