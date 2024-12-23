package controllers_test

import (
	"fmt"
	"net/http"
	"testing"
	"time"

	"github.com/FR0ST1N/MyDailies/api/models"
	"github.com/FR0ST1N/MyDailies/api/routes"
	"github.com/FR0ST1N/MyDailies/mocks"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
	"gorm.io/gorm"
)

var utcTimeNow = time.Now().UTC()

type HabitTestSuite struct {
	suite.Suite
	router *gin.Engine
}

func (suite *HabitTestSuite) SetupSuite() {
	gin.SetMode(gin.TestMode)
	suite.router = gin.Default()
	mockRepo := new(mocks.IHabitRepository)

	mockRepo.On("Create", mock.AnythingOfType("*models.Habit")).Return(nil)
	mockRepo.On("Delete", &models.Habit{ID: 2}).Return(gorm.ErrRecordNotFound)
	mockRepo.On("Delete", mock.AnythingOfType("*models.Habit")).Return(nil)
	mockRepo.On("Read", mock.AnythingOfType("*models.HabitResponse")).Return(nil).Run(func(args mock.Arguments) {
		arg := args.Get(0).(*models.HabitResponse)
		arg.Name = "Drink Water"
		arg.ID = 1
		arg.UserID = 1
	})
	mockRepo.On("EntriesCount", mock.AnythingOfType("uint")).Return(int64(1), nil)
	mockRepo.On("Streak", mock.AnythingOfType("uint"), time.UTC).Return(uint(5), nil)
	mockRepo.On("LongestStreak", mock.AnythingOfType("uint")).Return(uint(10), nil)
	mockRepo.On("Update", mock.AnythingOfType("uint"), mock.AnythingOfType("*models.Habit")).Return(nil)
	mockRepo.On("GetHabits", mock.AnythingOfType("*models.User")).Return(&[]models.Habit{
		{ID: 1, Name: "Drink Water", UserID: 1, Entries: []models.Entry{{ID: 1, HabitID: 1, CreatedAt: utcTimeNow, Date: utcTimeNow}}},
		{ID: 2, Name: "Go For A Walk", UserID: 1},
		{ID: 3, Name: "Exercise", UserID: 1, Entries: []models.Entry{{ID: 2, HabitID: 3, CreatedAt: utcTimeNow, Date: utcTimeNow}}},
	}, nil)
	mockRepo.On("IsUser", mock.AnythingOfType("uint"), mock.AnythingOfType("uint")).Return(true, nil)

	mockUserRepo := new(mocks.IUserRepository)
	mockUserRepo.On("FindByID", mock.AnythingOfType("*models.User")).Return(nil).Run(func(args mock.Arguments) {
		arg := args.Get(0).(*models.User)
		arg.Timezone = "UTC"
	})

	routes.InitHabitRoutes(suite.router.Group("/api"), mockRepo, mockUserRepo)
}

func TestHabitTestSuite(t *testing.T) {
	suite.Run(t, new(HabitTestSuite))
}

func (suite *HabitTestSuite) TestCreateHabitSuccess() {
	a := assert.New(suite.T())
	td := TestData{json: `{"name": "water plants"}`, code: http.StatusCreated}
	td.NewHttpRequest(a, suite.router, "POST", "/api/habit", true, false)
}

func (suite *HabitTestSuite) TestCreateHabitAuth() {
	a := assert.New(suite.T())
	td := TestData{json: `{"name": "water plants"}`, code: http.StatusUnauthorized, message: "Should not create new habit when no auth token is in header"}
	td.NewHttpRequest(a, suite.router, "POST", "/api/habit", false, false)
}

func (suite *HabitTestSuite) TestCreateHabitInput() {
	a := assert.New(suite.T())
	td := TestData{json: `{"name": ""}`, code: http.StatusBadRequest, message: "Empty name field"}
	td.NewHttpRequest(a, suite.router, "POST", "/api/habit", true, false)
}

func (suite *HabitTestSuite) TestGetHabitsSuccess() {
	a := assert.New(suite.T())
	td := TestData{json: `{"name": "water plants"}`, code: http.StatusOK}
	w := td.NewHttpRequest(a, suite.router, "GET", "/api/habit/all", true, false)
	expected := fmt.Sprintf(`[{"name": %q, "id": %d, "created_at": "0001-01-01T00:00:00Z", "last_activity": %q, "completed_today": %t},{"name": %q, "id": %d, "created_at": "0001-01-01T00:00:00Z", "last_activity": null, "completed_today": %t}, {"name": %q, "id": %d, "created_at": "0001-01-01T00:00:00Z", "last_activity": %q, "completed_today": %t}]`,
		"Drink Water", 1, utcTimeNow.Format(time.RFC3339Nano), true, "Go For A Walk", 2, false, "Exercise", 3, utcTimeNow.Format(time.RFC3339Nano), true)
	actual := w.Body.String()
	a.JSONEq(expected, actual)
}

func (suite *HabitTestSuite) TestGetHabitsSortSuccess() {
	a := assert.New(suite.T())
	td := TestData{json: `{"name": "water plants"}`, code: http.StatusOK}
	w := td.NewHttpRequest(a, suite.router, "GET", "/api/habit/all?sort=completed", true, false)
	expected := fmt.Sprintf(`[{"name": %q, "id": %d, "created_at": "0001-01-01T00:00:00Z", "last_activity": null, "completed_today": %t},{"name": %q, "id": %d, "created_at": "0001-01-01T00:00:00Z", "last_activity": %q, "completed_today": %t},  {"name": %q, "id": %d, "created_at": "0001-01-01T00:00:00Z", "last_activity": %q, "completed_today": %t}]`,
		"Go For A Walk", 2, false, "Drink Water", 1, utcTimeNow.Format(time.RFC3339Nano), true, "Exercise", 3, utcTimeNow.Format(time.RFC3339Nano), true)
	actual := w.Body.String()
	a.JSONEq(expected, actual)
}

func (suite *HabitTestSuite) TestGetHabitsAuth() {
	a := assert.New(suite.T())
	td := TestData{code: http.StatusUnauthorized, message: "Only authenticated users can access their habits"}
	td.NewHttpRequest(a, suite.router, "GET", "/api/habit/all", false, false)
}

func (suite *HabitTestSuite) TestGetHabitSuccess() {
	a := assert.New(suite.T())
	td := TestData{code: http.StatusOK}
	w := td.NewHttpRequest(a, suite.router, "GET", "/api/habit/1", true, false)
	expected := `{"name": "Drink Water", "id": 1, "user_id": 1, "created_at": "0001-01-01T00:00:00Z", "updated_at": "0001-01-01T00:00:00Z", "entries_count": 1, "streak": 5, "longest_streak": 10}`
	actual := w.Body.String()
	a.JSONEq(expected, actual)
}

func (suite *HabitTestSuite) TestGetHabitAuth() {
	a := assert.New(suite.T())
	td := TestData{code: http.StatusUnauthorized, message: "User need to be logged in to view their habit"}
	td.NewHttpRequest(a, suite.router, "GET", "/api/habit/1", false, false)
}

func (suite *HabitTestSuite) TestDeleteHabitSuccess() {
	a := assert.New(suite.T())
	td := TestData{code: http.StatusOK}
	td.NewHttpRequest(a, suite.router, "DELETE", "/api/habit/1", true, false)
}

func (suite *HabitTestSuite) TestDeleteHabitAuth() {
	a := assert.New(suite.T())
	td := TestData{code: http.StatusUnauthorized, message: "User need to be logged in to delete their habit"}
	td.NewHttpRequest(a, suite.router, "GET", "/api/habit/1", false, false)
}

func (suite *HabitTestSuite) TestDeleteHabitNotExist() {
	a := assert.New(suite.T())
	td := TestData{code: http.StatusNotFound, message: "Habit must exist to perform delete"}
	td.NewHttpRequest(a, suite.router, "DELETE", "/api/habit/2", true, false)
}
