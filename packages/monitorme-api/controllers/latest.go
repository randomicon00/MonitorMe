package controllers

import (
	"net/http"
	"strconv"

	"monitorme/logic"

	"github.com/gin-gonic/gin"
)

func GetLatestData(c *gin.Context) {
	limitStr := c.Query("limit")
	if limitStr == "" {
		limitStr = "12" // Default limit
	}
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid limit parameter"})
		return
	}

	response, statusCode := logic.GetLatestData(limit)
	c.JSON(statusCode, response)
}
