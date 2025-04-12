package repositories

import (
	"context"
	"vomo/internal/domain/employee"
)

// EmployeeRepository defines the interface for employee persistence operations
type EmployeeRepository interface {
	FindByID(id int, ctx context.Context) (*employee.Employee, error)
}
