package postgres

import (
	"errors"
	"vomo/internal/domain/product"

	"gorm.io/gorm"
)

// ProductRepository implements the product.ProductRepository interface
type ProductRepository struct {
	db *gorm.DB
}

// NewProductRepository creates a new product repository
func NewProductRepository(db *gorm.DB) *ProductRepository {
	return &ProductRepository{
		db: db,
	}
}

// Create creates a new product
func (r *ProductRepository) Create(product *product.Product) error {
	return r.db.Create(product).Error
}

// FindByID finds a product by ID
func (r *ProductRepository) FindByID(id int) (*product.Product, error) {
	var product product.Product
	if err := r.db.First(&product, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("product not found")
		}
		return nil, err
	}
	return &product, nil
}

// FindByCode finds a product by code
func (r *ProductRepository) FindByCode(code string) (*product.Product, error) {
	var product product.Product
	if err := r.db.Where("code = ?", code).First(&product).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &product, nil
}

// FindAll retrieves all products
func (r *ProductRepository) FindAll() ([]product.Product, error) {
	var products []product.Product
	if err := r.db.Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

// FindByCategoryID retrieves all products in a category
func (r *ProductRepository) FindByCategoryID(categoryID int) ([]product.Product, error) {
	var products []product.Product
	if err := r.db.Where("category_id = ?", categoryID).Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

// Update updates an existing product
func (r *ProductRepository) Update(product *product.Product) error {
	result := r.db.Save(product)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("product not found")
	}
	return nil
}

// Delete deletes a product
func (r *ProductRepository) Delete(id int) error {
	result := r.db.Delete(&product.Product{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("product not found")
	}
	return nil
}
