package controllers

import (
	"net/http"
	"time"

	"github.com/FR0ST1N/MyDailies/api/models"
	"github.com/FR0ST1N/MyDailies/api/others"
	"github.com/FR0ST1N/MyDailies/api/repository"
	"github.com/gin-gonic/gin"
)

type HabitController struct {
	Repo repository.IHabitRepository
}

func (controller *HabitController) CreateHabit(c *gin.Context) {
	// Bind inputs
	var req models.HabitRequest
	if err := c.BindJSON(&req); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}
	// Get user id from context
	uid, _ := c.Get("user")

	// Get struct
	habit := req.GetHabitStruct()
	habit.UserID = uid.(uint)

	// Validate habit name
	if habit.Name == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, others.GetErrJSON(others.StrEmptyHabitName))
		return
	}

	// Add habit to db
	if err := controller.Repo.Create(habit); err != nil {
		others.HandleGormError(c, err)
		return
	}
	c.Status(http.StatusCreated)
}

func (controller *HabitController) GetHabits(c *gin.Context) {
	// Get auth user id from context
	id, _ := c.Get("user")
	// Bind id to user model
	var user models.User = models.User{ID: id.(uint)}

	// Get all habits for auth user
	habits, err := controller.Repo.GetHabits(&user)
	if err != nil {
		others.HandleGormError(c, err)
		return
	}

	// Map output to response struct
	res := []*models.HabitAllResponse{}
	for i := 0; i < len(*habits); i++ {
		var lastActivity *time.Time
		n := len((*habits)[i].Entries)
		// Add entry as last activity
		if n > 0 {
			t := (*habits)[i].Entries[0].CreatedAt
			lastActivity = &t
		}

		// Add current habit to response
		res = append(res, &models.HabitAllResponse{
			ID:           (*habits)[i].ID,
			Name:         (*habits)[i].Name,
			CreatedAt:    (*habits)[i].CreatedAt,
			LastActivity: lastActivity,
		})
	}
	c.JSON(http.StatusOK, res)
}

func (controller *HabitController) GetHabit(c *gin.Context) {
	// Get habit id from context
	hid, _ := c.Get("habit")

	habit := models.HabitResponse{ID: hid.(uint)}

	// Read from db
	if err := controller.Repo.Read(&habit); err != nil {
		others.HandleGormError(c, err)
		return
	}

	// Add stat fields
	entriesCount, err := controller.Repo.EntriesCount(habit.ID)
	if err != nil {
		others.HandleGormError(c, err)
		return
	}
	habit.EntriesCount = entriesCount

	c.JSON(http.StatusOK, habit)
}

func (controller *HabitController) DeleteHabit(c *gin.Context) {
	// Get habit id from context
	hid, _ := c.Get("habit")

	// Add habit to db
	if err := controller.Repo.Delete(&models.Habit{ID: hid.(uint)}); err != nil {
		others.HandleGormError(c, err)
		return
	}
	c.Status(http.StatusOK)
}
