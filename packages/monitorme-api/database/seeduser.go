package database

import (
	"errors"
	"log"
	"monitorme/database/model"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// SeedDummyUser creates a dummy user for testing login functionality
func SeedDummyUser(db *gorm.DB) {

	// Define dummy credentials
	email := "user@email.com"
	password := "pass123"

	// Check if the user already exists
	var existingUser model.User
	if err := db.Where("email = ?", email).First(&existingUser).Error; err == nil {
		log.Println("Dummy user already exists, skipping creation")
		return
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		log.Fatalf("Failed to check for existing user: %v", err)
	}

	// Hash the password using bcrypt
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("Failed to hash password: %v", err)
	}

	// Create the user model
	user := model.User{
		Email:    email,
		Password: hashedPassword,
	}

	// Save the dummy user to the database
	if err := db.Create(&user).Error; err != nil {
		log.Fatalf("Failed to seed dummy user: %v", err)
	}

	log.Println("Dummy user created successfully.")
}
