package application

import (
	"vomo/internal/domain/division"

	"github.com/gin-gonic/gin"
)

// DivisionService handles business logic for division operations
type DivisionService struct {
	repo division.Repository
}

// NewDivisionService creates a new division service instance
func NewDivisionService(repo division.Repository) *DivisionService {
	return &DivisionService{
		repo: repo,
	}
}

// Create creates a new division
func (s *DivisionService) Create(d *division.Division, ctx *gin.Context) error {
	return s.repo.Create(d, ctx)
}

// FindByID retrieves a division by its ID
func (s *DivisionService) FindByID(id int, ctx *gin.Context) (*division.Division, error) {
	return s.repo.FindByID(id, ctx)
}

// FindAll retrieves all divisions
func (s *DivisionService) FindAll(ctx *gin.Context) ([]division.Division, error) {
	return s.repo.FindAll(ctx)
}

// Update updates an existing division
func (s *DivisionService) Update(d *division.Division, ctx *gin.Context) error {
	return s.repo.Update(d, ctx)
}

// Delete deletes a division by its ID
func (s *DivisionService) Delete(id int, ctx *gin.Context) error {
	return s.repo.Delete(id, ctx)
}
