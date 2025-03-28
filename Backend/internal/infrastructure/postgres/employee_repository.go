package postgres

import (
	"vomo/internal/domain/appcontext"
	"vomo/internal/domain/employee"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type employeeRepository struct {
	db *gorm.DB
}

// NewEmployeeRepository creates a new employee repository instance
func NewEmployeeRepository(db *gorm.DB) employee.Repository {
	return &employeeRepository{
		db: db,
	}
}

// Create creates a new employee
func (r *employeeRepository) Create(employee *employee.Employee, ctx *gin.Context) error {
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	employee.TenantID = userCtx.TenantID
	return r.db.Create(employee).Error
}

// FindByID retrieves an employee by its ID
func (r *employeeRepository) FindByID(id int, ctx *gin.Context) (*employee.Employee, error) {
	var employee employee.Employee
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	err := r.db.Where("id = ? AND tenant_id = ?", id, userCtx.TenantID).First(&employee).Error
	if err != nil {
		return nil, err
	}
	return &employee, nil
}

// FindAll retrieves all employees
func (r *employeeRepository) FindAll(ctx *gin.Context) ([]employee.Employee, error) {
	var employees []employee.Employee
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	err := r.db.Where("tenant_id = ?", userCtx.TenantID).Find(&employees).Error
	if err != nil {
		return nil, err
	}
	return employees, nil
}

// Update updates an existing employee
func (r *employeeRepository) Update(employee *employee.Employee, ctx *gin.Context) error {
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	return r.db.Where("id = ? AND tenant_id = ?", employee.ID, userCtx.TenantID).Updates(employee).Error
}

// Delete deletes an employee by its ID
func (r *employeeRepository) Delete(id int, ctx *gin.Context) error {
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	return r.db.Where("id = ? AND tenant_id = ?", id, userCtx.TenantID).Delete(&employee.Employee{}).Error
}

// FindByDivisionID retrieves all employees for a given division ID
func (r *employeeRepository) FindByDivisionID(divisionID int, ctx *gin.Context) ([]employee.Employee, error) {
	var employees []employee.Employee
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	err := r.db.Where("division_id = ? AND tenant_id = ?", divisionID, userCtx.TenantID).Find(&employees).Error
	if err != nil {
		return nil, err
	}
	return employees, nil
}

// FindByEmail retrieves an employee by email
func (r *employeeRepository) FindByEmail(email string, ctx *gin.Context) (*employee.Employee, error) {
	var employee employee.Employee
	userCtx := ctx.MustGet(appcontext.UserContextKey).(*appcontext.UserContext)
	err := r.db.Where("email = ? AND tenant_id = ?", email, userCtx.TenantID).First(&employee).Error
	if err != nil {
		return nil, err
	}
	return &employee, nil
}
