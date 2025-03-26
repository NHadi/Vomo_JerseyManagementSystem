package region

import (
	"vomo/internal/domain/common"

	"github.com/gin-gonic/gin"
)

// Region represents the master_region table
type Region struct {
	ID          int    `gorm:"primaryKey;autoIncrement:true;column:id" json:"id"`
	Name        string `gorm:"type:varchar(100);not null" json:"name"`
	Description string `gorm:"type:text" json:"description"`
	common.TenantModel
}

func (Region) TableName() string {
	return "master_region"
}

type Repository interface {
	Create(region *Region, ctx *gin.Context) error
	FindByID(id int, ctx *gin.Context) (*Region, error)
	FindAll(ctx *gin.Context) ([]Region, error)
	Update(region *Region, ctx *gin.Context) error
	Delete(id int, ctx *gin.Context) error
}
