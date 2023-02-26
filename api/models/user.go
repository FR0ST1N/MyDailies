package models

import (
	"errors"
	"net/mail"
	"time"

	"github.com/FR0ST1N/MyDailies/api/others"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	Name         string  `gorm:"size:128;not null" json:"name"`
	Email        string  `gorm:"size:128;not null;uniqueIndex" json:"email"`
	Admin        bool    `gorm:"not null;default:false;index" json:"admin"`
	Password     string  `gorm:"-" json:"-"`
	PasswordHash string  `gorm:"not null" json:"-"`
	Timezone     string  `gorm:"size:128;not null;default:UTC" json:"timezone"`
	Habits       []Habit `json:"-"`
}

type UserRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Admin    bool   `json:"admin"`
	Timezone string `json:"timezone"`
}

type ChangePasswordRequest struct {
	Password    string `json:"password"`
	NewPassword string `json:"new_password"`
}

type PatchUserRequest struct {
	Timezone string `json:"timezone"`
}

type UserLogin struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (req *UserRequest) GetUserStruct() *User {
	return &User{
		Name:     req.Name,
		Email:    req.Email,
		Password: req.Password,
		Admin:    req.Admin,
		Timezone: req.Timezone,
	}
}

func (login *UserLogin) GetUserStruct() *User {
	return &User{
		Email:    login.Email,
		Password: login.Password,
	}
}

func (u *User) HashPassword() (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(u.Password), 14)
	u.PasswordHash = string(bytes)
	return u.PasswordHash, err
}

func (u *User) CheckPasswordHash() bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(u.Password))
	return err == nil
}

func (u *User) ValidatePassword() error {
	if len(u.Password) < 6 {
		return errors.New(others.StrInvalidPassword)
	}
	return nil
}

func (u *User) Validate() error {
	// Check for name
	if u.Name == "" {
		return errors.New(others.StrEmptyNameField)
	}

	// Validate password
	if err := u.ValidatePassword(); err != nil {
		return err
	}

	// Validate email input
	if _, err := mail.ParseAddress(u.Email); err != nil {
		return errors.New(others.StrInvalidEmail)
	}

	// Validate timezone
	if _, err := others.GetTZLocation(u.Timezone); err != nil {
		return errors.New(others.StrInvalidTimezone)
	}

	return nil
}
