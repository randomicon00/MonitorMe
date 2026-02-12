package controllers

import (
	"monitorme/logic"
	"net/http"

	"github.com/gin-gonic/gin"
)

// POST /change-password
func ChangePassword(c *gin.Context) {
	var changePasswordRequest struct {
		OldPassword string `json:"oldPassword" binding:"required"`
		NewPassword string `json:"newPassword" binding:"required"`
		Notes       string `json:"notes"`
	}

	// Validate the input
	if err := c.BindJSON(&changePasswordRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input. OldPassword and NewPassword are required."})
		return
	}

	resp, statusCode := logic.ChangePassword(
		changePasswordRequest.OldPassword,
		changePasswordRequest.NewPassword,
		changePasswordRequest.Notes,
	)

	c.JSON(statusCode, resp)
}
