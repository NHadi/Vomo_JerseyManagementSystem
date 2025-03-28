package services

import (
	"vomo/internal/application"
	"vomo/internal/domain/audit"
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
	ProductService         *application.ProductService
	ProductCategoryService *application.ProductCategoryService
}
