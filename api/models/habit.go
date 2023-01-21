package models

import (
	"time"

	"gorm.io/gorm"
)

type Habit struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	Name    string  `gorm:"size:128;not null" json:"name"`
	UserID  uint    `gorm:"index" json:"user_id"`
	Entries []Entry `json:"-"`
}

type HabitRequest struct {
	Name string `json:"name"`
}

type HabitResponse struct {
	ID           uint       `json:"id"`
	Name         string     `json:"name"`
	CreatedAt    time.Time  `json:"created_at"`
	LastActivity *time.Time `json:"last_activity"`
}

func (req *HabitRequest) GetHabitStruct() *Habit {
	return &Habit{
		Name: req.Name,
	}
}
