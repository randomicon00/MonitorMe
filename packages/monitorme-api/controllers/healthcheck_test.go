package controllers_test

import (
	"monitorme/controllers"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestHealthCheck(t *testing.T) {
	// Set up a Gin router and recorder for testing
	r := gin.Default()
	r.GET("/health", controllers.HealthCheck)
	w := httptest.NewRecorder()

	// Create a new HTTP request to the /health endpoint
	req, err := http.NewRequest("GET", "/health", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Perform the request and record the response
	r.ServeHTTP(w, req)

	// Check that the status code is 200 OK
	assert.Equal(t, http.StatusOK, w.Code)

	// Check the response body contains the expected message
	expectedPayload := `{"message":"server is up and running"}`
	assert.Equal(t, expectedPayload, w.Body.String())
}
