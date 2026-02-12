package logic

import (
	"errors"
	"fmt"
	"monitorme/database"
	"monitorme/database/model"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func Login(email string, password string) (*model.User, error) {
	// Get database instance
	db := database.GetDB()

	// Try to find user by email
	var user model.User
	if err := db.Where("email = ?", email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("user with email %s not found", email)
		}
		return nil, fmt.Errorf("error finding user: %v", err)
	}

	// Perform password verification
	err := bcrypt.CompareHashAndPassword(user.Password, []byte(password))
	if err != nil {
		if err == bcrypt.ErrMismatchedHashAndPassword {
			return nil, fmt.Errorf("invalid credentials")
		}
		return nil, fmt.Errorf("error during password verification %v", err)
	}

	// If all checks passed, return user
	return &user, nil
}

func Refresh() {}
