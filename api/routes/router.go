package routes

import (
	"github.com/FR0ST1N/MyDailies/api/repository"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func InitRoutes(db *gorm.DB) *gin.Engine {
	router := gin.Default()

	// Init routes
	apiRoutes := router.Group("/api")
	{
		InitUserRoutes(apiRoutes, &repository.UserRepository{DB: db})
		InitHabitRoutes(apiRoutes, &repository.HabitRepository{DB: db})
		InitEntryRoutes(apiRoutes, &repository.EntryRepository{DB: db}, &repository.HabitRepository{DB: db})
	}

	return router
}
