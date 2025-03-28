package division

import (
	"vomo/internal/domain/common"

	"github.com/gin-gonic/gin"
)

// Division represents the master_division table
type Division struct {
	ID          int    `gorm:"primaryKey;autoIncrement:true;column:id" json:"id"`
	Name        string `gorm:"type:varchar(100);not null" json:"name"`
	Description string `gorm:"type:text" json:"description"`
	common.TenantModel
}

func (Division) TableName() string {
	return "master_division"
}

type Repository interface {
	Create(division *Division, ctx *gin.Context) error
	FindByID(id int, ctx *gin.Context) (*Division, error)
	FindAll(ctx *gin.Context) ([]Division, error)
	Update(division *Division, ctx *gin.Context) error
	Delete(id int, ctx *gin.Context) error
}
