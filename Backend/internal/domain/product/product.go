package product

import (
	"time"
)

// Product represents a product
type Product struct {
	ID                   int             `json:"id"`
	Name                 string          `json:"name"`
	Code                 string          `json:"code"`
	CategoryID           int             `json:"category_id"`
	Description          string          `json:"description"`
	Material             string          `json:"material"`
	SizeAvailable        []string        `json:"size_available"`
	ColorOptions         []string        `json:"color_options"`
	CustomizationOptions map[string]bool `json:"customization_options"`
	ProductionTime       int             `json:"production_time"`
	MinOrderQuantity     int             `json:"min_order_quantity"`
	BasePrice            float64         `json:"base_price"`
	BulkDiscountRules    map[string]int  `json:"bulk_discount_rules"`
	Weight               float64         `json:"weight"`
	IsActive             bool            `json:"is_active"`
	StockStatus          string          `json:"stock_status"`
	TenantID             int             `json:"tenant_id"`
	CreatedAt            time.Time       `json:"created_at"`
	UpdatedAt            time.Time       `json:"updated_at"`
	CreatedBy            string          `json:"created_by"`
	UpdatedBy            string          `json:"updated_by"`
}

// ProductRepository defines the interface for product data access
type ProductRepository interface {
	Create(product *Product) error
	FindByID(id int) (*Product, error)
	FindByCode(code string) (*Product, error)
	FindAll() ([]Product, error)
	FindByCategoryID(categoryID int) ([]Product, error)
	Update(product *Product) error
	Delete(id int) error
}
