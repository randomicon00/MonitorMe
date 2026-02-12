package middleware

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Cors() gin.HandlerFunc {
	// - No origin allowed by default
	// - GET,POST, PUT, HEAD methods
	// - Credentials share disabled
	// - Preflight requests cached for 12 hours
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{
		"http://localhost:3000",
		"http://localhost:3001",
		"http://localhost:4001",
		"http://localhost:5001",
		"http://localhost:3439",
		"http://localhost:3238",
	}
	config.AllowMethods = []string{"GET", "POST", "PUT", "HEAD", "OPTIONS"}
	config.AllowCredentials = true
	config.AllowHeaders = []string{"*"}

	return cors.New(config)
}
