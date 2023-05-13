package controllers

import (
	"net/http"
	"sort"
	"time"

	"github.com/FR0ST1N/MyDailies/api/models"
	"github.com/FR0ST1N/MyDailies/api/others"
	"github.com/FR0ST1N/MyDailies/api/repository"
	"github.com/gin-gonic/gin"
)

type HabitController struct {
	Repo     repository.IHabitRepository
	UserRepo repository.IUserRepository
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

	// Get query for sort
	sortBy := c.Query("sort")

	// Bind id to user model
	var user models.User = models.User{ID: id.(uint)}

	// Get user data
	if err := controller.UserRepo.FindByID(&user); err != nil {
		others.HandleGormError(c, err)
		return
	}

	// Get timezone
	loc, _ := others.GetTZLocation(user.Timezone)

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
		var activityDate *time.Time
		n := len((*habits)[i].Entries)
		// Add entry as last activity
		if n > 0 {
			lastActivity = &(*habits)[i].Entries[0].CreatedAt
			activityDate = &(*habits)[i].Entries[0].Date
		}

		userTimeNow := time.Now().In(loc)
		// Add current habit to response
		res = append(res, &models.HabitAllResponse{
			ID:             (*habits)[i].ID,
			Name:           (*habits)[i].Name,
			CreatedAt:      (*habits)[i].CreatedAt,
			LastActivity:   lastActivity,
			CompletedToday: others.IsToday(activityDate, &userTimeNow),
		})
	}

	if sortBy == "completed" {
		// Sort so that completed items are at the end of the slice
		sort.SliceStable(res, func(i, j int) bool {
			return !res[i].CompletedToday && res[j].CompletedToday
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

	// Get user timezone
	id, _ := c.Get("user")
	user := models.User{ID: id.(uint)}
	if err := controller.UserRepo.FindByID(&user); err != nil {
		others.HandleGormError(c, err)
		return
	}
	loc, _ := others.GetTZLocation(user.Timezone)

	// Add stat fields
	entriesCount, err := controller.Repo.EntriesCount(habit.ID)
	if err != nil {
		others.HandleGormError(c, err)
		return
	}
	habit.EntriesCount = entriesCount

	streak, err := controller.Repo.Streak(habit.ID, loc)
	if err != nil {
		others.HandleGormError(c, err)
		return
	}
	habit.Streak = streak

	longestStreak, err := controller.Repo.LongestStreak(habit.ID)
	if err != nil {
		others.HandleGormError(c, err)
		return
	}
	habit.LongestStreak = longestStreak

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
