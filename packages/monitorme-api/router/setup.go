package router

import (
	"monitorme/config"
	"monitorme/controllers"
	"monitorme/middleware"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetupRouter(config *config.Configuration) (*gin.Engine, error) {
	r := gin.Default()

	// TODO configuration
	// should the configuration be added here?

	// CORS middleware
	r.Use(middleware.Cors())

	// Auth middlware
	r.Use(func(c *gin.Context) {
		path := c.Request.URL.Path
		if path != "/auth/login" && path != "/auth/login/" && path != "/health" {
			// Validate the access token for non-login routes
			middleware.ValidateAccessJWTToken()(c)

			// If unauthorized, respond with 401 and a message instead of proceeding
			if c.IsAborted() {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: Please log in."})
				return
			}
		}
		c.Next()
	})

	// Health check route
	r.GET("/health", controllers.HealthCheck)

	// Latest
	r.GET("/latest", controllers.GetLatestData)

	// Change password
	r.POST("/change-password", controllers.ChangePassword)

	// Span routes
	spanGroup := r.Group("/spans")
	{
		spanGroup.GET("", controllers.GetSpans)
		spanGroup.GET("/:id", controllers.GetSpanByID)
		spanGroup.GET("/trace/:id", controllers.GetSpansByTrace)
		spanGroup.GET("/segment/:id", controllers.GetSpansBySegment)
		spanGroup.GET("/session/:id", controllers.GetSpansBySession)

		spanGroup.POST("", controllers.CreateSpans)
		spanGroup.POST("/", controllers.CreateSpans)
	}

	// Event routes
	eventGroup := r.Group("/events")
	{
		eventGroup.GET("/:id", controllers.GetEventByID)
		eventGroup.GET("", controllers.GetEvents)
		eventGroup.GET("/segment/:id", controllers.GetEventsBySegment)
		eventGroup.GET("/session/:id", controllers.GetEventsBySession)

		eventGroup.POST("", controllers.CreateEvents)
		eventGroup.POST("/", controllers.CreateEvents)
		snapshotGroup := r.Group("/snapshots")
		{
			snapshotGroup.GET("", controllers.GetSnapshots)
			snapshotGroup.GET("/", controllers.GetSnapshots)
			snapshotGroup.GET("/session/:id", controllers.GetSnapshotsBySession)

			snapshotGroup.POST("", controllers.CreateSnapshots)
			snapshotGroup.POST("/", controllers.CreateSnapshots)
		}
	}

	// Segment routes
	segmentGroup := r.Group("/segments")
	{
		segmentGroup.GET("", controllers.GetSegmentIDsByTriggerRoute)
		segmentGroup.GET("/session/:id", controllers.GetSegmentIDsBySessionID)
	}

	// Trigger Route routes
	triggerRouteGroup := r.Group("/trigger-routes")
	{
		triggerRouteGroup.GET("", controllers.GetTriggerRoutes)
		triggerRouteGroup.GET("/traces", controllers.GetTracesByTriggerRoute)
	}

	// Auth routes
	authGroup := r.Group("/auth")
	{
		authGroup.POST("/login", controllers.Login)
	}

	return r, nil
}
