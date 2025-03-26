package application

import (
	"errors"
	"vomo/internal/domain/office"

	"github.com/gin-gonic/gin"
)

// OfficeService handles business logic for office operations
type OfficeService struct {
	repo office.Repository
}

// NewOfficeService creates a new office service instance
func NewOfficeService(repo office.Repository) *OfficeService {
	return &OfficeService{
		repo: repo,
	}
}

// Create creates a new office
func (s *OfficeService) Create(o *office.Office, ctx *gin.Context) error {
	// Check if office code already exists
	if existing, _ := s.repo.FindByCode(o.Code, ctx); existing != nil {
		return errors.New("office code already exists")
	}

	// Check if office email already exists
	if existing, _ := s.repo.FindByEmail(o.Email, ctx); existing != nil {
		return errors.New("office email already exists")
	}

	return s.repo.Create(o, ctx)
}

// FindByID retrieves an office by its ID
func (s *OfficeService) FindByID(id int, ctx *gin.Context) (*office.Office, error) {
	return s.repo.FindByID(id, ctx)
}

// FindAll retrieves all offices
func (s *OfficeService) FindAll(ctx *gin.Context) ([]office.Office, error) {
	return s.repo.FindAll(ctx)
}

// Update updates an existing office
func (s *OfficeService) Update(o *office.Office, ctx *gin.Context) error {
	// Check if office code already exists for a different office
	if existing, _ := s.repo.FindByCode(o.Code, ctx); existing != nil && existing.ID != o.ID {
		return errors.New("office code already exists")
	}

	// Check if office email already exists for a different office
	if existing, _ := s.repo.FindByEmail(o.Email, ctx); existing != nil && existing.ID != o.ID {
		return errors.New("office email already exists")
	}

	return s.repo.Update(o, ctx)
}

// Delete deletes an office by its ID
func (s *OfficeService) Delete(id int, ctx *gin.Context) error {
	return s.repo.Delete(id, ctx)
}

// FindByZoneID retrieves all offices for a specific zone
func (s *OfficeService) FindByZoneID(zoneID int, ctx *gin.Context) ([]office.Office, error) {
	return s.repo.FindByZoneID(zoneID, ctx)
}
