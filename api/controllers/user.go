package controllers

import (
	"errors"
	"net/http"
	"net/mail"

	"github.com/FR0ST1N/MyDailies/api/auth"
	"github.com/FR0ST1N/MyDailies/api/models"
	"github.com/FR0ST1N/MyDailies/api/others"
	"github.com/FR0ST1N/MyDailies/api/repository"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type UserController struct {
	Repo repository.IUserRepository
}

func (controller *UserController) CreateUser(c *gin.Context) {
	var req models.UserRequest
	if err := c.BindJSON(&req); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}
	user := req.GetUserStruct()

	// Validate input
	if err := user.Validate(); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, others.GetErrJSON(err.Error()))
		return
	}

	// Hash password and create
	user.HashPassword()
	if err := controller.Repo.Create(user); err != nil {
		others.HandleGormError(c, err)
		return
	}
	c.Status(http.StatusCreated)
}

func (controller *UserController) SetupAdmin(c *gin.Context) {
	var req models.UserRequest
	if err := c.BindJSON(&req); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}
	user := req.GetUserStruct()

	// Validate input
	if err := user.Validate(); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, others.GetErrJSON(err.Error()))
		return
	}

	err := controller.Repo.HasAdmin()
	if errors.Is(err, gorm.ErrRecordNotFound) {
		user.Admin = true
	} else if err != nil {
		others.HandleGormError(c, err)
		return
	} else {
		c.AbortWithStatusJSON(http.StatusForbidden, others.GetErrJSON(others.StrAdminExists))
		return
	}

	// Hash password and create
	user.HashPassword()
	if err := controller.Repo.Create(user); err != nil {
		others.HandleGormError(c, err)
		return
	}
	c.Status(http.StatusCreated)
}

func (controller *UserController) ChangePassword(c *gin.Context) {
	// Get input
	var req models.ChangePasswordRequest
	if err := c.BindJSON(&req); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// Get user id from context
	id, _ := c.Get("user")

	// Get data from db
	user := models.User{ID: id.(uint)}
	if err := controller.Repo.FindByID(&user); err != nil {
		others.HandleGormError(c, err)
		return
	}
	user.Password = req.Password

	// Check old password
	if !user.CheckPasswordHash() {
		c.AbortWithStatusJSON(http.StatusUnauthorized, others.GetErrJSON(others.StrIncorrectPassword))
		return
	}

	// Validate and hash the new password
	updatedUser := models.User{ID: id.(uint), Password: req.NewPassword}
	if err := updatedUser.ValidatePassword(); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, others.GetErrJSON(err.Error()))
		return
	}
	updatedUser.HashPassword()

	// Update fields
	if err := controller.Repo.Update(id.(uint), &updatedUser); err != nil {
		others.HandleGormError(c, err)
		return
	}
	c.Status(http.StatusOK)
}

func (controller *UserController) GenerateToken(c *gin.Context) {
	var req models.UserLogin
	if err := c.BindJSON(&req); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}
	user := req.GetUserStruct()

	// Validate email input
	if _, err := mail.ParseAddress(user.Email); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, others.GetErrJSON(others.StrInvalidEmail))
		return
	}

	// Get user data by email
	if err := controller.Repo.FindByEmail(user); err != nil {
		others.HandleGormError(c, err)
		return
	}

	// Check password hash and create a new token
	if !user.CheckPasswordHash() {
		c.AbortWithStatusJSON(http.StatusUnauthorized, others.GetErrJSON(others.StrIncorrectPassword))
		return
	}
	token, err := auth.GenerateJWT(user)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": token})
}

func (controller *UserController) GetUser(c *gin.Context) {
	// Get id
	id, _ := c.Get("user")

	// Fetch data from db
	user := models.User{ID: id.(uint)}
	if err := controller.Repo.FindByID(&user); err != nil {
		others.HandleGormError(c, err)
		return
	}

	c.JSON(http.StatusOK, user)
}

func (controller *UserController) GetUsers(c *gin.Context) {
	// Get users from db
	users, err := controller.Repo.GetAllUsers()
	if err != nil {
		others.HandleGormError(c, err)
		return
	}
	c.JSON(http.StatusOK, users)
}

func (controller *UserController) PatchUser(c *gin.Context) {
	// Get input
	var req models.PatchUserRequest
	if err := c.BindJSON(&req); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// Init the user struct
	id, _ := c.Get("user")
	user := models.User{ID: id.(uint)}

	// Validate and set timezone
	if _, err := others.GetTZLocation(req.Timezone); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	} else {
		user.Timezone = req.Timezone
	}

	// Update
	if err := controller.Repo.Update(id.(uint), &user); err != nil {
		others.HandleGormError(c, err)
		return
	}

	c.Status(http.StatusOK)
}
