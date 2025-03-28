package application

import (
	"vomo/internal/domain/office"
	"vomo/internal/domain/region"
	"vomo/internal/domain/zone"

	"github.com/gin-gonic/gin"
)

// ZoneService handles business logic for zone operations
type ZoneService struct {
	repo       zone.Repository
	regionRepo region.Repository
	officeRepo office.Repository
}

// NewZoneService creates a new zone service instance
func NewZoneService(repo zone.Repository, regionRepo region.Repository, officeRepo office.Repository) *ZoneService {
	return &ZoneService{
		repo:       repo,
		regionRepo: regionRepo,
		officeRepo: officeRepo,
	}
}

// Create creates a new zone
func (s *ZoneService) Create(z *zone.Zone, ctx *gin.Context) error {
	return s.repo.Create(z, ctx)
}

// FindByID retrieves a zone by its ID
func (s *ZoneService) FindByID(id int, ctx *gin.Context) (*zone.Zone, *region.Region, error) {
	z, err := s.repo.FindByID(id, ctx)
	if err != nil {
		return nil, nil, err
	}

	var r *region.Region
	if z.RegionID != nil {
		r, err = s.regionRepo.FindByID(*z.RegionID, ctx)
		if err != nil {
			// Log error but don't fail the request
			// Just return zone without region info
			return z, nil, nil
		}
	}

	return z, r, nil
}

// FindAll retrieves all zones
func (s *ZoneService) FindAll(ctx *gin.Context) ([]zone.Zone, []*region.Region, error) {
	zones, err := s.repo.FindAll(ctx)
	if err != nil {
		return nil, nil, err
	}

	// Get all unique region IDs
	regionIDs := make(map[int]struct{})
	for _, z := range zones {
		if z.RegionID != nil {
			regionIDs[*z.RegionID] = struct{}{}
		}
	}

	// Fetch all regions in one go
	regions := make(map[int]*region.Region)
	for regionID := range regionIDs {
		r, err := s.regionRepo.FindByID(regionID, ctx)
		if err != nil {
			// Log error but continue
			continue
		}
		regions[regionID] = r
	}

	// Create slice of regions in same order as zones
	zoneRegions := make([]*region.Region, len(zones))
	for i, z := range zones {
		if z.RegionID != nil {
			zoneRegions[i] = regions[*z.RegionID]
		}
	}

	return zones, zoneRegions, nil
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
func (s *ZoneService) FindByRegionID(regionID int, ctx *gin.Context) ([]zone.Zone, []*region.Region, error) {
	zones, err := s.repo.FindByRegionID(regionID, ctx)
	if err != nil {
		return nil, nil, err
	}

	// Get region details
	r, err := s.regionRepo.FindByID(regionID, ctx)
	if err != nil {
		// Log error but don't fail the request
		// Just return zones without region info
		return zones, make([]*region.Region, len(zones)), nil
	}

	// Create slice of regions in same order as zones
	regions := make([]*region.Region, len(zones))
	for i := range zones {
		regions[i] = r
	}

	return zones, regions, nil
}

func (s *ZoneService) AssignOffices(zoneID int, officeIDs []int, ctx *gin.Context) (*zone.Zone, *region.Region, error) {
	// Get the zone
	zone, region, err := s.FindByID(zoneID, ctx)
	if err != nil {
		return nil, nil, err
	}

	// Update each office's zone_id
	for _, id := range officeIDs {
		office, err := s.officeRepo.FindByID(id, ctx)
		if err != nil {
			return nil, nil, err
		}
		office.ZoneID = &zoneID
		if err := s.officeRepo.Update(office, ctx); err != nil {
			return nil, nil, err
		}
	}

	// Refresh the zone to get updated offices
	zone, region, err = s.FindByID(zoneID, ctx)
	if err != nil {
		return nil, nil, err
	}

	return zone, region, nil
}

func (s *ZoneService) RemoveOffices(zoneID int, officeIDs []int, ctx *gin.Context) error {
	// Get the offices for this zone
	offices, err := s.officeRepo.FindByZoneID(zoneID, ctx)
	if err != nil {
		return err
	}

	// Create a map of office IDs to remove for efficient lookup
	removeIDs := make(map[int]bool)
	for _, id := range officeIDs {
		removeIDs[id] = true
	}

	// Update each office that needs to be removed
	for _, office := range offices {
		if removeIDs[office.ID] {
			office.ZoneID = nil
			if err := s.officeRepo.Update(&office, ctx); err != nil {
				return err
			}
		}
	}

	return nil
}
