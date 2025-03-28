package backup

import (
	"context"
	"time"
)

type Backup struct {
	ID        int       `json:"id" gorm:"primaryKey;autoIncrement"`
	FileName  string    `json:"file_name" gorm:"not null"`
	Size      int64     `json:"size" gorm:"not null"`
	CreatedAt time.Time `json:"created_at" gorm:"not null;default:CURRENT_TIMESTAMP"`
	CreatedBy string    `json:"created_by" gorm:"not null"`
	TenantID  int       `json:"tenant_id" gorm:"not null"`
}

// TableName specifies the table name for the Backup entity
func (Backup) TableName() string {
	return "backup"
}

type Repository interface {
	Create(ctx context.Context, backup *Backup) error
	FindByID(ctx context.Context, id int) (*Backup, error)
	FindAll(ctx context.Context) ([]Backup, error)
	Delete(ctx context.Context, id int) error
}

type Service interface {
	CreateBackup(ctx context.Context) (*Backup, error)
	RestoreBackup(ctx context.Context, backupID int) error
	ListBackups(ctx context.Context) ([]Backup, error)
	DeleteBackup(ctx context.Context, backupID int) error
}
