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

func TestGetEvents(t *testing.T) {

	// create a new gin context
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	// call the GetEvents controller function
	controllers.GetEvents(c)

	// check the response status code
	if w.Code != http.StatusOK {
		t.Errorf("expected status code %d but got %d", http.StatusOK, w.Code)
	}

	// check the response body
	var respBody []model.Event
	err := json.Unmarshal(w.Body.Bytes(), &respBody)
	if err != nil {
		t.Errorf("failed to unmarshal response body: %v", err)
	}
	if len(respBody) != len(events) {
		t.Errorf("expected %d events in response body but got %d", len(events), len(respBody))
	}
	for i := range events {
		if !reflect.DeepEqual(respBody[i], events[i]) {
			t.Errorf("expected event %v but got %v", events[i], respBody[i])
		}
	}
}

func TestGetEventsBySegment(t *testing.T) {

	// create a new gin context
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	segmentId := "segment3"
	c.Params = append(c.Params, gin.Param{Key: "id", Value: segmentId})

	// call the GetEventsBySegment controller function
	controllers.GetEventsBySegment(c)

	// check the response status code
	if w.Code != http.StatusOK {
		t.Errorf("expected status code %d but got %d", http.StatusOK, w.Code)
	}

	// check the response body
	var respBody []model.Event
	err := json.Unmarshal(w.Body.Bytes(), &respBody)
	if err != nil {
		t.Errorf("failed to unmarshal response body: %v", err)
	}
	var eventsForSegment []model.Event
	for _, event := range events {
		if event.SegmentId == segmentId {
			eventsForSegment = append(eventsForSegment, event)
		}
	}
	if len(respBody) != len(eventsForSegment) {
		t.Errorf("expected %d events in response body but got %d", len(eventsForSegment), len(respBody))
	}
	for i := range eventsForSegment {
		if !reflect.DeepEqual(respBody[i], eventsForSegment[i]) {
			t.Errorf("expected event %v but got %v", eventsForSegment[i], respBody[i])
		}
	}
}

func TestGetEventsBySession(t *testing.T) {

	// create a new gin context
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	sessionID := "session1"
	c.Params = append(c.Params, gin.Param{Key: "id", Value: sessionID})

	// call the GetEventsBySession controller function
	controllers.GetEventsBySession(c)

	// check the response status code
	if w.Code != http.StatusOK {
		t.Errorf("expected status code %d but got %d", http.StatusOK, w.Code)
	}

	// check the response body
	var respBody []model.Event
	err := json.Unmarshal(w.Body.Bytes(), &respBody)
	if err != nil {
		t.Errorf("failed to unmarshal response body: %v", err)
	}
	var eventsForSession []model.Event
	for _, event := range events {
		if event.SessionId == sessionID {
			eventsForSession = append(eventsForSession, event)
		}
	}
	if len(respBody) != len(eventsForSession) {
		t.Errorf("expected %d events in response body but got %d", len(eventsForSession), len(respBody))
	}
	for i := range eventsForSession {
		if !reflect.DeepEqual(respBody[i], eventsForSession[i]) {
			t.Errorf("expected event %v but got %v", eventsForSession[i], respBody[i])
		}
	}
}

// TODO this is experimental code and must be tested
// To be tested!
func TestAddEvents(t *testing.T) {
	// create a new gin context
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	// create request
	body := []byte(`{"data": "some value event data"}`) // Adjust as needed
	c.Request, _ = http.NewRequest(http.MethodPost, "/events", bytes.NewBuffer(body))
	c.Request.Header.Set("user-id", "someuserid")
	c.Request.Header.Set("session-id", "somesessionid")
	c.Request.Header.Set("segment-id", "somesegmentid")

	// call the AddEvents controller function
	controllers.AddEvents(c)

	if w.Code != http.StatusCreated {
		t.Errorf("expected status code %d but got %d", http.StatusCreated, w.Code)
	}

	// Check the response body
	// TODO Do a better check of the response body
	var respBody map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &respBody)
	if err != nil {
		t.Errorf("failed to unmarshal response body: %v", err)
	}
}
