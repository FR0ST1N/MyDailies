package controllers

import (
	"errors"
	"net/http"
	"time"

	"github.com/FR0ST1N/MyDailies/api/models"
	"github.com/FR0ST1N/MyDailies/api/others"
	"github.com/FR0ST1N/MyDailies/api/repository"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type EntryController struct {
	Repo     repository.IEntryRepository
	UserRepo repository.IUserRepository
}

func (controller *EntryController) CreateEntry(c *gin.Context) {
	// Get habit id
	hid, _ := c.Get("habit")

	// Get user timezone
	id, _ := c.Get("user")
	user := models.User{ID: id.(uint)}
	if err := controller.UserRepo.FindByID(&user); err != nil {
		others.HandleGormError(c, err)
		return
	}
	loc, _ := others.GetTZLocation(user.Timezone)

	entry := models.Entry{HabitID: hid.(uint), Date: others.TruncateToDay(time.Now().In(loc))}

	// Check if entry already exists for that day and habit
	hasRecord := true
	if err := controller.Repo.Check(&entry, loc); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			hasRecord = false
		} else {
			others.HandleGormError(c, err)
			return
		}
	}

	if hasRecord {
		c.AbortWithStatusJSON(http.StatusConflict, others.GetErrJSON("Entry record for today already exists"))
		return
	}

	// Create new entry
	if err := controller.Repo.Create(&entry); err != nil {
		others.HandleGormError(c, err)
		return
	}
	c.Status(http.StatusCreated)
}

func (controller *EntryController) GetEntry(c *gin.Context) {
	// Get habit id
	hid, _ := c.Get("habit")

	// Query params
	year, yearErr := others.GetQueryUint(c, "year")
	month, monthErr := others.GetQueryUint(c, "month")
	if yearErr != nil || monthErr != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, others.GetErrJSON("Error parsing query parameters"))
		return
	}

	// Time range
	start := time.Date(int(year), time.Month(month), 1, 0, 0, 0, 0, time.UTC)
	end := start.AddDate(0, 1, 0).Add(-time.Nanosecond)

	entries, err := controller.Repo.ReadBetween(hid.(uint), start, end)
	if err != nil {
		others.HandleGormError(c, err)
		return
	}
	c.JSON(http.StatusOK, entries)
}

func (controller *EntryController) PatchNote(c *gin.Context) {

	var req models.NoteRequest

	if err := c.BindJSON(&req); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	id, err := others.GetParamUint(c, "entryId")

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, others.GetErrJSON("Id Invalid"))
		return
	}

	// Check if entry already exists for that day and habit
	if _, err := controller.Repo.CheckIfEntryExists(id); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.AbortWithStatusJSON(http.StatusConflict, others.GetErrJSON("Id Entry does not exist"))
			return
		} else {
			others.HandleGormError(c, err)
			return
		}

	}

	err = controller.Repo.Update(id, &models.Entry{Note: req.Note})

	if err != nil {
		others.HandleGormError(c, err)
		return
	}

	c.Status(http.StatusOK)
}
