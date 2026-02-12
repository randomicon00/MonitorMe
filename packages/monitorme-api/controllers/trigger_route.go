package controllers

import (
	"monitorme/lib/response"

	"github.com/gin-gonic/gin"

	"monitorme/logic"
)

func GetTriggerRoutes(c *gin.Context) {
	resp, statusCode := logic.GetTriggerRoutes()

	response.JSON(c, statusCode, resp)
}

func GetTracesByTriggerRoute(c *gin.Context) {
	// Todo extract from context
	// trigger_route := c.Body??
	// but this is a
	trigger_route := "/some/route"
	resp, statusCode := logic.GetTracesByTriggerRoute(trigger_route)

	response.JSON(c, statusCode, resp)
}
