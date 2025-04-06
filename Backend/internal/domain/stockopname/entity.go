package stockopname

import (
	"vomo/internal/domain/common"
	"vomo/internal/domain/item"
	"vomo/internal/domain/models"
)

// StockOpname represents the stock_opname table
type StockOpname struct {
	models.StockOpname
	Details []StockOpnameDetail `gorm:"foreignKey:StockOpnameID;references:ID" json:"details,omitempty"`
	common.TenantModel
}

// StockOpnameDetail represents the stock_opname_detail table
type StockOpnameDetail struct {
	models.StockOpnameDetail
	Item *item.Item `gorm:"foreignKey:ItemID;references:ID" json:"item,omitempty"`
	common.TenantModel
}

// TableName specifies the table name for GORM
func (StockOpname) TableName() string {
	return "stock_opname"
}

// TableName specifies the table name for GORM
func (StockOpnameDetail) TableName() string {
	return "stock_opname_detail"
}
