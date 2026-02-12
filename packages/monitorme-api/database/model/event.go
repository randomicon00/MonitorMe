package model

import (
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

type Event struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt" gorm:"index"`

	UserId    string `json:"userId"`
	SessionId string `json:"sessionId"`
	SegmentId string `json:"segmentId"`

	// Body (data)
	Data json.RawMessage `json:"data" gorm:"type:jsonb"`
	//Data []byte `json:"data"`
}
