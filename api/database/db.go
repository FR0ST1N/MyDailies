package database

import (
	"log"
	"os"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func makeDataDir() {
	path := "data"
	if _, err := os.Stat(path); os.IsNotExist(err) {
		if errDir := os.Mkdir(path, 0755); errDir != nil {
			log.Fatal(errDir)
		}
	}
}

func Init() *gorm.DB {
	makeDataDir()

	db, err := gorm.Open(sqlite.Open("data/MyDailies.db"), &gorm.Config{})

	if err != nil {
		log.Fatalln(err)
	}
	return db
}
