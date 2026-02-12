package response

import "github.com/gin-gonic/gin"

func JSON(c *gin.Context, statusCode int, data interface{}) {
	if statusCode >= 400 {
		c.AbortWithStatusJSON(statusCode, data)
	}

	c.SecureJSON(statusCode, data)
}
