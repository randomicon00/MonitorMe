package logic

import (
	"net/http"

	"monitorme/database"
	"monitorme/database/model"

	log "github.com/sirupsen/logrus"
)

type APITriggerRoute struct {
	SpanID       string `json:"spanId"`
	TriggerRoute string `json:"triggerRoute"`
	Data         string `json:"data"`
}

func GetTriggerRoutes() (httpResponse model.Response, httpStatusCode int) {
	log.Info("GetTriggerRoutes called")

	db := database.GetDB()
	triggerRoutes := []APITriggerRoute{}

	// Attempting to retrieve trigger routes from the database
	if err := db.Model(&model.Span{}).
		Select("trigger_route, data, span_id").
		Find(&triggerRoutes).Error; err != nil {
		log.WithError(err).Error("Database query failed: Unable to retrieve trigger routes, error code: 1251")
		httpResponse.Data = "Internal server error"
		httpStatusCode = http.StatusInternalServerError
		return
	}

	log.Infof("Number of trigger routes retrieved: %d", len(triggerRoutes))

	if len(triggerRoutes) == 0 {
		log.Info("No trigger routes found in database")
		httpResponse.Data = "No trigger routes found"
		httpStatusCode = http.StatusOK
		return
	}

	httpResponse.Data = triggerRoutes
	httpStatusCode = http.StatusOK
	log.Info("Successfully retrieved trigger routes")
	return
}

type APITraceID struct {
	TraceID string `json:"trace_id"`
}

func GetTracesByTriggerRoute(triggerRoute string) (httpResponse model.Response, httpStatusCode int) {
	db := database.GetDB()

	traceIDs := []APITraceID{}

	// Correctly bind triggerRoute using "=?"
	if err := db.Model(&model.Span{}).Where("trigger_route = ?", triggerRoute).Select("trace_id").Find(&traceIDs).Error; err != nil {
		log.WithError(err).Error("error code: 1251")

		httpResponse.Data = "internal server error"
		httpStatusCode = http.StatusInternalServerError
		return
	}

	if len(traceIDs) == 0 {
		httpResponse.Data = "no trace_ids found"
		httpStatusCode = http.StatusOK
		return
	}

	httpResponse.Data = traceIDs
	httpStatusCode = http.StatusOK
	return
}
