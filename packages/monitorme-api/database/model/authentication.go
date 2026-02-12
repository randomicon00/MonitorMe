package model

import (
	"gorm.io/gorm"
)

type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type User struct {
	gorm.Model
	Email    string
	Password []byte
}
