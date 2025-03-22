package user

import (
    "time"
    "github.com/google/uuid"
    "vomo/internal/domain/common"
)

type User struct {
    ID       uuid.UUID `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
    Username string    `gorm:"type:varchar(255);not null" json:"username"`
    Email    string    `gorm:"type:varchar(255);unique;not null" json:"email"`
    Password string    `gorm:"type:varchar(255);not null" json:"-"`
    RoleID   int       `gorm:"type:integer;not null" json:"role_id"`
    common.TenantModel
    CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
    UpdatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

type Repository interface {
    Create(user *User) error
    FindByID(id uuid.UUID) (*User, error)
    FindByEmail(email string) (*User, error)
    Update(user *User) error
    Delete(id uuid.UUID) error
    List(page, pageSize int) ([]User, error)
    Count() (int64, error)
}