package routes

import (
	"vomo/internal/domain/audit"
	"vomo/internal/handlers"
	"vomo/internal/middleware"

	"github.com/gin-gonic/gin"
)

func SetupAuditRoutes(router *gin.RouterGroup, auditService *audit.Service) {
	audits := router.Group("/audits")
	{
		audits.GET("/entity/:type/:id", middleware.PermissionChecker("AUDIT_TRAIL_VIEW"), handlers.GetEntityAuditHistory(auditService))
		audits.GET("/tenant/:id", middleware.PermissionChecker("AUDIT_TRAIL_VIEW"), handlers.GetTenantAuditHistory(auditService))
		audits.GET("/date-range", middleware.PermissionChecker("AUDIT_TRAIL_VIEW"), handlers.GetAuditHistoryByDateRange(auditService))
	}
}
