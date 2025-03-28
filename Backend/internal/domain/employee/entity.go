package employee

import (
	"vomo/internal/domain/common"

	"github.com/gin-gonic/gin"
)

// Employee represents the master_employee table
type Employee struct {
	ID         int    `gorm:"primaryKey;autoIncrement:true;column:id" json:"id"`
	Name       string `gorm:"type:varchar(100);not null" json:"name"`
	Email      string `gorm:"type:varchar(255)" json:"email"`
	Phone      string `gorm:"type:varchar(20)" json:"phone"`
	DivisionID int    `gorm:"index" json:"division_id"`
	common.TenantModel
}

func (Employee) TableName() string {
	return "master_employee"
}

type Repository interface {
	Create(employee *Employee, ctx *gin.Context) error
	FindByID(id int, ctx *gin.Context) (*Employee, error)
	FindAll(ctx *gin.Context) ([]Employee, error)
	Update(employee *Employee, ctx *gin.Context) error
	Delete(id int, ctx *gin.Context) error
	FindByDivisionID(divisionID int, ctx *gin.Context) ([]Employee, error)
	FindByEmail(email string, ctx *gin.Context) (*Employee, error)
}
