package menu

type Repository interface {
	FindAll(tenantID int) ([]Menu, error)
	FindByID(id, tenantID int) (*Menu, error)
	FindByRoleID(roleID, tenantID int) ([]Menu, error)
	FindByUserID(userID string, tenantID int) ([]Menu, error)
	Create(menu *Menu) error
	Update(menu *Menu) error
	Delete(id, tenantID int) error
}
