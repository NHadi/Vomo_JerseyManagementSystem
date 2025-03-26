package application

import (
	"vomo/internal/domain/region"
	"vomo/internal/domain/zone"

	"github.com/gin-gonic/gin"
)

// RegionService handles business logic for region operations
type RegionService struct {
	repo     region.Repository
	zoneRepo zone.Repository
}

// NewRegionService creates a new region service instance
func NewRegionService(repo region.Repository, zoneRepo zone.Repository) *RegionService {
	return &RegionService{
		repo:     repo,
		zoneRepo: zoneRepo,
	}
}

// Create creates a new region
func (s *RegionService) Create(r *region.Region, ctx *gin.Context) error {
	return s.repo.Create(r, ctx)
}

// FindByID retrieves a region by its ID
func (s *RegionService) FindByID(id int, ctx *gin.Context) (*region.Region, error) {
	return s.repo.FindByID(id, ctx)
}

// FindAll retrieves all regions
func (s *RegionService) FindAll(ctx *gin.Context) ([]region.Region, error) {
	return s.repo.FindAll(ctx)
}

// Update updates an existing region
func (s *RegionService) Update(r *region.Region, ctx *gin.Context) error {
	return s.repo.Update(r, ctx)
}

// Delete deletes a region by its ID
func (s *RegionService) Delete(id int, ctx *gin.Context) error {
	return s.repo.Delete(id, ctx)
}

// GetZonesByRegionID retrieves all zones for a given region ID
func (s *RegionService) GetZonesByRegionID(regionID int, ctx *gin.Context) ([]zone.Zone, error) {
	return s.zoneRepo.FindByRegionID(regionID, ctx)
}
