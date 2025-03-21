package application

import (
	"vomo/internal/domain/menu"
)

type MenuService struct {
	repo menu.Repository
}

func NewMenuService(repo menu.Repository) *MenuService {
	return &MenuService{repo: repo}
}

func (s *MenuService) GetAllMenus() ([]menu.Menu, error) {
	return s.repo.FindAll()
}

func (s *MenuService) GetMenuByID(id int) (*menu.Menu, error) {
	return s.repo.FindByID(id)
}

func (s *MenuService) GetMenusByRoleID(roleID int) ([]menu.Menu, error) {
	menus, err := s.repo.FindByRoleID(roleID)
	if err != nil {
		return nil, err
	}
	
	// Build menu tree
	return s.buildMenuTree(menus), nil
}

func (s *MenuService) GetMenusByUserID(userID string) ([]menu.Menu, error) {
	menus, err := s.repo.FindByUserID(userID)
	if err != nil {
		return nil, err
	}
	
	// Build menu tree
	return s.buildMenuTree(menus), nil
}

func (s *MenuService) CreateMenu(name, url, icon string, parentID *int) (*menu.Menu, error) {
	m := &menu.Menu{
		Name:     name,
		URL:      url,
		Icon:     icon,
		ParentID: parentID,
	}
	
	if err := s.repo.Create(m); err != nil {
		return nil, err
	}
	return m, nil
}

func (s *MenuService) UpdateMenu(id int, name, url, icon string, parentID *int) (*menu.Menu, error) {
	m, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	m.Name = name
	m.URL = url
	m.Icon = icon
	m.ParentID = parentID

	if err := s.repo.Update(m); err != nil {
		return nil, err
	}
	return m, nil
}

func (s *MenuService) DeleteMenu(id int) error {
	return s.repo.Delete(id)
}

// buildMenuTree organizes menus into a hierarchical structure
func (s *MenuService) buildMenuTree(menus []menu.Menu) []menu.Menu {
	menuMap := make(map[int]*menu.Menu)
	var rootMenus []menu.Menu

	// First pass: create all menu items in a map
	for i := range menus {
		menuMap[menus[i].ID] = &menus[i]
	}

	// Second pass: build the tree
	for i := range menus {
		if menus[i].ParentID == nil {
			// This is a root menu
			rootMenus = append(rootMenus, menus[i])
		} else {
			// This is a child menu
			parent, exists := menuMap[*menus[i].ParentID]
			if exists {
				parent.Children = append(parent.Children, menus[i])
			}
		}
	}

	return rootMenus
}