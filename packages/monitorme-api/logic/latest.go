package logic

import (
	"math"
	"monitorme/database"
	"monitorme/database/model"
	"net/http"
)

func GetLatestData(limit int) (response map[string]interface{}, statusCode int) {
	db := database.GetDB()

	snapshotLimit := int(math.Ceil(float64(limit) / 3))
	eventLimit := int(math.Ceil(float64(limit) / 3))
	spanLimit := limit - snapshotLimit - eventLimit

	var snapshots []model.Snapshot
	var events []model.Event
	var spans []model.Span

	if err := db.Order("created_at desc").Limit(snapshotLimit).Find(&snapshots).Error; err != nil {
		return map[string]interface{}{"error": "failed to fetch snapshots"}, http.StatusInternalServerError
	}

	if err := db.Order("created_at desc").Limit(eventLimit).Find(&events).Error; err != nil {
		return map[string]interface{}{"error": "failed to fetch events"}, http.StatusInternalServerError
	}

	if err := db.Order("created_at desc").Limit(spanLimit).Find(&spans).Error; err != nil {
		return map[string]interface{}{"error": "failed to fetch spans"}, http.StatusInternalServerError
	}

	response = map[string]interface{}{
		"snapshots": snapshots,
		"events":    events,
		"spans":     spans,
	}
	statusCode = http.StatusOK
	return
}
