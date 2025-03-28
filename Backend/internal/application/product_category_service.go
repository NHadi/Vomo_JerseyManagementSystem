package application

import (
	"context"
	"vomo/internal/domain/product"
)

// ProductCategoryService handles business logic for product categories
type ProductCategoryService struct {
	repo product.CategoryRepository
}

// NewProductCategoryService creates a new product category service
func NewProductCategoryService(repo product.CategoryRepository) *ProductCategoryService {
	return &ProductCategoryService{
		repo: repo,
	}
}

// Create creates a new product category
func (s *ProductCategoryService) Create(category *product.Category, ctx context.Context) error {
	return s.repo.Create(category)
}

// FindByID finds a product category by ID
func (s *ProductCategoryService) FindByID(id int, ctx context.Context) (*product.Category, error) {
	return s.repo.FindByID(id)
}

// FindByCode finds a product category by code
func (s *ProductCategoryService) FindByCode(code string, ctx context.Context) (*product.Category, error) {
	return s.repo.FindByCode(code)
}

// FindAll retrieves all product categories
func (s *ProductCategoryService) FindAll(ctx context.Context) ([]product.Category, error) {
	return s.repo.FindAll()
}

// Update updates an existing product category
func (s *ProductCategoryService) Update(category *product.Category, ctx context.Context) error {
	return s.repo.Update(category)
}

// Delete deletes a product category
func (s *ProductCategoryService) Delete(id int, ctx context.Context) error {
	return s.repo.Delete(id)
}
