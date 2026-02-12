package controllers

import (
	"monitorme/database/model"
	"monitorme/logic"
	"monitorme/middleware"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	var credentials model.Credentials

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request payload"})
		return
	}

	// Check credentials against the database or any other authentication method
	_, err := logic.Login(credentials.Email, credentials.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	// Generate JWT token
	myClaims := middleware.MyClaims{
		UserID: 123, // Get the user ID from the database or any other source
		Email:  credentials.Email,
	}
	tokenKind := "access"
	token, err := middleware.GenerateJWT(myClaims, tokenKind)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
	})
}

func Refresh(c *gin.Context) {}
