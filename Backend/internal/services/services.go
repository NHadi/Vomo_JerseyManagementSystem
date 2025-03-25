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

// Services holds all the service instances
type Services struct {
	MenuService       MenuService
	UserService       UserService
	RoleService       RoleService
	PermissionService PermissionService
	AuditService      AuditService
}
