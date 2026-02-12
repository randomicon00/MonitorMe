package model

import (
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

type ZipkinSpan struct {
	TraceId   string            `json:"traceId"`
	SpanId    string            `json:"id"`
	Timestamp int               `json:"timestamp"`
	Duration  int               `json:"duration"`
	Tags      map[string]string `json:"tags"`
}

type Span struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt" gorm:"index"`

	TraceId  string `json:"traceId"`
	SpanId   string `json:"spanId"`
	SentAt   int    `json:"sentAt"`
	Duration string `json:"duration"`
	// Data     []byte `json:"data"`
	Data json.RawMessage `json:"data" gorm:"type:jsonb"`

	// Extracted Data
	TriggerRoute string `json:"triggerRoute"`
	UserId       string `json:"userId"`
	SessionId    string `json:"sessionId"`
	SegmentId    string `json:"segmentId"`
	StatusCode   int16  `json:"statusCode"`
	RequestData  []byte `json:"requestData"`
}
