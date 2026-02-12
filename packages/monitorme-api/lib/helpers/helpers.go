package helpers

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/smtp"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"monitorme/database/model"
)

func ProcessSpans(zkSpans []*model.ZipkinSpan) ([]*model.Span, error) {
	spans := make([]*model.Span, 0, len(zkSpans)) // preallocate slice capacity

	for _, zkSpan := range zkSpans {
		if zkSpan == nil || zkSpan.Tags["http.method"] == "OPTIONS" {
			continue
		}

		// Debug: Display the zkSpan
		zkSpanJSON, err := json.MarshalIndent(zkSpan, "", "  ")
		if err != nil {
			log.Printf("Error marshaling zkSpan %s: %v", zkSpan.SpanId, err)
			continue
		} else {
			log.Printf("zkSpan: %s\n", string(zkSpanJSON))
		}

		// Determine if it's a DB span
		isDB := zkSpan.Tags["db.system"] != ""

		// For DB spans, ensure required fields exist
		if isDB {
			if zkSpan.Tags["db.operation"] == "" || zkSpan.Tags["db.name"] == "" {
				continue
			}
		}

		var statusCode int16
		if !isDB {
			// Parse status code only for non-DB spans
			statusCode, err = parseInt16(zkSpan.Tags["http.status_code"])
			if err != nil {
				log.Printf("Invalid status code in span %s: %v", zkSpan.SpanId, err)
				continue
			}
		}

		requestData := []byte(zkSpan.Tags["requestData"])

		// Create span from Zipkin span
		span := createSpanFromZkSpan(zkSpan, isDB, requestData, statusCode)

		// Append the span to the list
		spans = append(spans, span)
	}

	return spans, nil
}

// createSpanFromZkSpan constructs a Span object from a Zipkin span.
// If isDB is true, additional data is added to the span.
func createSpanFromZkSpan(zkSpan *model.ZipkinSpan, isDB bool, requestData []byte, statusCode int16) *model.Span {
	// Convert duration to a string format e.g. `343 us`
	duration := durationToStr(zkSpan.Duration, "us")

	// Remove "requestData" from the tags map, then marshal the tags into JSON
	delete(zkSpan.Tags, "requestData")

	// TODO Remove this piece of code
	dataBytes, err := json.Marshal(zkSpan.Tags)
	if err != nil {
		log.Printf("Failed to marshal tags for span %s: %v", zkSpan.SpanId, err)
		dataBytes = nil
	}

	// Construct the span, populating fields based on whether it's a DB span
	span := &model.Span{
		TraceId:     zkSpan.TraceId,
		SpanId:      zkSpan.SpanId,
		SentAt:      zkSpan.Timestamp,
		Duration:    duration,
		RequestData: requestData,
		StatusCode:  statusCode,
		Data:        json.RawMessage(dataBytes),
	}

	// For non-DB spans, populate additional fields based on the tags
	if !isDB {
		span.SessionId = zkSpan.Tags["sessionId"]
		span.UserId = zkSpan.Tags["userId"]
		span.SegmentId = zkSpan.Tags["segmentId"]
		span.TriggerRoute = zkSpan.Tags["triggerRoute"]
	}

	return span
}

func parseInt16(value string) (int16, error) {
	log.Println("The value in parseInt16 is: ", value)
	parsed, err := strconv.ParseInt(value, 10, 16)
	return int16(parsed), err
}

func durationToStr(duration int, unit string) string {
	return fmt.Sprintf("%d %s", duration, unit)
}

func StrToDuration(str string) int {
	trimmedStr := strings.TrimSpace(strings.ToLower(str))
	if strings.HasSuffix(trimmedStr, "us") {
		trimmedStr = strings.TrimSuffix(trimmedStr, "us")
		duration, err := strconv.Atoi(trimmedStr)
		if err != nil {
			panic(err)
		}
		return duration
	}
	duration, err := time.ParseDuration(trimmedStr)
	if err != nil {
		panic(err)
	}
	return int(duration.Nanoseconds() / 1000)
}

func RandomString(length int) string {
	// Generate a random string of the specified length
	bytes := make([]byte, length)

	if _, err := rand.Read(bytes); err != nil {
		panic(err)
	}

	return base64.URLEncoding.EncodeToString(bytes)[:length]
}

func DeleteOldFiles(folderPath string, maxTimeLapse time.Duration) error {
	// Get list of files in folder
	files, err := os.ReadDir(folderPath)
	if err != nil {
		return fmt.Errorf("unable to read directory: %v", err)
	}

	// Find most recent file
	var mostRecentFile os.FileInfo
	for _, file := range files {
		info, err := file.Info()
		if err != nil {
			return fmt.Errorf("unable to get file info: %v", err)
		}

		if mostRecentFile == nil || info.ModTime().After(mostRecentFile.ModTime()) {
			mostRecentFile = info
		}
	}

	if mostRecentFile == nil {
		return fmt.Errorf("no files found in directory")
	}

	// Calculate time since most recent file was modified
	timeLapse := time.Since(mostRecentFile.ModTime())

	// Delete old files if time lapse is over maxTimeLapse
	if timeLapse > maxTimeLapse {
		for _, file := range files {
			err := os.Remove(filepath.Join(folderPath, file.Name()))
			if err != nil {
				return fmt.Errorf("unable to delete file: %v", err)
			}
		}
	}

	return nil
}

var SendEmail = func(to, subject, body string) error {
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")
	from := os.Getenv("SMTP_FROM")
	password := os.Getenv("SMTP_PASSWORD")

	msg := fmt.Sprintf("Subject: %s\n\n%s", subject, body)
	auth := smtp.PlainAuth("", from, password, smtpHost)

	return smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, []byte(msg))
}
