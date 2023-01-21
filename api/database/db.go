package database

import (
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func Init() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("MyDailies.db"), &gorm.Config{})

	if err != nil {
		log.Fatalln(err)
	}
	return db
}
