package logic

import (
	"monitorme/database"
	"monitorme/database/model"
	"net/http"

	log "github.com/sirupsen/logrus"
)

// To move elsewhere
type SegmentID string

// GetSegmentIDsBySessionID retrieves segment IDs by session ID
func GetSegmentIDsBySessionID(sessionID string) (httpResponse model.Response, httpStatusCode int) {
	db := database.GetDB()

	segmentIDs := []SegmentID{}

	if err := db.Model(&model.Span{}).Where("session_id = ?", sessionID).Select("segment_id").Find(&segmentIDs).Error; err != nil {
		log.WithError(err).Error("error code: 1251")

		httpResponse.Data = "Internal server error"
		httpStatusCode = http.StatusInternalServerError
		return
	}

	if len(segmentIDs) == 0 {
		httpResponse.Data = "No segment IDs found"
		httpStatusCode = http.StatusOK
		return
	}

	httpResponse.Data = segmentIDs
	httpStatusCode = http.StatusOK
	return
}

// GetSegmentIDsByTriggerRoute retrieves segment IDs by trigger route
func GetSegmentIDsByTriggerRoute(triggerRoute string) (httpResponse model.Response, httpStatusCode int) {
	log.Info("GetSegmentIDsByTriggerRoute called with triggerRoute: ", triggerRoute)

	db := database.GetDB()
	segmentIDs := []SegmentID{}

	if err := db.Model(&model.Span{}).Where("trigger_route = ?", triggerRoute).Select("segment_id").Find(&segmentIDs).Error; err != nil {
		log.WithError(err).Error("Unable to retrieve segment IDs: database error occurred")
		httpResponse.Data = "Internal server error"
		httpStatusCode = http.StatusInternalServerError
		return
	}

	log.Info("Number of segment IDs retrieved: ", len(segmentIDs))

	if len(segmentIDs) == 0 {
		log.Info("No segment IDs found for the given trigger route")
		httpResponse.Data = "No segment IDs found for the given trigger route"
		httpStatusCode = http.StatusOK
		return
	}

	httpResponse.Data = segmentIDs
	httpStatusCode = http.StatusOK
	log.Info("Successfully retrieved segment IDs: ", segmentIDs)
	return
}
