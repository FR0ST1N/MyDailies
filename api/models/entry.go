package models

import (
	"time"

	"gorm.io/gorm"
)

type Entry struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	HabitID uint      `gorm:"index" json:"habit_id"`
	Date    time.Time `gorm:"index" json:"date"`
}
