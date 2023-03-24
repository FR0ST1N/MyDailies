package repository

import (
	"time"

	"github.com/FR0ST1N/MyDailies/api/models"
	"github.com/FR0ST1N/MyDailies/api/others"
	"gorm.io/gorm"
)

type EntryRepository struct {
	DB *gorm.DB
}

type IEntryRepository interface {
	Create(e *models.Entry) error
	Check(e *models.Entry, loc *time.Location) error
	CheckIfEntryExists(entryId uint) (*models.Entry, error)
	Update(id uint, e *models.Entry) error
	ReadBetween(hid uint, start time.Time, end time.Time) (*[]models.Entry, error)
}

func (repo *EntryRepository) Create(e *models.Entry) error {
	err := repo.DB.Create(&e).Error
	return err
}

func (repo *EntryRepository) Check(e *models.Entry, loc *time.Location) error {
	t := time.Now().In(loc)
	err := repo.DB.Where("habit_id = ? AND date >= ?", e.HabitID, others.TruncateToDay(t)).Take(&e).Error
	return err
}

func (repo *EntryRepository) ReadBetween(hid uint, start time.Time, end time.Time) (*[]models.Entry, error) {
	var entries []models.Entry
	err := repo.DB.Where("habit_id = ?", hid).Where("date BETWEEN ? AND ?", start, end).Find(&entries).Error
	return &entries, err
}

func (repo *EntryRepository) CheckIfEntryExists(entryId uint) (*models.Entry, error) {
	var entry models.Entry
	err := repo.DB.Where("id = ?", entryId).Find(&entry).Error
	return &entry, err
}

func (repo *EntryRepository) Update(id uint, e *models.Entry) error {
	err := repo.DB.Model(&models.Entry{ID: id}).Updates(&e).Error
	return err
}
