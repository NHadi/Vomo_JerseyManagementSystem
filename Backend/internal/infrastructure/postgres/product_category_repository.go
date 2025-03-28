package postgres

import (
	"errors"
	"vomo/internal/domain/product"

	"gorm.io/gorm"
)

// ProductCategoryRepository implements the product.CategoryRepository interface
type ProductCategoryRepository struct {
	db *gorm.DB
}

// NewProductCategoryRepository creates a new product category repository
func NewProductCategoryRepository(db *gorm.DB) *ProductCategoryRepository {
	return &ProductCategoryRepository{
		db: db,
	}
}

// Create creates a new product category
func (r *ProductCategoryRepository) Create(category *product.Category) error {
	return r.db.Create(category).Error
}

// FindByID finds a product category by ID
func (r *ProductCategoryRepository) FindByID(id int) (*product.Category, error) {
	var category product.Category
	if err := r.db.First(&category, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("category not found")
		}
		return nil, err
	}
	return &category, nil
}

// FindByCode finds a product category by code
func (r *ProductCategoryRepository) FindByCode(code string) (*product.Category, error) {
	var category product.Category
	if err := r.db.Where("code = ?", code).First(&category).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &category, nil
}

// FindAll retrieves all product categories
func (r *ProductCategoryRepository) FindAll() ([]product.Category, error) {
	var categories []product.Category
	if err := r.db.Find(&categories).Error; err != nil {
		return nil, err
	}
	return categories, nil
}

// Update updates an existing product category
func (r *ProductCategoryRepository) Update(category *product.Category) error {
	result := r.db.Save(category)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("category not found")
	}
	return nil
}

// Delete deletes a product category
func (r *ProductCategoryRepository) Delete(id int) error {
	result := r.db.Delete(&product.Category{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("category not found")
	}
	return nil
}
