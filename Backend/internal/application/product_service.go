package application

import (
	"context"
	"vomo/internal/domain/product"
)

// ProductService handles business logic for products
type ProductService struct {
	repo product.ProductRepository
}

// NewProductService creates a new product service
func NewProductService(repo product.ProductRepository) *ProductService {
	return &ProductService{
		repo: repo,
	}
}

// Create creates a new product
func (s *ProductService) Create(product *product.Product, ctx context.Context) error {
	return s.repo.Create(product)
}

// FindByID finds a product by ID
func (s *ProductService) FindByID(id int, ctx context.Context) (*product.Product, error) {
	return s.repo.FindByID(id)
}

// FindByCode finds a product by code
func (s *ProductService) FindByCode(code string, ctx context.Context) (*product.Product, error) {
	return s.repo.FindByCode(code)
}

// FindAll retrieves all products
func (s *ProductService) FindAll(ctx context.Context) ([]product.Product, error) {
	return s.repo.FindAll()
}

// FindByCategoryID retrieves all products in a category
func (s *ProductService) FindByCategoryID(categoryID int, ctx context.Context) ([]product.Product, error) {
	return s.repo.FindByCategoryID(categoryID)
}

// Update updates an existing product
func (s *ProductService) Update(product *product.Product, ctx context.Context) error {
	return s.repo.Update(product)
}

// Delete deletes a product
func (s *ProductService) Delete(id int, ctx context.Context) error {
	return s.repo.Delete(id)
}
