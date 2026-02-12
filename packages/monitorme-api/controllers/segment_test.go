package controllers_test

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"monitorme/controllers"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestGetSegmentIDsByTriggerRoute(t *testing.T) {
	// create a new gin context
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	// create a trigger route object
	triggerRoute := controllers.APITriggerRoute{Value: "/services"}

	// marshal trigger route object to json and add it to request body
	triggerRouteJson, _ := json.Marshal(triggerRoute)
	/*
			func NopCloser(r Reader) ReadCloser

		    type ReadCloser interface {
		    	Reader
				Closer
			}
	*/
	c.Request = &http.Request{
		Body: ioutil.NopCloser(bytes.NewReader(triggerRouteJson)),
	}

	// call the GetSegmentIDsByTriggerRoute controller function
	controllers.GetSegmentIDsByTriggerRoute(c)

	// check the response status code
	if w.Code != http.StatusOK {
		t.Errorf("expected status code %d but got %d", http.StatusOK, w.Code)
	}

	// check the response body
	var respBody []int
	err := json.Unmarshal(w.Body.Bytes(), &respBody)
	if err != nil {
		t.Errorf("failed to unmarshal response body: %v", err)
	}

	// check if the expected segment IDs are returned
	expectedSegmentIds := []string{"segment-4", "segment-5"}
	if !reflect.DeepEqual(respBody, expectedSegmentIds) {
		t.Errorf("expected segment IDs %v but got %v", expectedSegmentIds, respBody)
	}
}
