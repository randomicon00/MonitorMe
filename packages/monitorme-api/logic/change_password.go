package logic

import (
	"monitorme/database/model"
	"monitorme/lib/helpers"
	"net/http"

	log "github.com/sirupsen/logrus"
)

func ChangePassword(oldPassword, newPassword, notes string) (response model.Response, statusCode int) {
	var httpResponse model.Response

	emailContent := "Password Change Request:\n" +
		"Old Password: [REDACTED]\n" +
		"New Password: [REDACTED]\n" +
		"Notes: " + notes

	err := helpers.SendEmail("admin@example.com", "Password Change Request", emailContent)

	if err != nil {
		log.WithError(err).Error("Error sending password change email")
		httpResponse.Data = "Failed to send password change request email"
		return httpResponse, http.StatusInternalServerError
	}

	log.Info("Password change request email sent to admin")
	httpResponse.Data = "Password change request sent to admin successfully"
	return httpResponse, http.StatusOK
}
