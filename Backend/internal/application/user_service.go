package application

import (
	"errors"
	"vomo/internal/domain/user"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	repo user.Repository
}

func NewUserService(repo user.Repository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) CreateUser(username, email, password string, roleID int) (*user.User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	u := &user.User{
		ID:       uuid.New(),
		Username: username,
		Email:    email,
		Password: string(hashedPassword),
		RoleID:   roleID,
	}

	if err := s.repo.Create(u); err != nil {
		return nil, err
	}
	return u, nil
}

func (s *UserService) GetUserByID(id uuid.UUID) (*user.User, error) {
	return s.repo.FindByID(id)
}

func (s *UserService) GetUserByEmail(email string) (*user.User, error) {
	return s.repo.FindByEmail(email)
}

func (s *UserService) ListUsers(page, pageSize int) ([]user.User, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}
	return s.repo.List(page, pageSize)
}

func (s *UserService) UpdateUser(id uuid.UUID, username, email string) (*user.User, error) {
	u, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	u.Username = username
	u.Email = email

	if err := s.repo.Update(u); err != nil {
		return nil, err
	}
	return u, nil
}

func (s *UserService) DeleteUser(id uuid.UUID) error {
	return s.repo.Delete(id)
}

func (s *UserService) UpdatePassword(id uuid.UUID, oldPassword, newPassword string) error {
	u, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}

	// Verify old password
	if err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(oldPassword)); err != nil {
		return errors.New("invalid old password")
	}

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	u.Password = string(hashedPassword)
	return s.repo.Update(u)
}

func (s *UserService) ValidateCredentials(email, password string) (*user.User, error) {
	u, err := s.repo.FindByEmail(email)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password)); err != nil {
		return nil, errors.New("invalid credentials")
	}

	return u, nil
}
