package product

import (
	"time"
)

// Category represents a product category
type Category struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Code        string    `json:"code"`
	Description string    `json:"description"`
	IsActive    bool      `json:"is_active"`
	TenantID    int       `json:"tenant_id"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	CreatedBy   string    `json:"created_by"`
	UpdatedBy   string    `json:"updated_by"`
}

func (Category) TableName() string {
	return "master_product_category"
}

// CategoryRepository defines the interface for category data access
type CategoryRepository interface {
	Create(category *Category) error
	FindByID(id int) (*Category, error)
	FindByCode(code string) (*Category, error)
	FindAll() ([]Category, error)
	Update(category *Category) error
	Delete(id int) error
}
