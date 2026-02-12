package logic

import (
	"net/http"

	"monitorme/database"
	"monitorme/database/model"
	"monitorme/lib/helpers"

	log "github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

func GetAllSpans() (response model.Response, statusCode int) {
	db := database.GetDB()
	spans := []model.Span{}

	if err := db.Find(&spans).Error; err != nil {
		log.WithError(err).Error("error code: 1251")

		response.Data = "internal server error"
		statusCode = http.StatusInternalServerError
		return
	}

	if len(spans) == 0 {
		response.Data = "no spans found"
		statusCode = http.StatusOK
		return
	}

	response.Data = spans
	statusCode = http.StatusOK
	return
}

func GetSpanByID(spanID string) (response model.Response, statusCode int) {
	db := database.GetDB()
	var span model.Span

	if err := db.Model(&model.Span{}).Where("span_id", spanID).First(&span).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			response.Data = "span not found"
			statusCode = http.StatusNotFound
		} else {
			log.WithError(err).Error("error code: 1252")
			response.Data = "internal server error"
			statusCode = http.StatusInternalServerError
		}
		return
	}

	response.Data = span
	statusCode = http.StatusOK
	return
}

func GetSpansByTraceID(traceID string) (response model.Response, statusCode int) {
	db := database.GetDB()
	spans := []model.Span{}

	if err := db.Model(&model.Span{}).Where("trace_id = ?", traceID).Find(&spans).Error; err != nil {
		log.WithError(err).Error("error code: 1251")

		response.Data = "internal server error"
		statusCode = http.StatusInternalServerError
		return
	}

	if len(spans) == 0 {
		response.Data = "no spans found"
		statusCode = http.StatusOK
		return
	}

	response.Data = spans
	statusCode = http.StatusOK
	return
}

func GetSpansBySegmentID(segmentID string) (response model.Response, statusCode int) {
	db := database.GetDB()
	spans := []model.Span{}

	if err := db.Model(&model.Span{}).Where("segment_id = ?", segmentID).Find(&spans).Error; err != nil {
		log.WithError(err).Error("error code: 1251")

		response.Data = "internal server error"
		statusCode = http.StatusInternalServerError
		return
	}

	if len(spans) == 0 {
		response.Data = "no spans found"
		statusCode = http.StatusOK
		return
	}

	response.Data = spans
	statusCode = http.StatusOK
	return
}

func GetSpansBySessionID(sessionID string) (response model.Response, statusCode int) {
	db := database.GetDB()
	spans := []model.Span{}

	if err := db.Model(&model.Span{}).Where("session_id = ?", sessionID).Find(&spans).Error; err != nil {
		log.WithError(err).Error("error code: 1251")

		response.Data = "internal server error"
		statusCode = http.StatusInternalServerError
		return
	}

	if len(spans) == 0 {
		response.Data = "no spans found"
		statusCode = http.StatusOK
		return
	}

	response.Data = spans
	statusCode = http.StatusOK
	return
}

// logic
func CreateSpans(zkSpans []*model.ZipkinSpan) (model.Response, int) {
	var httpResponse model.Response
	db := database.GetDB()

	// Process the spans returns ([]*modelSpan, error)
	spans, err := helpers.ProcessSpans(zkSpans)
	if err != nil {
		log.WithError(err).Error("Error processing spans: 11191")
		httpResponse.Data = "Failed to process Zipkin spans"
		return httpResponse, http.StatusBadRequest
	}

	// If no spans were created, respond with Not Modified
	if len(spans) == 0 {
		httpResponse.Data = "No spans were created"
		return httpResponse, http.StatusNotModified
	}

	if err := db.Create(&spans).Error; err != nil {
		log.WithError(err).Error("Error saving spans to the database: 11192")
		httpResponse.Data = "Failed to save spans to the database"
		return httpResponse, http.StatusInternalServerError
	}

	// Successfully saved spans
	httpResponse.Data = "Spans created successfully!"
	return httpResponse, http.StatusCreated
}
