package controllers_test

import (
	"encoding/json"
	"monitorme/controllers"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestGetLatestData(t *testing.T) {
	// Set up Gin for testing
	gin.SetMode(gin.TestMode)
	r := gin.New()

	// Register the endpoint
	r.GET("/latest-data", controllers.GetLatestData)

	t.Run("Default Limit", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/latest-data", nil)
		w := httptest.NewRecorder()

		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		var respBody map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &respBody)
		assert.NoError(t, err)
		assert.NotNil(t, respBody["data"])
		assert.IsType(t, []interface{}{}, respBody["data"])
	})

	t.Run("Custom Limit", func(t *testing.T) {
		limit := 3
		req := httptest.NewRequest(http.MethodGet, "/latest-data?limit="+strconv.Itoa(limit), nil)
		w := httptest.NewRecorder()

		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		var respBody map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &respBody)
		assert.NoError(t, err)
		assert.NotNil(t, respBody["data"])
		assert.IsType(t, []interface{}{}, respBody["data"])
	})

	t.Run("Invalid Limit", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/latest-data?limit=invalid", nil)
		w := httptest.NewRecorder()

		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
		var respBody map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &respBody)
		assert.NoError(t, err)
		assert.Equal(t, "invalid limit parameter", respBody["error"])
	})

	t.Run("Negative Limit", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/latest-data?limit=-5", nil)
		w := httptest.NewRecorder()

		r.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
		var respBody map[string]interface{}
		err := json.Unmarshal(w.Body.Bytes(), &respBody)
		assert.NoError(t, err)
		assert.Equal(t, "invalid limit parameter", respBody["error"])
	})
}
