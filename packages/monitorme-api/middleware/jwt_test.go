package middleware_test

import (
	"monitorme/middleware"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

var myClaims middleware.MyClaims

// Initialize JWT configuration and claims
func initJWTParams() {
	middleware.JWTConfig = middleware.JWTConfiguration{
		AccessKey:  []byte("access_key_secret"),
		AccessTTL:  5, // Short TTL for testing
		RefreshKey: []byte("refresh_key_secret"),
		RefreshTTL: 60,
		Audience:   "some_audience",
		Issuer:     "monitorme",
		AccNbf:     0,
		RefNbf:     0,
		Subject:    "subject",
	}
	myClaims = middleware.MyClaims{
		UserID: 12345,
		Email:  "testuser01@example.com",
	}
}

// TestGenerateJWT tests JWT generation for both access and refresh tokens
func TestGenerateJWT(t *testing.T) {
	initJWTParams()

	tests := []struct {
		description  string
		tokenKind    string
		expectedTTL  int
		expectedFail bool
	}{
		{"Valid access token", "access", middleware.JWTConfig.AccessTTL, false},
		{"Valid refresh token", "refresh", middleware.JWTConfig.RefreshTTL, false},
	}

	for _, tt := range tests {
		t.Run(tt.description, func(t *testing.T) {
			token, err := middleware.GenerateJWT(myClaims, tt.tokenKind)
			if (err != nil) != tt.expectedFail {
				t.Fatalf("expected error: %v, got: %v", tt.expectedFail, err)
			}
			if len(token) == 0 {
				t.Errorf("expected a non-empty token, got an empty string")
			}
		})
	}
}

// TestValidateAccessJWTToken tests access token validation middleware
func TestValidateAccessJWTToken(t *testing.T) {
	initJWTParams()

	validAccessTokenJWT, _ := middleware.GenerateJWT(myClaims, "access")
	invalidAccessToken := "invalid.token.string"

	tests := []struct {
		description    string
		authHeader     string
		expectedStatus int
	}{
		{"Missing authorization header", "", http.StatusUnauthorized},
		{"Malformed authorization header", "Bearer", http.StatusUnauthorized},
		{"Invalid token", "Bearer " + invalidAccessToken, http.StatusUnauthorized},
		{"Valid access token", "Bearer " + validAccessTokenJWT, http.StatusOK},
	}

	r := gin.New()
	r.Use(middleware.ValidateAccessJWTToken())
	r.GET("/test", func(c *gin.Context) {
		c.Status(http.StatusOK)
	})

	for _, tt := range tests {
		t.Run(tt.description, func(t *testing.T) {
			req, _ := http.NewRequest("GET", "/test", nil)
			if tt.authHeader != "" {
				req.Header.Set("Authorization", tt.authHeader)
			}

			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)
			if w.Code != tt.expectedStatus {
				t.Errorf("expected status %v, got %v", tt.expectedStatus, w.Code)
			}
		})
	}
}

// TestValidateRefreshJWTToken tests refresh token validation middleware
func TestValidateRefreshJWTToken(t *testing.T) {
	initJWTParams()

	validRefreshTokenJWT, _ := middleware.GenerateJWT(myClaims, "refresh")
	invalidRefreshToken := "invalid.refresh.token"

	tests := []struct {
		description    string
		authHeader     string
		expectedStatus int
	}{
		{"Missing authorization header", "", http.StatusUnauthorized},
		{"Malformed authorization header", "Bearer", http.StatusUnauthorized},
		{"Invalid token", "Bearer " + invalidRefreshToken, http.StatusUnauthorized},
		{"Valid refresh token", "Bearer " + validRefreshTokenJWT, http.StatusOK},
	}

	r := gin.New()
	r.Use(middleware.ValidateAndGetRefreshJWTToken())
	r.GET("/refresh_test", func(c *gin.Context) {
		c.Status(http.StatusOK)
	})

	for _, tt := range tests {
		t.Run(tt.description, func(t *testing.T) {
			req, _ := http.NewRequest("GET", "/refresh_test", nil)
			if tt.authHeader != "" {
				req.Header.Set("Authorization", tt.authHeader)
			}

			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)
			if w.Code != tt.expectedStatus {
				t.Errorf("expected status %v, got %v", tt.expectedStatus, w.Code)
			}
		})
	}
}

// TestExpiredAccessToken checks the behavior of an expired access token
func TestExpiredAccessToken(t *testing.T) {
	initJWTParams()
	middleware.JWTConfig.AccessTTL = -1 // Set access token TTL to past

	expiredToken, _ := middleware.GenerateJWT(myClaims, "access")

	r := gin.New()
	r.Use(middleware.ValidateAccessJWTToken())
	r.GET("/expired_test", func(c *gin.Context) {
		c.Status(http.StatusOK)
	})

	req, _ := http.NewRequest("GET", "/expired_test", nil)
	req.Header.Set("Authorization", "Bearer "+expiredToken)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("expected status %v for expired token, got %v", http.StatusUnauthorized, w.Code)
	}
}

// TestFutureAccessToken checks the behavior of a token valid in the future
func TestFutureAccessToken(t *testing.T) {
	initJWTParams()
	middleware.JWTConfig.AccNbf = 30 // Set token to be valid in 30 seconds

	futureToken, _ := middleware.GenerateJWT(myClaims, "access")

	r := gin.New()
	r.Use(middleware.ValidateAccessJWTToken())
	r.GET("/future_test", func(c *gin.Context) {
		c.Status(http.StatusOK)
	})

	req, _ := http.NewRequest("GET", "/future_test", nil)
	req.Header.Set("Authorization", "Bearer "+futureToken)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("expected status %v for token valid in the future, got %v", http.StatusUnauthorized, w.Code)
	}
}
