package logic

import (
	"encoding/json"
	"monitorme/database"
	"monitorme/database/model"
	"net/http"

	log "github.com/sirupsen/logrus"
)

func GetSnapshots() (httpResponse model.Response, httpStatusCode int) {
	db := database.GetDB()
	snapshots := []model.Snapshot{}

	if err := db.Find(&snapshots).Error; err != nil {
		log.WithError(err).Error("error code: 1251")

		httpResponse.Data = "internal server error"
		httpStatusCode = http.StatusInternalServerError
		return
	}

	if len(snapshots) == 0 {
		httpResponse.Data = "no snapshots found"
		httpStatusCode = http.StatusOK
		return
	}

	httpResponse.Data = snapshots
	httpStatusCode = http.StatusOK
	return
}

func GetSnapshotsBySession(session_id string) (httpResponse model.Response, httpStatusCode int) {
	db := database.GetDB()
	snapshots := []model.Snapshot{}

	if err := db.Model(&model.Snapshot{}).Where("session_id = ?", session_id).Find(&snapshots).Error; err != nil {
		log.WithError(err).Error("error code: 1251")

		httpResponse.Data = "internal server error"
		httpStatusCode = http.StatusInternalServerError
		return
	}

	if len(snapshots) == 0 {
		httpResponse.Data = "no snapshots found"
		httpStatusCode = http.StatusOK
		return
	}

	httpResponse.Data = snapshots
	httpStatusCode = http.StatusOK
	return
}

func CreateSnapshots(header http.Header, data []byte) (httpResponse model.Response, httpStatusCode int) {
	db := database.GetDB()

	var jsonSnapshotData map[string]interface{}
	if err := json.Unmarshal(data, &jsonSnapshotData); err != nil {
		log.WithError(err).Error("Failed to parse JSON data (error code: 11193)")
		httpResponse.Data = "invalid JSON data"
		httpStatusCode = http.StatusBadRequest
		return
	}

	// Marshal the map to json.RawMessage format
	dataRawMessage, err := json.Marshal(jsonSnapshotData)
	if err != nil {
		log.Printf("Failed to marshal snapshot data to JSON: %v", err)
		httpResponse.Data = "could not process snapshot data"
		httpStatusCode = http.StatusInternalServerError
		return
	}

	// Construct the Snapshot model from the request headers and data
	snapshot := model.Snapshot{
		SessionId: header.Get("x-session-id"),
		Data:      json.RawMessage(dataRawMessage),
	}

	// Attempt to create the snapshot in the database
	if err := db.Create(&snapshot).Error; err != nil {
		log.WithError(err).Error("Failed to save event to the database (error code: 11194)")
		httpResponse.Data = "could not save snapshot to the database"
		httpStatusCode = http.StatusInternalServerError
		return
	}

	// On success, return a successful response
	httpResponse.Data = "Snapshot create successfully!"
	httpStatusCode = http.StatusCreated
	return
}
