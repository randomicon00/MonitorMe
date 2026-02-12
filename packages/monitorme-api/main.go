package main

import (
	"log"
	"monitorme/app"
	"monitorme/config"
	"monitorme/database"

	"github.com/joho/godotenv"
)

func main() {
	log.Println("Loading local environment variables...")
	if err := godotenv.Load(); err != nil {
		panic("Error: Unable to load environment variables.")
	}

	log.Println("Loading application configuration...")
	if err := config.Config(); err != nil {
		log.Fatalf("Error: Unable to load application configuration: %v", err)
	}

	log.Println("Establishing a database connection...")
	database.InitDB()

	log.Println("Server starting in Production Mode")
	app.StartServer(":8888")
}
