package middleware_test

import (
	"monitorme/middleware"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestCors(t *testing.T) {
	// create a new gin engine and add cors middleware
	router := gin.Default()
	router.Use(middleware.Cors())

	// create a test request with a valid origin
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.Header.Set("Origin", "http://localhost:8000")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// check if the response headers contain the Access-Control-Allow-Origin header
	resp := w.Result()
	if resp.Header.Get("Access-Control-Allow-Origin") != "http://localhost:8000" {
		t.Errorf("expected Access-Control-Allow-Origin header to be http://localhost:8000, but got %s", resp.Header.Get("Access-Control-Allow-Origin"))
	}
}

func TestCorsInvalidOrigin(t *testing.T) {
	// create a new gin engine and add cors middleware
	router := gin.Default()
	router.Use(middleware.Cors())

	// create a test request with an invalid origin
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.Header.Set("Origin", "http://evil.com")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// check if the response headers contain the Access-Control-Allow-Origin header
	resp := w.Result()
	if resp.Header.Get("Access-Control-Allow-Origin") != "" {
		t.Errorf("expected Access-Control-Allow-Origin header to be empty, but got %s", resp.Header.Get("Access-Control-Allow-Origin"))
	}
}
