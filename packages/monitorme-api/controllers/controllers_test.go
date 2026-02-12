package controllers_test

import (
	"log"
	"monitorme/database/model"
	"os"
	"testing"

	"github.com/matthewhartstonge/argon2"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var testDB *gorm.DB
var spans []model.Span
var events []model.Event
var snapshots []model.Snapshot
var user model.User

func InitTestDB() *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to initialize test database: %v", err)
	}
	return db
}

func SetupDB() {
	testDB = InitTestDB()
	models := []interface{}{
		&model.User{},
		&model.Span{},
		&model.Event{},
		&model.Snapshot{},
	}
	if err := testDB.AutoMigrate(models...); err != nil {
		log.Fatal("failed to migrate database models")
	}

	user = model.User{
		Email: "test@example.com",
	}
	passwordStr := "password123"
	spans = []model.Span{
		{
			TraceId:      "trace-123",
			SpanId:       "span-1",
			SentAt:       1620237600,
			Duration:     "1s",
			Data:         []byte("random data 1"),
			TriggerRoute: "/home",
			UserId:       "user-1",
			SessionId:    "session-1",
			SegmentId:    "segment-4",
			StatusCode:   200,
			RequestData:  []byte("request data 1"),
		},
		{
			TraceId:      "trace-456",
			SpanId:       "span-2",
			SentAt:       1620237660,
			Duration:     "2s",
			Data:         []byte("random data 2"),
			TriggerRoute: "/services",
			UserId:       "user-2",
			SessionId:    "session-2",
			SegmentId:    "segment-4",
			StatusCode:   404,
			RequestData:  []byte("request data 2"),
		},
		{
			TraceId:      "trace-789",
			SpanId:       "span-3",
			SentAt:       1620237720,
			Duration:     "3s",
			Data:         []byte("random data 3"),
			TriggerRoute: "/contact",
			UserId:       "user-3",
			SessionId:    "session-3",
			SegmentId:    "segment-3",
			StatusCode:   200,
			RequestData:  []byte("request data 3"),
		},
		{
			TraceId:      "trace-246",
			SpanId:       "span-4",
			SentAt:       1620237780,
			Duration:     "4s",
			Data:         []byte("random data 4"),
			TriggerRoute: "/products",
			UserId:       "user-4",
			SessionId:    "session-4",
			SegmentId:    "segment-4",
			StatusCode:   500,
			RequestData:  []byte("request data 4"),
		},
		{
			TraceId:      "trace-456",
			SpanId:       "span-5",
			SentAt:       1620237840,
			Duration:     "5s",
			Data:         []byte("random data 5"),
			TriggerRoute: "/services",
			UserId:       "user-5",
			SessionId:    "session-5",
			SegmentId:    "segment-5",
			StatusCode:   200,
			RequestData:  []byte("request data 5"),
		},
	}
	events = []model.Event{
		{UserId: "user1", SessionId: "session1", SegmentId: "segment1", Data: []byte("random data 1")},
		{UserId: "user2", SessionId: "session2", SegmentId: "segment2", Data: []byte("random data 2")},
		{UserId: "user3", SessionId: "session1", SegmentId: "segment3", Data: []byte("random data 3")},
		{UserId: "user4", SessionId: "session4", SegmentId: "segment4", Data: []byte("random data 4")},
		{UserId: "user5", SessionId: "session1", SegmentId: "segment3", Data: []byte("random data 5")},
	}

	snapshots := []model.Snapshot{
		{SessionId: "session1", Data: []byte("foo")},
		{SessionId: "session2", Data: []byte("bar")},
		{SessionId: "session3", Data: []byte("baz")},
		{SessionId: "session1", Data: []byte("qux")},
		{SessionId: "session4", Data: []byte("quux")},
	}

	cfg := argon2.DefaultConfig()

	raw, err := cfg.Hash([]byte(passwordStr), nil)
	if err != nil {
		log.Fatalf("error during hashing: %s\n", err.Error())
	}

	user.Password = raw.Encode()
	// Save the user to the database
	if err := testDB.Create(&user).Error; err != nil {
		log.Fatal("failed to create a valid user")
	}

	if err := testDB.Create(&spans).Error; err != nil {
		log.Fatal("failed to create test spans")
	}

	if err := testDB.Create(&events).Error; err != nil {
		log.Fatal("failed to create test events")
	}

	if err := testDB.Create(&snapshots).Error; err != nil {
		log.Fatal("failed to create test snapshots")
	}
}

func CleanupDB() {
	if err := testDB.Migrator().DropTable(&model.Span{}); err != nil {
		log.Fatalf("failed to drop Span{} table: %v", err)
	}
	if err := testDB.Migrator().DropTable(&model.Event{}); err != nil {
		log.Fatalf("failed to drop Event{} table: %v", err)
	}
	if err := testDB.Migrator().DropTable(&model.Snapshot{}); err != nil {
		log.Fatalf("failed to drop Snapshot{} table: %v", err)
	}

	sqlDB, err := testDB.DB()
	if err != nil {
		log.Fatalf("failed to get DB: %v", err)
	}
	if err := sqlDB.Close(); err != nil {
		log.Fatalf("failed to close DB connection: %v", err)
	}
}

func TestMain(m *testing.M) {
	SetupDB()

	code := m.Run()

	CleanupDB()
	os.Exit(code)
}
