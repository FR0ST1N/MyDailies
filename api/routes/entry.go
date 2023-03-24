package routes

import (
	"github.com/FR0ST1N/MyDailies/api/controllers"
	"github.com/FR0ST1N/MyDailies/api/middlewares"
	"github.com/FR0ST1N/MyDailies/api/repository"
	"github.com/gin-gonic/gin"
)

func InitEntryRoutes(r *gin.RouterGroup, repo repository.IEntryRepository, habitRepo repository.IHabitRepository, userRepo repository.IUserRepository) {
	// Init controller
	controller := controllers.EntryController{
		Repo:     repo,
		UserRepo: userRepo,
	}

	// Entry routes
	entryRoutes := r.Group("/habit/:id/entry").Use(middlewares.Auth()).Use(middlewares.AuthorizeHabit(habitRepo))
	{
		entryRoutes.POST("", controller.CreateEntry)
		entryRoutes.GET("", controller.GetEntry)
		entryRoutes.POST("/:entryId/note", controller.PatchNote)
	}
}
