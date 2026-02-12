package model

import (
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

type Snapshot struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt" gorm:"index"`

	SessionId string          `json:"session_id"`
	Data      json.RawMessage `json:"data" gorm:"type:jsonb"`
}
