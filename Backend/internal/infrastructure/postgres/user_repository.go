package postgres

import (
	"vomo/internal/domain/user"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(user *user.User) error {
	return r.db.Create(user).Error
}

func (r *UserRepository) FindByID(id uuid.UUID) (*user.User, error) {
	var u user.User
	if err := r.db.First(&u, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *UserRepository) FindByEmail(email string) (*user.User, error) {
	var u user.User
	if err := r.db.First(&u, "email = ?", email).Error; err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *UserRepository) Update(user *user.User) error {
	return r.db.Save(user).Error
}

func (r *UserRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&user.User{}, "id = ?", id).Error
}

func (r *UserRepository) List(page, pageSize int) ([]user.User, error) {
	var users []user.User
	offset := (page - 1) * pageSize

	result := r.db.
		Order("created_at DESC").
		Offset(offset).
		Limit(pageSize).
		Find(&users)

	if result.Error != nil {
		return nil, result.Error
	}

	return users, nil
}

func (r *UserRepository) FindByRole(roleID int) ([]user.User, error) {
	var users []user.User
	err := r.db.Where("role_id = ?", roleID).Find(&users).Error
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (r *UserRepository) Count() (int64, error) {
	var count int64
	err := r.db.Model(&user.User{}).Count(&count).Error
	return count, err
}

// GetUserPermissions retrieves all permissions for a given user through their role
func (r *UserRepository) GetUserPermissions(userID uuid.UUID) ([]string, error) {
	var permissionCodes []string
	err := r.db.Table("master_permission").
		Select("DISTINCT master_permission.code").
		Joins("JOIN role_permissions ON master_permission.id = role_permissions.permission_id").
		Joins("JOIN users ON role_permissions.role_id = users.role_id").
		Where("users.id = ?", userID).
		Pluck("code", &permissionCodes).Error
	return permissionCodes, err
}

// FindAll retrieves all users
func (r *UserRepository) FindAll() ([]user.User, error) {
	var users []user.User
	err := r.db.Find(&users).Error
	return users, err
}

func (r *UserRepository) FindByUsername(username string) (*user.User, error) {
	var u user.User
	if err := r.db.First(&u, "username = ?", username).Error; err != nil {
		return nil, err
	}
	return &u, nil
}

// AssignRole assigns a role to a user
func (r *UserRepository) AssignRole(userID uuid.UUID, roleID int) error {
	return r.db.Exec(`
		INSERT INTO user_role (user_id, role_id, tenant_id)
		VALUES (?, ?, (SELECT tenant_id FROM users WHERE id = ?))
		ON CONFLICT (user_id, role_id, tenant_id) DO NOTHING
	`, userID, roleID, userID).Error
}

// RemoveRole removes a role from a user
func (r *UserRepository) RemoveRole(userID uuid.UUID, roleID int) error {
	return r.db.Exec("DELETE FROM user_role WHERE user_id = ? AND role_id = ?", userID, roleID).Error
}
