package controllers_test

import (
	"fmt"
	"net/http"
	"testing"
	"time"

	"github.com/FR0ST1N/MyDailies/api/models"
	"github.com/FR0ST1N/MyDailies/api/others"
	"github.com/FR0ST1N/MyDailies/api/routes"
	"github.com/FR0ST1N/MyDailies/mocks"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
	"gorm.io/gorm"
)

type EntryTestSuite struct {
	suite.Suite
	router *gin.Engine
}

func (suite *EntryTestSuite) SetupSuite() {
	gin.SetMode(gin.TestMode)
	suite.router = gin.Default()

	mockRepo := new(mocks.IEntryRepository)
	mockRepo.On("Create", mock.AnythingOfType("*models.Entry")).Return(nil)
	mockRepo.On("Check", &models.Entry{HabitID: 2, Date: others.TruncateToDay(time.Now())}).Return(nil)
	mockRepo.On("Check", mock.AnythingOfType("*models.Entry")).Return(gorm.ErrRecordNotFound)
	mockRepo.On("ReadBetween", mock.AnythingOfType("uint"), mock.AnythingOfType("time.Time"), mock.AnythingOfType("time.Time")).Return(&[]models.Entry{{ID: 1, HabitID: 1}, {ID: 2, HabitID: 1}}, nil)

	mockHabitRepo := new(mocks.IHabitRepository)
	mockHabitRepo.On("IsUser", mock.AnythingOfType("uint"), uint(3)).Return(false, nil)
	mockHabitRepo.On("IsUser", mock.AnythingOfType("uint"), mock.AnythingOfType("uint")).Return(true, nil)

	routes.InitEntryRoutes(suite.router.Group("/api"), mockRepo, mockHabitRepo)
}

func TestEntryTestSuite(t *testing.T) {
	suite.Run(t, new(EntryTestSuite))
}

func (suite *EntryTestSuite) TestCreateEntrySuccess() {
	a := assert.New(suite.T())
	td := TestData{code: http.StatusCreated}
	td.NewHttpRequest(a, suite.router, "POST", "/api/habit/1/entry", true, false)
}

func (suite *EntryTestSuite) TestCreateEntryAuth() {
	a := assert.New(suite.T())
	td := TestData{code: http.StatusUnauthorized, message: "Only authenticated users can create entry"}
	td.NewHttpRequest(a, suite.router, "POST", "/api/habit/1/entry", false, false)
}

func (suite *EntryTestSuite) TestCreateEntryMultiple() {
	a := assert.New(suite.T())
	td := TestData{code: http.StatusConflict, message: "Can't create multiple entries for the same habit on the same day"}
	td.NewHttpRequest(a, suite.router, "POST", "/api/habit/2/entry", true, false)
}

func (suite *EntryTestSuite) TestCreateEntryMismatch() {
	a := assert.New(suite.T())
	td := TestData{code: http.StatusUnauthorized, message: "Habit id does not belong to User ID"}
	td.NewHttpRequest(a, suite.router, "POST", "/api/habit/3/entry", true, false)
}

func (suite *EntryTestSuite) TestGetEntrySuccess() {
	a := assert.New(suite.T())
	td := TestData{code: http.StatusOK}
	url := fmt.Sprintf("/api/habit/1/entry?year=%d&month=%d", 2020, 1)
	w := td.NewHttpRequest(a, suite.router, "GET", url, true, false)
	expected := `[{"id": 1, "habit_id": 1, "created_at": "0001-01-01T00:00:00Z", "updated_at": "0001-01-01T00:00:00Z", "date": "0001-01-01T00:00:00Z"}, {"id": 2, "habit_id": 1, "created_at": "0001-01-01T00:00:00Z", "updated_at": "0001-01-01T00:00:00Z", "date": "0001-01-01T00:00:00Z"}]`
	actual := w.Body.String()
	a.JSONEq(expected, actual)
}

func (suite *EntryTestSuite) TestGetEntryAuth() {
	a := assert.New(suite.T())
	td := TestData{code: http.StatusUnauthorized, message: "Can't get entries when user is not authenticated"}
	url := fmt.Sprintf("/api/habit/1/entry?year=%d&month=%d", 2020, 1)
	td.NewHttpRequest(a, suite.router, "GET", url, false, false)
}

func (suite *EntryTestSuite) TestGetEntryQueryParam() {
	a := assert.New(suite.T())
	td1 := TestData{code: http.StatusBadRequest, message: "Invalid year query param"}
	url1 := fmt.Sprintf("/api/habit/1/entry?year=%s&month=%d", "test", 1)
	td1.NewHttpRequest(a, suite.router, "GET", url1, true, false)
	td2 := TestData{code: http.StatusBadRequest, message: "Invalid month query param"}
	url2 := fmt.Sprintf("/api/habit/1/entry?year=%d&month=%s", 2020, "test")
	td2.NewHttpRequest(a, suite.router, "GET", url2, true, false)
}
