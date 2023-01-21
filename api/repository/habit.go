package repository

import (
	"github.com/FR0ST1N/MyDailies/api/models"
	"gorm.io/gorm"
)

type HabitRepository struct {
	DB *gorm.DB
}

type IHabitRepository interface {
	Create(u *models.Habit) error
	Delete(u *models.Habit) error
	Read(u *models.Habit) error
	GetHabits(u *models.User) (*[]models.Habit, error)
	IsUser(userId uint, habitId uint) (bool, error)
}

func (repo *HabitRepository) Create(h *models.Habit) error {
	err := repo.DB.Create(&h).Error
	return err
}

func (repo *HabitRepository) Delete(h *models.Habit) error {
	err := repo.DB.Delete(&h).Error
	return err
}

func (repo *HabitRepository) Read(h *models.Habit) error {
	err := repo.DB.First(&h, h.ID).Error
	return err
}

func (repo *HabitRepository) GetHabits(u *models.User) (*[]models.Habit, error) {
	err := repo.DB.Model(&models.User{}).Preload("Habits").Preload("Habits.Entries", func(db *gorm.DB) *gorm.DB {
		return db.Group("entries.habit_id").Having("max(entries.id)")
	}).Find(&u).Error
	return &u.Habits, err
}

func (repo *HabitRepository) IsUser(userId uint, habitId uint) (bool, error) {
	var habit models.Habit = models.Habit{ID: habitId}
	err := repo.DB.First(&habit).Error
	if err != nil {
		return false, err
	}
	return habit.UserID == userId, nil
}
