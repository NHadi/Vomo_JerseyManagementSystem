package application

import (
	"vomo/internal/domain/employee"

	"github.com/gin-gonic/gin"
)

// EmployeeService handles business logic for employee operations
type EmployeeService struct {
	repo employee.Repository
}

// NewEmployeeService creates a new employee service instance
func NewEmployeeService(repo employee.Repository) *EmployeeService {
	return &EmployeeService{
		repo: repo,
	}
}

// Create creates a new employee
func (s *EmployeeService) Create(e *employee.Employee, ctx *gin.Context) error {
	return s.repo.Create(e, ctx)
}

// FindByID retrieves an employee by its ID
func (s *EmployeeService) FindByID(id int, ctx *gin.Context) (*employee.Employee, error) {
	return s.repo.FindByID(id, ctx)
}

// FindAll retrieves all employees
func (s *EmployeeService) FindAll(ctx *gin.Context) ([]employee.Employee, error) {
	return s.repo.FindAll(ctx)
}

// Update updates an existing employee
func (s *EmployeeService) Update(e *employee.Employee, ctx *gin.Context) error {
	return s.repo.Update(e, ctx)
}

// Delete deletes an employee by its ID
func (s *EmployeeService) Delete(id int, ctx *gin.Context) error {
	return s.repo.Delete(id, ctx)
}

// FindByDivisionID retrieves all employees for a given division ID
func (s *EmployeeService) FindByDivisionID(divisionID int, ctx *gin.Context) ([]employee.Employee, error) {
	return s.repo.FindByDivisionID(divisionID, ctx)
}

// FindByEmail retrieves an employee by email
func (s *EmployeeService) FindByEmail(email string, ctx *gin.Context) (*employee.Employee, error) {
	return s.repo.FindByEmail(email, ctx)
}
