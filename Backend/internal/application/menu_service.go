package application

import (
	"vomo/internal/domain/common"
	"vomo/internal/domain/menu"
)

type MenuService struct {
	repo menu.Repository
}

func NewMenuService(repo menu.Repository) *MenuService {
	return &MenuService{repo: repo}
}

func (s *MenuService) GetAllMenus(tenantID int) ([]menu.Menu, error) {
	return s.repo.FindAll(tenantID)
}

func (s *MenuService) GetMenuByID(id int, tenantID int) (*menu.Menu, error) {
	return s.repo.FindByID(id, tenantID)
}

func (s *MenuService) GetMenusByRoleID(roleID int, tenantID int) ([]menu.Menu, error) {
	menus, err := s.repo.FindByRoleID(roleID, tenantID)
	if err != nil {
		return nil, err
	}
	return s.buildMenuTree(menus), nil
}

func (s *MenuService) GetMenusByUserID(userID string, tenantID int) ([]menu.Menu, error) {
	menus, err := s.repo.FindByUserID(userID, tenantID)
	if err != nil {
		return nil, err
	}

	return s.buildMenuTree(menus), nil
}

func (s *MenuService) CreateMenu(name, url, icon string, parentID *int, tenantID int) (*menu.Menu, error) {
	m := &menu.Menu{
		Name:     name,
		URL:      url,
		Icon:     icon,
		ParentID: parentID,
		TenantModel: common.TenantModel{
			TenantID: tenantID,
		},
	}

	if err := s.repo.Create(m); err != nil {
		return nil, err
	}
	return m, nil
}

func (s *MenuService) UpdateMenu(id int, name, url, icon string, parentID *int, tenantID int) (*menu.Menu, error) {
	m, err := s.repo.FindByID(id, tenantID)
	if err != nil {
		return nil, err
	}

	m.Name = name
	m.URL = url
	m.Icon = icon
	m.ParentID = parentID
	m.TenantModel = common.TenantModel{
		TenantID: tenantID,
	}

	if err := s.repo.Update(m); err != nil {
		return nil, err
	}
	return m, nil
}

// Update buildMenuTree to preserve tenant ID and sorting
func (s *MenuService) buildMenuTree(menus []menu.Menu) []menu.Menu {
	menuMap := make(map[int]*menu.Menu)
	var rootMenus []*menu.Menu

	// First pass: create all menu items in a map
	for i := range menus {
		menu := menus[i]
		menu.Children = nil
		menuMap[menu.ID] = &menu
	}

	// Second pass: build the tree while preserving order
	for _, m := range menus { // Iterate through original sorted slice
		if m.ParentID != nil {
			if parent, exists := menuMap[*m.ParentID]; exists {
				childCopy := *menuMap[m.ID]
				childCopy.Children = nil
				parent.Children = append(parent.Children, &childCopy)
			}
		} else {
			rootMenus = append(rootMenus, menuMap[m.ID])
		}
	}

	// Convert back to []menu.Menu while preserving order
	result := make([]menu.Menu, len(rootMenus))
	for i, menuPtr := range rootMenus {
		result[i] = *menuPtr
	}

	return result
}

func (s *MenuService) DeleteMenu(id int, tenantID int) error {
	return s.repo.Delete(id, tenantID)
}

func (s *MenuService) Create(menu *menu.Menu) error {
	return s.repo.Create(menu)
}

func (s *MenuService) Update(menu *menu.Menu) error {
	return s.repo.Update(menu)
}

func (s *MenuService) GetByID(id, tenantID int) (*menu.Menu, error) {
	return s.repo.FindByID(id, tenantID)
}

func (s *MenuService) GetAll(tenantID int) ([]menu.Menu, error) {
	menus, err := s.repo.FindAll(tenantID)
	if err != nil {
		return nil, err
	}
	return s.buildMenuTree(menus), nil
}

func (s *MenuService) Delete(id, tenantID int) error {
	return s.repo.Delete(id, tenantID)
}
