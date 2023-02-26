package routes

import (
	"github.com/FR0ST1N/MyDailies/api/controllers"
	"github.com/FR0ST1N/MyDailies/api/middlewares"
	"github.com/FR0ST1N/MyDailies/api/repository"
	"github.com/gin-gonic/gin"
)

func InitUserRoutes(r *gin.RouterGroup, repo repository.IUserRepository) {
	// Init controller
	controller := controllers.UserController{
		Repo: repo,
	}

	// User routes
	userRoutes := r.Group("/user")
	{
		// Public routes
		userRoutes.POST("/token", controller.GenerateToken)
		userRoutes.POST("/setup-admin", controller.SetupAdmin)

		// User routes
		userRoutes.PATCH("/password", middlewares.Auth(), controller.ChangePassword)
		userRoutes.GET("", middlewares.Auth(), controller.GetUser)
		userRoutes.PATCH("", middlewares.Auth(), controller.PatchUser)

		// Admin routes
		userRoutes.POST("", middlewares.Auth(), middlewares.Admin(), controller.CreateUser)
		userRoutes.GET("/all", middlewares.Auth(), middlewares.Admin(), controller.GetUsers)
	}
}
