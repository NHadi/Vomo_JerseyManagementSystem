package postgres

import (
	"context"
	"vomo/internal/domain/accounting"
	"vomo/internal/domain/appcontext"

	"gorm.io/gorm"
)

type PettyCashRepository struct {
	db *gorm.DB
}

func NewPettyCashRepository(db *gorm.DB) accounting.PettyCashRepository {
	return &PettyCashRepository{db: db}
}

func (r *PettyCashRepository) Create(pettyCash *accounting.PettyCash, ctx context.Context) error {
	userCtx := ctx.Value(appcontext.UserContextKey).(*appcontext.UserContext)
	pettyCash.TenantID = userCtx.TenantID
	pettyCash.CreatedBy = userCtx.Username
	pettyCash.UpdatedBy = userCtx.Username
	return r.db.WithContext(ctx).Create(pettyCash).Error
}

func (r *PettyCashRepository) FindByID(id int, ctx context.Context) (*accounting.PettyCash, error) {
	var pettyCash accounting.PettyCash
	userCtx := ctx.Value(appcontext.UserContextKey).(*appcontext.UserContext)
	result := r.db.WithContext(ctx).
		Where("id = ? AND tenant_id = ?", id, userCtx.TenantID).
		First(&pettyCash)
	return &pettyCash, result.Error
}

func (r *PettyCashRepository) FindAll(ctx context.Context) ([]accounting.PettyCash, error) {
	var pettyCashes []accounting.PettyCash
	userCtx := ctx.Value(appcontext.UserContextKey).(*appcontext.UserContext)
	result := r.db.WithContext(ctx).
		Where("tenant_id = ?", userCtx.TenantID).
		Find(&pettyCashes)
	return pettyCashes, result.Error
}

func (r *PettyCashRepository) Update(pettyCash *accounting.PettyCash, ctx context.Context) error {
	userCtx := ctx.Value(appcontext.UserContextKey).(*appcontext.UserContext)
	pettyCash.TenantID = userCtx.TenantID
	pettyCash.UpdatedBy = userCtx.Username
	return r.db.WithContext(ctx).
		Where("id = ? AND tenant_id = ?", pettyCash.ID, userCtx.TenantID).
		Updates(pettyCash).Error
}

func (r *PettyCashRepository) Delete(id int, ctx context.Context) error {
	userCtx := ctx.Value(appcontext.UserContextKey).(*appcontext.UserContext)
	return r.db.WithContext(ctx).
		Where("id = ? AND tenant_id = ?", id, userCtx.TenantID).
		Delete(&accounting.PettyCash{}).Error
}

func (r *PettyCashRepository) FindByOffice(officeID int, ctx context.Context) (*accounting.PettyCash, error) {
	var pettyCash accounting.PettyCash
	userCtx := ctx.Value(appcontext.UserContextKey).(*appcontext.UserContext)
	result := r.db.WithContext(ctx).
		Where("office_id = ? AND tenant_id = ? AND status = ?", officeID, userCtx.TenantID, "active").
		First(&pettyCash)
	return &pettyCash, result.Error
}
