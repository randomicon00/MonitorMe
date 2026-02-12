package app

import (
	"encoding/json"
	"log"
	"math/rand"
	"monitorme/database/model"

	"gorm.io/gorm"
)

func PopulateSpans(db *gorm.DB) error {
	for i := 0; i < 50; i++ {
		span := model.Span{
			TraceId:      randomString(10),
			SpanId:       randomString(10),
			SentAt:       rand.Intn(1000),
			Duration:     randomString(5),
			Data:         generateData(),
			TriggerRoute: randomString(10),
			UserId:       randomString(5),
			SessionId:    randomString(5),
			SegmentId:    randomString(5),
			StatusCode:   int16(rand.Intn(1000)),
			RequestData:  randomBytes(),
		}

		if err := db.Create(&span).Error; err != nil {
			return err
		}
	}

	log.Println("Successfully populated the db with 50 span rows!")
	return nil
}

func PopulateEvents(db *gorm.DB) error {
	for i := 0; i < 50; i++ {
		event := model.Event{
			UserId:    randomString(5),
			SessionId: randomString(5),
			SegmentId: randomString(5),
			Data:      generateData(),
		}

		if err := db.Create(&event).Error; err != nil {
			return err
		}
	}

	log.Println("Successfully populated the db with 50 event rows!")

	return nil
}

func PopulateSnapshots(db *gorm.DB) error {
	for i := 0; i < 50; i++ {
		snapshot := model.Snapshot{
			SessionId: randomString(5),
			Data:      generateData(),
		}

		if err := db.Create(&snapshot).Error; err != nil {
			return err
		}
	}

	log.Println("Successfully populated the db with 50 snapshot rows!")

	return nil
}

func randomString(n int) string {
	var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
	s := make([]rune, n)
	for i := range s {
		s[i] = letters[rand.Intn(len(letters))]
	}
	return string(s)
}

func generateData() json.RawMessage {
	data := map[string]interface{}{
		"key":   randomString(5),
		"value": randomString(10),
		"additional": map[string]string{
			"innerKey1": randomString(5),
			"innerKey2": randomString(5),
		},
		"arrayData": []string{randomString(3), randomString(3), randomString(3)},
	}

	// Marshal the map to JSON format
	dataBytes, err := json.Marshal(data)
	if err != nil {
		log.Printf("Error marshaling data: %v", err)
		return nil // or handle the error as needed
	}

	// Return the JSON as json.RawMessage
	return json.RawMessage(dataBytes)
}

func randomBytes() []byte {
	data := make(map[string]string)
	data["key"] = randomString(5)
	data["value"] = randomString(10)
	bytes, _ := json.Marshal(data)
	return bytes
}
