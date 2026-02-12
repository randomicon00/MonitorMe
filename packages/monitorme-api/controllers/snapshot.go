package controllers

import (
	"io"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	"monitorme/lib/response"
	"monitorme/logic"
)

// GET events/snapshots
func GetSnapshots(c *gin.Context) {
	resp, statusCode := logic.GetSnapshots()
	response.JSON(c, statusCode, resp)
}

// GET events/snapshots_by_session/:id
func GetSnapshotsBySession(c *gin.Context) {
	sessionId := c.Param("id")

	resp, statusCode := logic.GetSnapshotsBySession(sessionId)
	response.JSON(c, statusCode, resp)
}

// POST events/snapshots/
func CreateSnapshots(c *gin.Context) {
	// Read the request body
	bodyData, err := io.ReadAll(c.Request.Body)
	if err != nil {
		log.Printf("Failed to read request body: %v", err)
		response.JSON(c, http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Log the bodyData for debugging purposes
	log.Printf("Extracted body data from request: %s", string(bodyData))

	// Extract headers
	headers := c.Request.Header

	// Pass headers and bodyData to the logic layer
	resp, statusCode := logic.CreateSnapshots(headers, bodyData)

	// Respond with the result
	response.JSON(c, statusCode, resp)
}
