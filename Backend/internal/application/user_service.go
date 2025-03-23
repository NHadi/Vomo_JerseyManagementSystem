package application

import (
	"errors"
	"vomo/internal/domain/user"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	repository user.Repository
}

func NewUserService(repo user.Repository) *UserService {
	return &UserService{
		repository: repo,
	}
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

	if err := s.repository.Create(u); err != nil {
		return nil, err
	}
	return u, nil
}

func (s *UserService) GetUserByID(id uuid.UUID) (*user.User, error) {
	return s.repository.FindByID(id)
}

func (s *UserService) GetUserByEmail(email string) (*user.User, error) {
	return s.repository.FindByEmail(email)
}

func (s *UserService) ListUsers(page, pageSize int) ([]user.User, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}
	return s.repository.List(page, pageSize)
}

func (s *UserService) UpdateUser(id uuid.UUID, username, email string) (*user.User, error) {
	u, err := s.repository.FindByID(id)
	if err != nil {
		return nil, err
	}

	u.Username = username
	u.Email = email

	if err := s.repository.Update(u); err != nil {
		return nil, err
	}
	return u, nil
}

func (s *UserService) DeleteUser(id uuid.UUID) error {
	return s.repository.Delete(id)
}

func (s *UserService) UpdatePassword(id uuid.UUID, oldPassword, newPassword string) error {
	u, err := s.repository.FindByID(id)
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
	return s.repository.Update(u)
}

func (s *UserService) ValidateCredentials(username, password string) (*user.User, error) {
	user, err := s.repository.FindByEmail(username)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	return user, nil
}

// GetUserPermissions retrieves all permission codes for a user
func (s *UserService) GetUserPermissions(userID uuid.UUID) ([]string, error) {
	return s.repository.GetUserPermissions(userID)
}

// Create creates a new user with hashed password
func (s *UserService) Create(user *user.User) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)
	return s.repository.Create(user)
}

// FindByID finds a user by ID
func (s *UserService) FindByID(id uuid.UUID) (*user.User, error) {
	return s.repository.FindByID(id)
}

// FindByEmail finds a user by email
func (s *UserService) FindByEmail(email string) (*user.User, error) {
	return s.repository.FindByEmail(email)
}

// FindByUsername finds a user by username
func (s *UserService) FindByUsername(username string) (*user.User, error) {
	return s.repository.FindByUsername(username)
}

// FindAll retrieves all users
func (s *UserService) FindAll() ([]user.User, error) {
	return s.repository.FindAll()
}

// Update updates an existing user
func (s *UserService) Update(user *user.User) error {
	if user.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		user.Password = string(hashedPassword)
	}
	return s.repository.Update(user)
}

// Delete deletes a user
func (s *UserService) Delete(id uuid.UUID) error {
	return s.repository.Delete(id)
}

// AssignRole assigns a role to a user
func (s *UserService) AssignRole(userID uuid.UUID, roleID int) error {
	return s.repository.AssignRole(userID, roleID)
}

// RemoveRole removes a role from a user
func (s *UserService) RemoveRole(userID uuid.UUID, roleID int) error {
	return s.repository.RemoveRole(userID, roleID)
}
