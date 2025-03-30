package services

import (
	"vomo/internal/application"
	"vomo/internal/domain/audit"
	"vomo/internal/domain/product"
	"vomo/internal/infrastructure/postgres"

	"gorm.io/gorm"
)

// Type aliases for services
type MenuService = *application.MenuService
type UserService = *application.UserService
type RoleService = *application.RoleService
type PermissionService = *application.PermissionService
type AuditService = *audit.Service
type BackupService = *application.BackupService
type ProductService = *application.ProductService
type ProductCategoryService = *application.ProductCategoryService

// Services holds all the application services
type Services struct {
	MenuService            *application.MenuService
	UserService            *application.UserService
	RoleService            *application.RoleService
	PermissionService      *application.PermissionService
	AuditService           *audit.Service
	BackupService          *application.BackupService
	ZoneService            *application.ZoneService
	RegionService          *application.RegionService
	OfficeService          *application.OfficeService
	DivisionService        *application.DivisionService
	EmployeeService        *application.EmployeeService
	ProductService         *application.ProductService
	ProductCategoryService *application.ProductCategoryService
	ProductImageService    product.ProductImageService
}

func NewServices(db *gorm.DB) *Services {
	productRepo := postgres.NewProductRepository(db)
	productCategoryRepo := postgres.NewProductCategoryRepository(db)
	productImageRepo := postgres.NewProductImageRepository(db)
	auditRepo := postgres.NewAuditRepository(db)
	auditService := audit.NewService(auditRepo)

	productService := application.NewProductService(productRepo, auditService)
	productCategoryService := application.NewProductCategoryService(productCategoryRepo, auditService)
	productImageService := application.NewProductImageService(productImageRepo, productRepo)

	return &Services{
		MenuService:            nil,
		UserService:            nil,
		RoleService:            nil,
		PermissionService:      nil,
		AuditService:           auditService,
		BackupService:          nil,
		ZoneService:            nil,
		RegionService:          nil,
		OfficeService:          nil,
		DivisionService:        nil,
		EmployeeService:        nil,
		ProductService:         productService,
		ProductCategoryService: productCategoryService,
		ProductImageService:    productImageService,
	}
}
