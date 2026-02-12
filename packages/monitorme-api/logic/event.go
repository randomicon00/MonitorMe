package logic

import (
	"encoding/json"
	"monitorme/database"
	"monitorme/database/model"
	"net/http"

	log "github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

func GetAllEvents() (response model.Response, statusCode int) {
	db := database.GetDB()
	events := []model.Event{}

	if err := db.Find(&events).Error; err != nil {
		log.WithError(err).Error("error code: 1251")

		response.Data = "internal server error"
		statusCode = http.StatusInternalServerError
		return
	}

	if len(events) == 0 {
		response.Data = "no events found"
		statusCode = http.StatusOK
		return
	}

	response.Data = events
	statusCode = http.StatusOK
	return
}

func GetEventByID(eventId string) (response model.Response, statusCode int) {
	log.Printf("GetEventByID called with eventId: %s", eventId)
	db := database.GetDB()
	var event model.Event

	if err := db.Model(&model.Event{}).Where("id", eventId).First(&event).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			response.Data = "event not found"
			statusCode = http.StatusNotFound
		} else {
			log.WithError(err).Error("error code: 1352")
			response.Data = "internal server error"
			statusCode = http.StatusInternalServerError
		}
		return
	}

	response.Data = event
	statusCode = http.StatusOK
	return
}

// Todo test db.Where condition
func GetEventsBySegment(segmentId string) (httpResponse model.Response, httpStatusCode int) {
	log.Printf("GetEventsBySegment called with segmentId: %s", segmentId)
	db := database.GetDB()
	events := []model.Event{}

	if err := db.Where("segment_id = ?", segmentId).Find(&events).Error; err != nil {
		log.WithError(err).Error("error code: 1251")

		httpResponse.Data = "internal server error"
		httpStatusCode = http.StatusInternalServerError
		return
	}

	if len(events) == 0 {
		httpResponse.Data = "no events found"
		httpStatusCode = http.StatusOK
		return
	}

	httpResponse.Data = events
	httpStatusCode = http.StatusOK
	return
}

// TODO test db.Where condition
func GetEventsBySession(sessionId string) (httpResponse model.Response, httpStatusCode int) {
	log.Printf("GetEventsBySession called with sessionId: %s", sessionId)
	db := database.GetDB()
	events := []model.Event{}

	if err := db.Where("session_id = ?", sessionId).Find(&events).Error; err != nil {
		log.WithError(err).Error("error code: 1251")

		httpResponse.Data = "internal server error"
		httpStatusCode = http.StatusInternalServerError
		return
	}

	if len(events) == 0 {
		httpResponse.Data = "no events found"
		httpStatusCode = http.StatusOK
		return
	}

	httpResponse.Data = events
	httpStatusCode = http.StatusOK
	return
}

func CreateEvents(header http.Header, data []byte) (httpResponse model.Response, httpStatusCode int) {
	db := database.GetDB()
	// Validate JSON format
	if !json.Valid(data) {
		log.Error("Invalid JSON data (error code: 11193)")
		httpResponse.Data = "invalid JSON data"
		return httpResponse, http.StatusBadRequest
	}

	// Construct the Event model from the request headers and data
	event := model.Event{
		UserId:    header.Get("x-user-id"),
		SessionId: header.Get("x-session-id"),
		SegmentId: header.Get("x-segment-id"),
		Data:      json.RawMessage(data),
		// Data: jsonEventData,
	}

	// Attempt to create the event in the database
	if err := db.Create(&event).Error; err != nil {
		log.WithError(err).Error("Failed to save event to the database (error code: 11194)")
		httpResponse.Data = "could not save event to the database"
		httpStatusCode = http.StatusInternalServerError
		return
	}

	// On success, return a successful response
	httpResponse.Data = "Event create successfully!"
	httpStatusCode = http.StatusCreated
	return
}

/*
func AddEvents(header http.Header, data []byte) (httpResponse model.Response, httpStatusCode int) {
	db := database.GetDB()

	// Get the headers info
	event := model.Event{
		UserId:    header.Get("x-user-id"),
		SessionId: header.Get("x-session-id"),
		SegmentId: header.Get("x-segment-id"),
		Data:      data,
	}
	log.Println("Here is the db reference: ", db)

	if err := db.Create(&event).Error; err != nil {
		log.WithError(err).Error("error code: 11194")

		httpResponse.Data = "could not save event to the database"
		httpStatusCode = http.StatusInternalServerError
		return
	}

	httpResponse.Data = "Event created successfully!"
	httpStatusCode = http.StatusCreated
	return
}

// Todo
func AddEvents() (httpResponse model.Response, httpStatusCode int) {
	db := database.GetDB()
	events := []model.Event{{
		UserId:    "someid",
		SegmentId: "somesegmentid",
		SessionId: "somesessionid",
		Data:      []byte{1, 2, 3, 4, 5},
	}}

	if err := db.Create(&events).Error; err != nil {
		log.WithError(err).Error("error code: 1251")

		httpResponse.Data = "internal server error"
		httpStatusCode = http.StatusInternalServerError
		return
	}
	ids := SelectIDs(events, func(e model.Event) uint { return e.ID })

	httpResponse.Data = ids
	httpStatusCode = http.StatusCreated
	return
}

// TODO place this code elsewhere
type MapId func(u model.Event) uint

func SelectIDs(events []model.Event, mapID MapId) []uint {
	ids := []uint{}
	for _, e := range events {
		ids = append(ids, mapID(e))
	}

	return ids
}
*/
