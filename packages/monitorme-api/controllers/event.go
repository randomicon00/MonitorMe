package controllers

import (
	"io"
	"log"
	"monitorme/lib/response"
	"monitorme/logic"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetEvents(c *gin.Context) {
	resp, statusCode := logic.GetAllEvents()

	response.JSON(c, statusCode, resp)
}

func GetEventByID(c *gin.Context) {
	id := c.Param("id")

	resp, statusCode := logic.GetEventByID(id)

	response.JSON(c, statusCode, resp)
}

func GetEventsBySegment(c *gin.Context) {
	segmentId := c.Param("id")

	resp, statusCode := logic.GetEventsBySegment(segmentId)

	response.JSON(c, statusCode, resp)
}

func GetEventsBySession(c *gin.Context) {
	sessionId := c.Param("id")

	resp, statusCode := logic.GetEventsBySession(sessionId)

	response.JSON(c, statusCode, resp)
}

func CreateEvents(c *gin.Context) {
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
	resp, statusCode := logic.CreateEvents(headers, bodyData)

	// Respond with the result
	response.JSON(c, statusCode, resp)
}

/*


func AddEvents(c *gin.Context) {
        bodyData, err := ioutil.ReadAll(c.Request.Body)

        log.Println("Here is the bodyData that was extracted from request: ", bodyData)


	if err != nil {
		response.JSON(c, http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// var eventData []byte
	//if err := c.ShouldBindJSON(&eventData); err != nil {
//		response.JSON(c, http.StatusBadRequest, gin.H{"error": "Invalid request body"})
//		return }


	headers := c.Request.Header

	resp, statusCode := logic.AddEvents(headers, bodyData)

	response.JSON(c, statusCode, resp)
}*/
