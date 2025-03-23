package user

import (
	"github.com/google/uuid"
)

// Repository defines the interface for user data access
type Repository interface {
	Create(user *User) error
	FindByID(id uuid.UUID) (*User, error)
	FindByEmail(email string) (*User, error)
	FindByUsername(username string) (*User, error)
	FindAll() ([]User, error)
	Update(user *User) error
	Delete(id uuid.UUID) error
	List(page, pageSize int) ([]User, error)
	Count() (int64, error)
	GetUserPermissions(userID uuid.UUID) ([]string, error)
	AssignRole(userID uuid.UUID, roleID int) error
	RemoveRole(userID uuid.UUID, roleID int) error
}
