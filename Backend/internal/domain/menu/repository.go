package menu

type Repository interface {
	FindAll() ([]Menu, error)
	FindByID(id int) (*Menu, error)
	FindByRoleID(roleID int) ([]Menu, error)
	FindByUserID(userID string) ([]Menu, error)
	Create(menu *Menu) error
	Update(menu *Menu) error
	Delete(id int) error
}