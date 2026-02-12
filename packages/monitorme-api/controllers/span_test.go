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

func TestGetSpans(t *testing.T) {
	// create a new gin context
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	// call the GetSpans controller function
	controllers.GetSpans(c)

	// check the response status code
	if w.Code != http.StatusOK {
		t.Errorf("expected status code %d but got %d", http.StatusOK, w.Code)
	}

	// check the response body
	var respBody []model.Span
	err := json.Unmarshal(w.Body.Bytes(), &respBody)
	if err != nil {
		t.Errorf("failed to unmarshal response body: %v", err)
	}
	if len(respBody) != len(spans) {
		t.Errorf("expected %d spans in response body but got %d", len(spans), len(respBody))
	}
	for i := range spans {
		if !reflect.DeepEqual(respBody[i], spans[i]) {
			t.Errorf("expected span %v but got %v", spans[i], respBody[i])
		}
	}
}

func TestGetSpansByTrace(t *testing.T) {
	// create a new gin context
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	traceId := "trace-456"
	c.Params = append(c.Params, gin.Param{Key: "id", Value: traceId})

	// call the GetSpansByTrace controller function
	controllers.GetSpansByTrace(c)

	// check the response status code
	if w.Code != http.StatusOK {
		t.Errorf("expected status code %d but got %d", http.StatusOK, w.Code)
	}

	// check the response body
	var respBody []model.Span
	err := json.Unmarshal(w.Body.Bytes(), &respBody)
	if err != nil {
		t.Errorf("failed to unmarshal response body: %v", err)
	}
	var spansByTrace []model.Span
	for _, span := range spans {
		if span.TraceId == traceId {
			spansByTrace = append(spansByTrace, span)
		}
	}
	if len(respBody) != len(spansByTrace) {
		t.Errorf("expected %d spans in response body but got %d", len(spansByTrace), len(respBody))
	}
	for i := range spansByTrace {
		if !reflect.DeepEqual(respBody[i], spansByTrace[i]) {
			t.Errorf("expected span %v but got %v", spansByTrace[i], respBody[i])
		}
	}
}

func TestGetSpansBySegment(t *testing.T) {
	// create a new gin context
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	segmentId := "segment-4"
	c.Params = append(c.Params, gin.Param{Key: "id", Value: segmentId})

	// call the GetSpansBySegment controller function
	controllers.GetSpansBySegment(c)

	// check the response status code
	if w.Code != http.StatusOK {
		t.Errorf("expected status code %d but got %d", http.StatusOK, w.Code)
	}

	// check the response body
	var respBody []model.Span
	err := json.Unmarshal(w.Body.Bytes(), &respBody)
	if err != nil {
		t.Errorf("failed to unmarshal response body: %v", err)
	}
	var spansBySegment []model.Span
	for _, span := range spans {
		if span.SegmentId == segmentId {
			spansBySegment = append(spansBySegment, span)
		}
	}
	if len(respBody) != len(spansBySegment) {
		t.Errorf("expected %d spans in response body but got %d", len(spansBySegment), len(respBody))
	}
	for i := range spansBySegment {
		if !reflect.DeepEqual(respBody[i], spansBySegment[i]) {
			t.Errorf("expected span %v but got %v", spansBySegment[i], respBody[i])
		}
	}
}

func TestGetSpansBySession(t *testing.T) {
	// create a new gin context
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	sessionId := "session-4"
	c.Params = append(c.Params, gin.Param{Key: "id", Value: sessionId})

	// call the GetSpansBySession controller function
	controllers.GetSpansBySession(c)

	// check the response status code
	if w.Code != http.StatusOK {
		t.Errorf("expected status code %d but got %d", http.StatusOK, w.Code)
	}

	// check the response body
	var respBody []model.Span
	err := json.Unmarshal(w.Body.Bytes(), &respBody)
	if err != nil {
		t.Errorf("failed to unmarshal response body: %v", err)
	}
	var spansBySession []model.Span
	for _, span := range spans {
		if span.SessionId == sessionId {
			spansBySession = append(spansBySession, span)
		}
	}
	if len(respBody) != len(spansBySession) {
		t.Errorf("expected %d spans in response body but got %d", len(spansBySession), len(respBody))
	}
	for i := range spansBySession {
		if !reflect.DeepEqual(respBody[i], spansBySession[i]) {
			t.Errorf("expected span %v but got %v", spansBySession[i], respBody[i])
		}
	}
}

func TestCreateSpans(t *testing.T) {
	// Create a new gin context
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	// Mock request body with Zipkin spans
	newSpans := []*model.ZipkinSpan{
		{
			TraceId:   "trace-101",
			SpanId:    "span-101",
			Timestamp: 1729890371868000,
			Duration:  42354,
			Tags: map[string]string{
				"http.url":    "http://localhost:4001/api/call-service-c",
				"segmentId":   "segment-101",
				"sessionId":   "session-xyz",
				"userId":      "user-abc",
				"http.status": "200",
			},
		},
		{
			TraceId:   "trace-102",
			SpanId:    "span-102",
			Timestamp: 1729890372868000,
			Duration:  12345,
			Tags: map[string]string{
				"http.url":    "http://localhost:4001/api/call-service-d",
				"segmentId":   "segment-102",
				"sessionId":   "session-xyz",
				"userId":      "user-def",
				"http.status": "404",
			},
		},
	}
	reqBody, _ := json.Marshal(newSpans)
	c.Request = httptest.NewRequest("POST", "/spans", bytes.NewReader(reqBody))
	c.Request.Header.Set("Content-Type", "application/json")

	// Call the CreateSpans controller function
	controllers.CreateSpans(c)

	// Check the response status code
	if w.Code != http.StatusCreated {
		t.Errorf("expected status code %d but got %d", http.StatusCreated, w.Code)
	}

	// Check the response body
	var respBody map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &respBody)
	if err != nil {
		t.Errorf("failed to unmarshal response body: %v", err)
	}

	if respBody["data"] != "Spans created successfully!" {
		t.Errorf("expected response message 'Spans created successfully!' but got %v", respBody["data"])
	}
}
