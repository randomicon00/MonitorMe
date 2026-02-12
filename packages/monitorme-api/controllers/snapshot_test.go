package controllers_test

import (
	"bytes"
	"encoding/json"
	"monitorme/controllers"
	"monitorme/database/model"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestGetSnapShots(t *testing.T) {
	// create a new gin context
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	// call the GetSnapshots controller function
	controllers.GetSnapshots(c)

	// check the response status code
	if w.Code != http.StatusOK {
		t.Errorf("expected status code %d but got %d", http.StatusOK, w.Code)
	}

	// check the response body
	var respBody []model.Snapshot
	err := json.Unmarshal(w.Body.Bytes(), &respBody)
	if err != nil {
		t.Errorf("failed to unmarshal response body: %v", err)
	}
	if len(respBody) != len(snapshots) {
		t.Errorf("expected %d snapshots in response body but got %d", len(snapshots), len(respBody))
	}
	for i := range snapshots {
		if !reflect.DeepEqual(respBody[i], snapshots[i]) {
			t.Errorf("expected snapshot %v but got %v", snapshots[i], respBody[i])
		}
	}
}

func TestGetSnapshotsBySession(t *testing.T) {
	// create a new gin context
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	sessionId := "session1"
	c.Params = append(c.Params, gin.Param{Key: "id", Value: sessionId})

	// call the GetSnapshotsBySession controller function
	controllers.GetSnapshotsBySession(c)

	// check the response status code
	if w.Code != http.StatusOK {
		t.Errorf("expected status code %d but got %d", http.StatusOK, w.Code)
	}

	// check the response body
	var respBody []model.Snapshot
	err := json.Unmarshal(w.Body.Bytes(), &respBody)
	if err != nil {
		t.Errorf("failed to unmarshal response body: %v", err)
	}
	var snapshotsBySession []model.Snapshot
	for _, snapshot := range snapshots {
		if snapshot.SessionId == sessionId {
			snapshotsBySession = append(snapshotsBySession, snapshot)
		}
	}
	if len(respBody) != len(snapshotsBySession) {
		t.Errorf("expected %d events in response body but got %d", len(snapshotsBySession), len(respBody))
	}
	for i := range snapshotsBySession {
		if !reflect.DeepEqual(respBody[i], snapshotsBySession[i]) {
			t.Errorf("expected event %v but got %v", snapshotsBySession[i], respBody[i])
		}
	}
}

func TestAddSnapshots(t *testing.T) {
	// create a new gin context
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	// create a new snapshot to add
	newSnapshot := model.Snapshot{SessionId: "session10", Data: []byte("random")}
	jsonPayload, err := json.Marshal(&newSnapshot)
	if err != nil {
		t.Errorf("failed to marshal snapshot to JSON: %v", err)
	}

	// set the JSON payload in the request body
	c.Request, err = http.NewRequest(http.MethodPost, "/events/addsnapshot", bytes.NewBuffer(jsonPayload))
	if err != nil {
		t.Errorf("failed to create request: %v", err)
	}
	c.Request.Header.Set("Content-Type", "application/json")

	// call the AddSnapshots controller function
	controllers.AddSnapshots(c)

	// check the response status code
	if w.Code != http.StatusCreated {
		t.Errorf("expected status code %d but got %d", http.StatusCreated, w.Code)
	}

	// check that the new snapshot has been added to the database
	var count int64
	result := testDB.Model(&model.Snapshot{}).Count(&count)
	if result.Error != nil {
		t.Errorf("failed to count snapshots in database: %v", result.Error)
	}
	if count != 6 {
		t.Errorf("expected 6 snapshots in database but got %d", count)
	}
}

// POST events/addsnapshot
/*
func AddSnapshots(c *gin.Context) {
	var newSnapshot model.Snapshot

	if err := c.BindJSON(&newSnapshot); err != nil {
		return
	}

	resp, statusCode := logic.AddSnapshot(newSnapshot)
	response.JSON(c, statusCode, resp)
}*/
