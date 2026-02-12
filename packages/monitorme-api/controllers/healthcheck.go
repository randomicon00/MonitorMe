package controllers

import (
	"monitorme/lib/response"
	"net/http"

	"github.com/gin-gonic/gin"
)

func HealthCheck(c *gin.Context) {
	response.JSON(c, http.StatusOK, gin.H{"message": "server is up and running"})
}
