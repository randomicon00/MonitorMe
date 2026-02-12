package controllers_test

import (
	"bytes"
	"encoding/json"
	"monitorme/controllers"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestLogin_Success(t *testing.T) {
	// create a new gin context
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	// set up the request body
	reqBody := map[string]string{
		"email":    "test@example.com",
		"password": "password123",
	}

	reqBodyBytes, _ := json.Marshal(reqBody)

	// add the request body to the context
	c.Request = httptest.NewRequest(http.MethodPost, "/login", bytes.NewBuffer(reqBodyBytes))
	c.Request.Header.Set("Content-Type", "application/json")

	// call the Login controller function
	controllers.Login(c)

	// check the response status code
	if w.Code != http.StatusOK {
		t.Errorf("expected status code %d but got %d", http.StatusOK, w.Code)
	}

	// check the response body
	var respBody map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &respBody)
	if err != nil {
		t.Errorf("failed to unmarshal response body: %v", err)
	}
	if _, ok := respBody["token"]; !ok {
		t.Errorf("response body did not contain a token")
	}
}

func TestLogin_Failure(t *testing.T) {
	// create a new gin context
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	// set up the request body
	reqBody := map[string]string{
		"email":    "test@example.com",
		"password": "wrongpassword",
	}
	reqBodyBytes, _ := json.Marshal(reqBody)

	// add the request body to the context
	c.Request = httptest.NewRequest(http.MethodPost, "/login", bytes.NewBuffer(reqBodyBytes))
	c.Request.Header.Set("Content-Type", "application/json")

	// call the Login controller function
	controllers.Login(c)

	// check the response status code
	if w.Code != http.StatusUnauthorized {
		t.Errorf("expected status code %d but got %d", http.StatusUnauthorized, w.Code)
	}

	// check the response body
	var respBody map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &respBody)
	if err != nil {
		t.Errorf("failed to unmarshal response body: %v", err)
	}
	if _, ok := respBody["error"]; !ok {
		t.Errorf("response body did not contain an error message")
	}
}
func TestRefresh(t *testing.T) {}
