package application

import (
	"vomo/internal/domain/permission"
)

type PermissionService struct {
	repository permission.Repository
}

func NewPermissionService(repo permission.Repository) *PermissionService {
	return &PermissionService{
		repository: repo,
	}
}

func (s *PermissionService) Create(permission *permission.Permission) error {
	return s.repository.Create(permission)
}

func (s *PermissionService) FindByID(id int) (*permission.Permission, error) {
	return s.repository.FindByID(id)
}

func (s *PermissionService) FindByName(name string) (*permission.Permission, error) {
	return s.repository.FindByName(name)
}

func (s *PermissionService) FindAll() ([]permission.Permission, error) {
	return s.repository.FindAll()
}

func (s *PermissionService) Update(permission *permission.Permission) error {
	return s.repository.Update(permission)
}

func (s *PermissionService) Delete(id int) error {
	return s.repository.Delete(id)
}
