package main

import (
	"github.com/FR0ST1N/MyDailies/api/database"
	"github.com/FR0ST1N/MyDailies/api/models"
	"github.com/FR0ST1N/MyDailies/api/routes"
)

func main() {
	// Set up db
	db := database.Init()
	db.AutoMigrate(&models.User{})
	db.AutoMigrate(&models.Habit{})
	db.AutoMigrate(&models.Entry{})

	// Init routes and start server
	r := routes.InitRoutes(db)
	r.Run()
}
