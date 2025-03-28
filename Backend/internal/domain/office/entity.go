package office

import (
	"vomo/internal/domain/common"
	"vomo/internal/domain/models"

	"github.com/gin-gonic/gin"
)

// Office represents the master_office table
type Office struct {
	ID      int          `gorm:"primaryKey;autoIncrement:true;column:id" json:"id"`
	Name    string       `gorm:"type:varchar(100);not null" json:"name"`
	Code    string       `gorm:"type:varchar(50);unique" json:"code"`
	Address string       `gorm:"type:text" json:"address"`
	Phone   string       `gorm:"type:varchar(20)" json:"phone"`
	Email   string       `gorm:"type:varchar(255);unique" json:"email"`
	ZoneID  *int         `gorm:"column:zone_id;index" json:"zone_id"`
	Zone    *models.Zone `gorm:"foreignKey:ZoneID" json:"zone,omitempty"`
	common.TenantModel
}

func (Office) TableName() string {
	return "master_office"
}

type Repository interface {
	Create(office *Office, ctx *gin.Context) error
	FindByID(id int, ctx *gin.Context) (*Office, error)
	FindAll(ctx *gin.Context) ([]Office, error)
	Update(office *Office, ctx *gin.Context) error
	Delete(id int, ctx *gin.Context) error
	FindByZoneID(zoneID int, ctx *gin.Context) ([]Office, error)
	FindByCode(code string, ctx *gin.Context) (*Office, error)
	FindByEmail(email string, ctx *gin.Context) (*Office, error)
}
