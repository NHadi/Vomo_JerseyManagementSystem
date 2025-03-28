package postgres

import (
	"vomo/internal/domain/appcontext"
	"vomo/internal/domain/office"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type OfficeRepository struct {
	db *gorm.DB
}

func NewOfficeRepository(db *gorm.DB) office.Repository {
	return &OfficeRepository{db: db}
}

func (r *OfficeRepository) Create(o *office.Office, ctx *gin.Context) error {
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	o.CreatedBy = userCtx.Username
	o.UpdatedBy = userCtx.Username
	return r.db.WithContext(ctx.Request.Context()).Create(o).Error
}

func (r *OfficeRepository) FindByID(id int, ctx *gin.Context) (*office.Office, error) {
	var office office.Office
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	if err := r.db.WithContext(ctx.Request.Context()).
		Preload("Zone").
		Where("id = ? AND tenant_id = ?", id, userCtx.TenantID).
		First(&office).Error; err != nil {
		return nil, err
	}
	return &office, nil
}

func (r *OfficeRepository) FindAll(ctx *gin.Context) ([]office.Office, error) {
	var offices []office.Office
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	if err := r.db.WithContext(ctx.Request.Context()).
		Preload("Zone").
		Where("tenant_id = ?", userCtx.TenantID).
		Find(&offices).Error; err != nil {
		return nil, err
	}
	return offices, nil
}

func (r *OfficeRepository) Update(o *office.Office, ctx *gin.Context) error {
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	o.UpdatedBy = userCtx.Username
	return r.db.WithContext(ctx.Request.Context()).
		Where("id = ? AND tenant_id = ?", o.ID, userCtx.TenantID).
		Updates(o).Error
}

func (r *OfficeRepository) Delete(id int, ctx *gin.Context) error {
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	return r.db.WithContext(ctx.Request.Context()).
		Where("id = ? AND tenant_id = ?", id, userCtx.TenantID).
		Delete(&office.Office{}).Error
}

func (r *OfficeRepository) FindByZoneID(zoneID int, ctx *gin.Context) ([]office.Office, error) {
	var offices []office.Office
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	if err := r.db.WithContext(ctx.Request.Context()).
		Preload("Zone").
		Where("zone_id = ? AND tenant_id = ?", zoneID, userCtx.TenantID).
		Find(&offices).Error; err != nil {
		return nil, err
	}
	return offices, nil
}

func (r *OfficeRepository) FindByCode(code string, ctx *gin.Context) (*office.Office, error) {
	var office office.Office
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	if err := r.db.WithContext(ctx.Request.Context()).
		Preload("Zone").
		Where("code = ? AND tenant_id = ?", code, userCtx.TenantID).
		First(&office).Error; err != nil {
		return nil, err
	}
	return &office, nil
}

func (r *OfficeRepository) FindByEmail(email string, ctx *gin.Context) (*office.Office, error) {
	var office office.Office
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	if err := r.db.WithContext(ctx.Request.Context()).
		Preload("Zone").
		Where("email = ? AND tenant_id = ?", email, userCtx.TenantID).
		First(&office).Error; err != nil {
		return nil, err
	}
	return &office, nil
}
