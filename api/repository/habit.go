package repository

import (
	"fmt"
	"time"

	"github.com/FR0ST1N/MyDailies/api/models"
	"gorm.io/gorm"
)

type HabitRepository struct {
	DB *gorm.DB
}

type IHabitRepository interface {
	Create(u *models.Habit) error
	Delete(u *models.Habit) error
	Read(u *models.HabitResponse) error
	GetHabits(u *models.User) (*[]models.Habit, error)
	IsUser(userId uint, habitId uint) (bool, error)
	EntriesCount(habitId uint) (int64, error)
	Streak(habitId uint, loc *time.Location) (uint, error)
	LongestStreak(habitId uint) (uint, error)
}

func (repo *HabitRepository) Create(h *models.Habit) error {
	err := repo.DB.Create(&h).Error
	return err
}

func (repo *HabitRepository) Delete(h *models.Habit) error {
	err := repo.DB.Delete(&h).Error
	return err
}

func (repo *HabitRepository) Read(h *models.HabitResponse) error {
	err := repo.DB.Model(&models.Habit{}).First(&h, h.ID).Error
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

func (repo *HabitRepository) EntriesCount(habitId uint) (int64, error) {
	var count int64
	err := repo.DB.Model(&models.Entry{}).Where("habit_id = ?", habitId).Count(&count).Error
	return count, err
}

func (repo *HabitRepository) Streak(habitId uint, loc *time.Location) (uint, error) {
	var streak models.Streak
	t := time.Now().In(loc)
	now := fmt.Sprintf("%d-%02d-%d", t.Year(), int(t.Month()), t.Day())
	err := repo.DB.Raw(`
	WITH groups
	AS (SELECT
	  date,
	  DATE (date, - RANK () OVER (ORDER BY date) || ' days') AS date_group
	FROM entries
	WHERE habit_id = ?
	ORDER BY date)
	SELECT
	  COUNT(*) AS streak,
	  MIN(date) AS min_date,
	  MAX(date) AS max_date
	FROM groups
	GROUP BY date_group
	HAVING julianday(?) - julianday(max_date) < 2;
	`, habitId, now).Scan(&streak).Error
	return streak.Streak, err
}

func (repo *HabitRepository) LongestStreak(habitId uint) (uint, error) {
	var streak models.Streak
	err := repo.DB.Raw(`
	WITH groups
	AS (SELECT
	  date,
	  DATE (date, - RANK () OVER (ORDER BY date) || ' days') AS date_group
	FROM entries
	WHERE habit_id = ?
	ORDER BY date)
	SELECT
	  COUNT(*) AS streak,
	  MIN(date) AS min_date,
	  MAX(date) AS max_date
	FROM groups
	GROUP BY date_group
	ORDER BY streak DESC
	LIMIT 1;
	`, habitId).Scan(&streak).Error
	return streak.Streak, err
}
