package zone

import (
	"vomo/internal/domain/common"

	"github.com/gin-gonic/gin"
)

// Zone represents the master_zone table
type Zone struct {
	ID          int    `gorm:"primaryKey;autoIncrement:true;column:id" json:"id"`
	Name        string `gorm:"type:varchar(100);not null" json:"name"`
	RegionID    *int   `gorm:"index" json:"region_id"`
	Description string `gorm:"type:text" json:"description"`
	common.TenantModel
}

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
