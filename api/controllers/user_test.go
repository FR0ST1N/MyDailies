package controllers_test

import (
	"net/http"
	"testing"

	"github.com/FR0ST1N/MyDailies/api/models"
	"github.com/FR0ST1N/MyDailies/api/routes"
	"github.com/FR0ST1N/MyDailies/mocks"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
	"gorm.io/gorm"
)

type UserTestSuite struct {
	suite.Suite
	router *gin.Engine
}

func (suite *UserTestSuite) SetupSuite() {
	gin.SetMode(gin.TestMode)
	suite.router = gin.Default()
	mockRepo := new(mocks.IUserRepository)

	mockRepo.On("Create", mock.AnythingOfType("*models.User")).Return(nil)
	mockRepo.On("Update", mock.AnythingOfType("uint"), mock.AnythingOfType("*models.User")).Return(nil)
	mockRepo.On("FindByEmail", &models.User{Email: "john@example.com", Password: "wrong"}).Return(nil).Run(func(args mock.Arguments) {
		arg := args.Get(0).(*models.User)
		arg.PasswordHash = "random"
	})
	mockRepo.On("FindByEmail", mock.AnythingOfType("*models.User")).Return(nil).Run(func(args mock.Arguments) {
		arg := args.Get(0).(*models.User)
		arg.HashPassword()
	})
	mockRepo.On("FindByID", mock.AnythingOfType("*models.User")).Return(nil).Run(func(args mock.Arguments) {
		arg := args.Get(0).(*models.User)
		arg.Admin = false
		arg.Name = "John"
		arg.Email = "john@example.com"
		arg.ID = 1
		arg.Password = "password"
		arg.Timezone = "UTC"
		arg.HashPassword()
	})
	mockRepo.On("HasAdmin").Return(gorm.ErrRecordNotFound).Once()
	mockRepo.On("HasAdmin").Return(nil)
	mockRepo.On("GetAllUsers").Return(&[]models.User{{
		Admin:    false,
		Name:     "John",
		Email:    "john@example.com",
		ID:       1,
		Timezone: "UTC",
	}}, nil)

	routes.InitUserRoutes(suite.router.Group("/api"), mockRepo)
}

func TestUserTestSuite(t *testing.T) {
	suite.Run(t, new(UserTestSuite))
}

func (suite *UserTestSuite) TestTokenSuccess() {
	a := assert.New(suite.T())
	td := TestData{json: `{"email": "john@example.com", "password": "password"}`, code: http.StatusOK}
	w := td.NewHttpRequest(a, suite.router, "POST", "/api/user/token", false, false)
	a.Contains(w.Body.String(), "token")
}

func (suite *UserTestSuite) TestTokenInvalidEmail() {
	a := assert.New(suite.T())
	td := TestData{json: `{"email": "john", "password": "password"}`, code: http.StatusBadRequest}
	td.NewHttpRequest(a, suite.router, "POST", "/api/user/token", false, false)
}

func (suite *UserTestSuite) TestTokenWrongPassword() {
	a := assert.New(suite.T())
	td := TestData{json: `{"email": "john@example.com", "password": "wrong"}`, code: http.StatusUnauthorized}
	td.NewHttpRequest(a, suite.router, "POST", "/api/user/token", false, false)
}

func (suite *UserTestSuite) TestSetupAdmin() {
	a := assert.New(suite.T())
	data := []TestData{
		{json: `{"email": "john@example.com", "password": "password", "name": "John"}`, code: http.StatusCreated, message: "Create new admin when there is no admin in db"},
		{json: `{"email": "john@example.com", "password": "password", "name": "John"}`, code: http.StatusForbidden, message: "Don't create new admin when there is already an admin user in db"},
	}
	for i := 0; i < len(data); i++ {
		data[i].NewHttpRequest(a, suite.router, "POST", "/api/user/setup-admin", false, false)
	}
}

func (suite *UserTestSuite) TestSetupAdminInput() {
	a := assert.New(suite.T())
	data := []TestData{
		{json: `{"email": "john", "password": "password", "name": "John"}`, code: http.StatusBadRequest, message: "Invalid email"},
		{json: `{"email": "john@example.com", "password": "123", "name": "John"}`, code: http.StatusBadRequest, message: "Password less than 6 characters"},
		{json: `{"email": "john@example.com", "password": "password", "name": ""}`, code: http.StatusBadRequest, message: "Empty name field"},
		{json: `{"email": "john@example.com", "password": "password", "timezone": "test"}`, code: http.StatusBadRequest, message: "Invalid timezone"},
	}
	for i := 0; i < len(data); i++ {
		data[i].NewHttpRequest(a, suite.router, "POST", "/api/user/setup-admin", false, false)
	}
}

func (suite *UserTestSuite) TestGetUserSuccess() {
	a := assert.New(suite.T())
	td := TestData{code: http.StatusOK}
	w := td.NewHttpRequest(a, suite.router, "GET", "/api/user", true, false)
	expected := `{"email": "john@example.com", "id": 1, "admin": false, "name": "John", "created_at":"0001-01-01T00:00:00Z", "updated_at":"0001-01-01T00:00:00Z", "timezone": "UTC"}`
	actual := w.Body.String()
	a.JSONEq(expected, actual)
}

func (suite *UserTestSuite) TestGetUserAuth() {
	a := assert.New(suite.T())
	td := TestData{code: http.StatusUnauthorized, message: "Can't get user info when the request does not have a token"}
	td.NewHttpRequest(a, suite.router, "GET", "/api/user", false, false)
}

func (suite *UserTestSuite) TestCreateUserAuth() {
	a := assert.New(suite.T())
	td1 := TestData{code: http.StatusUnauthorized, message: "Should not be allowed to create a new user without token"}
	td1.NewHttpRequest(a, suite.router, "POST", "/api/user", false, false)
	td2 := TestData{code: http.StatusForbidden, message: "Should not be allowed to create a new user if the user is not admin"}
	td2.NewHttpRequest(a, suite.router, "POST", "/api/user", true, false)
}

func (suite *UserTestSuite) TestCreateUserSuccess() {
	a := assert.New(suite.T())
	td := TestData{code: http.StatusCreated, json: `{"admin": true, "email": "test@example.com", "password": "password", "name": "test", "timezone": "UTC"}`}
	td.NewHttpRequest(a, suite.router, "POST", "/api/user", true, true)
}

func (suite *UserTestSuite) TestCreateUserInput() {
	a := assert.New(suite.T())
	data := []TestData{
		{json: `{"email": "john", "password": "password", "name": "John"}`, code: http.StatusBadRequest, message: "Invalid email"},
		{json: `{"email": "john@example.com", "password": "123", "name": "John"}`, code: http.StatusBadRequest, message: "Password less than 6 characters"},
		{json: `{"email": "john@example.com", "password": "password", "name": ""}`, code: http.StatusBadRequest, message: "Empty name field"},
		{json: `{"email": "john@example.com", "password": "password", "timezone": "test"}`, code: http.StatusBadRequest, message: "Invalid timezone"},
	}
	for i := 0; i < len(data); i++ {
		data[i].NewHttpRequest(a, suite.router, "POST", "/api/user", true, true)
	}
}

func (suite *UserTestSuite) TestGetUsersAuth() {
	a := assert.New(suite.T())
	td1 := TestData{code: http.StatusUnauthorized, message: "Should not be allowed to get user list without token"}
	td1.NewHttpRequest(a, suite.router, "GET", "/api/user/all", false, false)
	td2 := TestData{code: http.StatusForbidden, message: "Should not be allowed to get user list if the user is not admin"}
	td2.NewHttpRequest(a, suite.router, "GET", "/api/user/all", true, false)
}

func (suite *UserTestSuite) TestGetUsersSuccess() {
	a := assert.New(suite.T())
	td := TestData{code: http.StatusOK}
	w := td.NewHttpRequest(a, suite.router, "GET", "/api/user/all", true, true)
	expected := `[{"email": "john@example.com", "id": 1, "admin": false, "name": "John", "created_at":"0001-01-01T00:00:00Z", "updated_at":"0001-01-01T00:00:00Z", "timezone": "UTC"}]`
	actual := w.Body.String()
	a.JSONEq(expected, actual)
}

func (suite *UserTestSuite) TestChangePasswordSuccess() {
	a := assert.New(suite.T())
	td := TestData{code: http.StatusOK, json: `{"password": "password", "new_password": "123456"}`}
	td.NewHttpRequest(a, suite.router, "PATCH", "/api/user/password", true, false)
}

func (suite *UserTestSuite) TestChangePasswordAuth() {
	a := assert.New(suite.T())
	td := TestData{code: http.StatusUnauthorized, message: "Can't change password when the request does not have a token"}
	td.NewHttpRequest(a, suite.router, "PATCH", "/api/user/password", false, false)
}

func (suite *UserTestSuite) TestChangePasswordIncorrectPassword() {
	a := assert.New(suite.T())
	td := TestData{code: http.StatusUnauthorized, json: `{"password": "password1", "new_password": "123456"}`}
	td.NewHttpRequest(a, suite.router, "PATCH", "/api/user/password", true, false)
}

func (suite *UserTestSuite) TestChangePasswordInvalidPassword() {
	a := assert.New(suite.T())
	td := TestData{code: http.StatusBadRequest, json: `{"password": "password", "new_password": "12345"}`, message: "New password is less than 6 characters"}
	td.NewHttpRequest(a, suite.router, "PATCH", "/api/user/password", true, false)
}

func (suite *UserTestSuite) TestPatchUserAuth() {
	a := assert.New(suite.T())
	td := TestData{code: http.StatusUnauthorized, message: "Can't patch when the request does not have a token"}
	td.NewHttpRequest(a, suite.router, "PATCH", "/api/user", false, false)
}

func (suite *UserTestSuite) TestPatchUserInvalidTimezone() {
	a := assert.New(suite.T())
	td := TestData{code: http.StatusBadRequest, json: `{"timezone": "test"}`, message: "Invalid timezone"}
	td.NewHttpRequest(a, suite.router, "PATCH", "/api/user", true, false)
}

func (suite *UserTestSuite) TestPatchUserValidTimezone() {
	a := assert.New(suite.T())
	td := TestData{code: http.StatusOK, json: `{"timezone": "Asia/Kolkata"}`}
	td.NewHttpRequest(a, suite.router, "PATCH", "/api/user", true, false)
}
