package postgres

import (
	"vomo/internal/domain/appcontext"
	"vomo/internal/domain/division"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type divisionRepository struct {
	db *gorm.DB
}

// NewDivisionRepository creates a new division repository instance
func NewDivisionRepository(db *gorm.DB) division.Repository {
	return &divisionRepository{
		db: db,
	}
}

// Create creates a new division
func (r *divisionRepository) Create(division *division.Division, ctx *gin.Context) error {
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	division.TenantID = userCtx.TenantID
	return r.db.Create(division).Error
}

// FindByID retrieves a division by its ID
func (r *divisionRepository) FindByID(id int, ctx *gin.Context) (*division.Division, error) {
	var division division.Division
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	err := r.db.Where("id = ? AND tenant_id = ?", id, userCtx.TenantID).First(&division).Error
	if err != nil {
		return nil, err
	}
	return &division, nil
}

// FindAll retrieves all divisions
func (r *divisionRepository) FindAll(ctx *gin.Context) ([]division.Division, error) {
	var divisions []division.Division
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	err := r.db.Where("tenant_id = ?", userCtx.TenantID).Find(&divisions).Error
	if err != nil {
		return nil, err
	}
	return divisions, nil
}

// Update updates an existing division
func (r *divisionRepository) Update(division *division.Division, ctx *gin.Context) error {
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	return r.db.Where("id = ? AND tenant_id = ?", division.ID, userCtx.TenantID).Updates(division).Error
}

// Delete deletes a division by its ID
func (r *divisionRepository) Delete(id int, ctx *gin.Context) error {
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	return r.db.Where("id = ? AND tenant_id = ?", id, userCtx.TenantID).Delete(&division.Division{}).Error
}
