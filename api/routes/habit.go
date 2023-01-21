package routes

import (
	"github.com/FR0ST1N/MyDailies/api/controllers"
	"github.com/FR0ST1N/MyDailies/api/middlewares"
	"github.com/FR0ST1N/MyDailies/api/repository"
	"github.com/gin-gonic/gin"
)

func InitHabitRoutes(r *gin.RouterGroup, repo repository.IHabitRepository) {
	// Init controller
	controller := controllers.HabitController{
		Repo: repo,
	}

	// Habit routes
	habitRoutes := r.Group("habit").Use(middlewares.Auth())
	{
		habitRoutes.POST("", controller.CreateHabit)
		habitRoutes.GET("/all", controller.GetHabits)
	}

	habitIdRoutes := r.Group("/habit/:id").Use(middlewares.Auth()).Use(middlewares.AuthorizeHabit(repo))
	{
		habitIdRoutes.GET("", controller.GetHabit)
		habitIdRoutes.DELETE("", controller.DeleteHabit)
	}
}
