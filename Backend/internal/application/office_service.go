package application

import (
	"context"
	"errors"
	"vomo/internal/domain/audit"
	"vomo/internal/domain/office"
)

// OfficeService handles business logic for office operations
type OfficeService struct {
	repo     office.Repository
	auditSvc *audit.Service
}

// NewOfficeService creates a new office service instance
func NewOfficeService(repo office.Repository, auditSvc *audit.Service) *OfficeService {
	return &OfficeService{
		repo:     repo,
		auditSvc: auditSvc,
	}
}

// Create creates a new office
func (s *OfficeService) Create(o *office.Office, ctx context.Context) error {
	// Check if office code already exists
	if existing, _ := s.repo.FindByCode(o.Code, ctx); existing != nil {
		return errors.New("office code already exists")
	}

	// Check if office email already exists
	if existing, _ := s.repo.FindByEmail(o.Email, ctx); existing != nil {
		return errors.New("office email already exists")
	}

	if err := s.repo.Create(o, ctx); err != nil {
		return err
	}

	// Log the create action
	return s.auditSvc.LogChange("office", o.ID, audit.ActionCreate, nil, o, ctx)
}

// FindByID retrieves an office by its ID
func (s *OfficeService) FindByID(id int, ctx context.Context) (*office.Office, error) {
	return s.repo.FindByID(id, ctx)
}

// FindAll retrieves all offices
func (s *OfficeService) FindAll(ctx context.Context) ([]office.Office, error) {
	return s.repo.FindAll(ctx)
}

// Update updates an existing office
func (s *OfficeService) Update(o *office.Office, ctx context.Context) error {
	// Check if office code already exists for a different office
	if existing, _ := s.repo.FindByCode(o.Code, ctx); existing != nil && existing.ID != o.ID {
		return errors.New("office code already exists")
	}

	// Check if office email already exists for a different office
	if existing, _ := s.repo.FindByEmail(o.Email, ctx); existing != nil && existing.ID != o.ID {
		return errors.New("office email already exists")
	}

	// Get old data for audit
	oldOffice, err := s.repo.FindByID(o.ID, ctx)
	if err != nil {
		return err
	}

	if err := s.repo.Update(o, ctx); err != nil {
		return err
	}

	// Log the update action
	return s.auditSvc.LogChange("office", o.ID, audit.ActionUpdate, oldOffice, o, ctx)
}

// Delete deletes an office by its ID
func (s *OfficeService) Delete(id int, ctx context.Context) error {
	// Get office data for audit
	office, err := s.repo.FindByID(id, ctx)
	if err != nil {
		return err
	}

	if err := s.repo.Delete(id, ctx); err != nil {
		return err
	}

	// Log the delete action
	return s.auditSvc.LogChange("office", id, audit.ActionDelete, office, nil, ctx)
}

// FindByZoneID retrieves all offices for a specific zone
func (s *OfficeService) FindByZoneID(zoneID int, ctx context.Context) ([]office.Office, error) {
	return s.repo.FindByZoneID(zoneID, ctx)
}

// FindByCode retrieves an office by its code
func (s *OfficeService) FindByCode(code string, ctx context.Context) (*office.Office, error) {
	return s.repo.FindByCode(code, ctx)
}

// FindByEmail retrieves an office by its email
func (s *OfficeService) FindByEmail(email string, ctx context.Context) (*office.Office, error) {
	return s.repo.FindByEmail(email, ctx)
}
