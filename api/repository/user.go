package repository

import (
	"github.com/FR0ST1N/MyDailies/api/models"
	"gorm.io/gorm"
)

type UserRepository struct {
	DB *gorm.DB
}

type IUserRepository interface {
	Create(u *models.User) error
	Update(id uint, u *models.User) error
	FindByEmail(u *models.User) error
	FindByID(u *models.User) error
	HasAdmin() error
	GetAllUsers() (*[]models.User, error)
}

func (repo *UserRepository) Create(u *models.User) error {
	err := repo.DB.Create(&u).Error
	return err
}

func (repo *UserRepository) Update(id uint, u *models.User) error {
	err := repo.DB.Model(&models.User{ID: id}).Updates(&u).Error
	return err
}

func (repo *UserRepository) FindByEmail(u *models.User) error {
	err := repo.DB.Where("email = ?", u.Email).Take(&u).Error
	return err
}

func (repo *UserRepository) FindByID(u *models.User) error {
	err := repo.DB.First(&u).Error
	return err
}

func (repo *UserRepository) HasAdmin() error {
	err := repo.DB.Where("admin = ?", true).Take(&models.User{}).Error
	return err
}

func (repo *UserRepository) GetAllUsers() (*[]models.User, error) {
	var users []models.User
	err := repo.DB.Find(&users).Error
	return &users, err
}
