package controllers_test

import (
	"bytes"
	"encoding/json"
	"monitorme/controllers"
	"monitorme/lib/helpers"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

var mockSendEmail = func(to, subject, body string) error {
	// Simulate email sending success
	return nil
}

func TestChangePassword(t *testing.T) {
	// Replace the real SendEmail with the mock
	helpers.SendEmail = mockSendEmail

	// Create a new Gin engine for testing
	gin.SetMode(gin.TestMode)
	r := gin.New()

	// Register the endpoint
	r.POST("/change-password", controllers.ChangePassword)

	t.Run("Successful Password Change Request", func(t *testing.T) {
		requestBody := map[string]string{
			"oldPassword": "password123", // Matches the initialized user's password in SetupDB
			"newPassword": "newStrongPassword",
			"notes":       "Changed for security reasons",
		}
		body, _ := json.Marshal(requestBody)

		req := httptest.NewRequest(http.MethodPost, "/change-password", bytes.NewReader(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		var respBody map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &respBody)
		assert.NoError(t, err)
		assert.Equal(t, "Password change request sent to admin successfully", respBody["data"])
	})

	t.Run("Email Sending Failure", func(t *testing.T) {
		// Replace mockSendEmail to simulate failure
		helpers.SendEmail = func(to, subject, body string) error {
			return assert.AnError // Simulate email sending failure
		}
		defer func() { helpers.SendEmail = mockSendEmail }() // Restore original mock after the test

		requestBody := map[string]string{
			"oldPassword": "password123",
			"newPassword": "newStrongPassword",
			"notes":       "Test email failure",
		}
		body, _ := json.Marshal(requestBody)

		req := httptest.NewRequest(http.MethodPost, "/change-password", bytes.NewReader(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusInternalServerError, w.Code)
		var respBody map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &respBody)
		assert.NoError(t, err)
		assert.Equal(t, "Failed to send password change request email", respBody["data"])
	})

	t.Run("Invalid Input", func(t *testing.T) {
		requestBody := map[string]string{
			"oldPassword": "",
			"newPassword": "newStrongPassword",
		}
		body, _ := json.Marshal(requestBody)

		req := httptest.NewRequest(http.MethodPost, "/change-password", bytes.NewReader(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
		var respBody map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &respBody)
		assert.NoError(t, err)
		assert.Equal(t, "Invalid input. OldPassword and NewPassword are required.", respBody["error"])
	})
}
