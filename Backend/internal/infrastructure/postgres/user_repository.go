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