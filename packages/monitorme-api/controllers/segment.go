package controllers

import (
	"monitorme/lib/response"

	"github.com/gin-gonic/gin"

	"monitorme/logic"
)

// GET segments?trigger_route=some_trigger_route
func GetSegmentIDsByTriggerRoute(c *gin.Context) {
	triggerRouteStr := c.Query("triggerRoute")
	resp, statusCode := logic.GetSegmentIDsByTriggerRoute(triggerRouteStr)
	response.JSON(c, statusCode, resp)
}

// GET segments/session/:id
func GetSegmentIDsBySessionID(c *gin.Context) {
	session_id := c.Param("id")
	resp, statusCode := logic.GetSegmentIDsBySessionID(session_id)
	response.JSON(c, statusCode, resp)
}
