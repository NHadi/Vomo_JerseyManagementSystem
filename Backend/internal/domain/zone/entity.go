package zone

import (
	"vomo/internal/domain/common"
	"vomo/internal/domain/models"
	"vomo/internal/domain/office"

	"github.com/gin-gonic/gin"
)

// Zone represents the master_zone table
type Zone struct {
	models.Zone
	Offices []office.Office `gorm:"foreignKey:ZoneID;references:ID" json:"offices,omitempty"`
	common.TenantModel
}

// TableName specifies the table name for GORM
func (Zone) TableName() string {
	return "master_zone"
}

type Repository interface {
	Create(zone *Zone, ctx *gin.Context) error
	FindByID(id int, ctx *gin.Context) (*Zone, error)
	FindAll(ctx *gin.Context) ([]Zone, error)
	Update(zone *Zone, ctx *gin.Context) error
	Delete(id int, ctx *gin.Context) error
	FindByRegionID(regionID int, ctx *gin.Context) ([]Zone, error)
}
