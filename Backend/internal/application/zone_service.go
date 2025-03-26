package application

import (
	"vomo/internal/domain/zone"

	"github.com/gin-gonic/gin"
)

// ZoneService handles business logic for zone operations
type ZoneService struct {
	repo zone.Repository
}

// NewZoneService creates a new zone service instance
func NewZoneService(repo zone.Repository) *ZoneService {
	return &ZoneService{
		repo: repo,
	}
}

// Create creates a new zone
func (s *ZoneService) Create(z *zone.Zone, ctx *gin.Context) error {
	return s.repo.Create(z, ctx)
}

// FindByID retrieves a zone by its ID
func (s *ZoneService) FindByID(id int, ctx *gin.Context) (*zone.Zone, error) {
	return s.repo.FindByID(id, ctx)
}

// FindAll retrieves all zones
func (s *ZoneService) FindAll(ctx *gin.Context) ([]zone.Zone, error) {
	return s.repo.FindAll(ctx)
}

// Update updates an existing zone
func (s *ZoneService) Update(z *zone.Zone, ctx *gin.Context) error {
	return s.repo.Update(z, ctx)
}

// Delete deletes a zone by its ID
func (s *ZoneService) Delete(id int, ctx *gin.Context) error {
	return s.repo.Delete(id, ctx)
}

// FindByRegionID retrieves all zones for a specific region
func (s *ZoneService) FindByRegionID(regionID int, ctx *gin.Context) ([]zone.Zone, error) {
	return s.repo.FindByRegionID(regionID, ctx)
}
