package role

import (
    "time"
    "github.com/google/uuid"
)

type Role struct {
    ID          uuid.UUID   `json:"id"`
    Name        string      `json:"name"`
    Description string      `json:"description"`
    Permissions []string    `json:"permissions"`
    CreatedAt   time.Time   `json:"created_at"`
    UpdatedAt   time.Time   `json:"updated_at"`
}

type Repository interface {
    Create(role *Role) error
    FindByID(id uuid.UUID) (*Role, error)
    FindByName(name string) (*Role, error)
    Update(role *Role) error
    Delete(id uuid.UUID) error
}