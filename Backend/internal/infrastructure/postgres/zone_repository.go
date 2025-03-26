package postgres

import (
	"vomo/internal/domain/appcontext"
	"vomo/internal/domain/zone"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ZoneRepository struct {
	db *gorm.DB
}

func NewZoneRepository(db *gorm.DB) zone.Repository {
	return &ZoneRepository{db: db}
}

func (r *ZoneRepository) Create(z *zone.Zone, ctx *gin.Context) error {
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	z.CreatedBy = userCtx.Username
	z.UpdatedBy = userCtx.Username
	return r.db.WithContext(ctx.Request.Context()).Create(z).Error
}

func (r *ZoneRepository) FindByID(id int, ctx *gin.Context) (*zone.Zone, error) {
	var zone zone.Zone
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	if err := r.db.WithContext(ctx.Request.Context()).
		Where("id = ? AND tenant_id = ?", id, userCtx.TenantID).
		First(&zone).Error; err != nil {
		return nil, err
	}
	return &zone, nil
}

func (r *ZoneRepository) FindAll(ctx *gin.Context) ([]zone.Zone, error) {
	var zones []zone.Zone
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	if err := r.db.WithContext(ctx.Request.Context()).
		Where("tenant_id = ?", userCtx.TenantID).
		Find(&zones).Error; err != nil {
		return nil, err
	}
	return zones, nil
}

func (r *ZoneRepository) Update(z *zone.Zone, ctx *gin.Context) error {
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	z.UpdatedBy = userCtx.Username
	return r.db.WithContext(ctx.Request.Context()).
		Where("id = ? AND tenant_id = ?", z.ID, userCtx.TenantID).
		Updates(z).Error
}

func (r *ZoneRepository) Delete(id int, ctx *gin.Context) error {
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	return r.db.WithContext(ctx.Request.Context()).
		Where("id = ? AND tenant_id = ?", id, userCtx.TenantID).
		Delete(&zone.Zone{}).Error
}

func (r *ZoneRepository) FindByRegionID(regionID int, ctx *gin.Context) ([]zone.Zone, error) {
	var zones []zone.Zone
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	if err := r.db.WithContext(ctx.Request.Context()).
		Where("region_id = ? AND tenant_id = ?", regionID, userCtx.TenantID).
		Find(&zones).Error; err != nil {
		return nil, err
	}
	return zones, nil
}
