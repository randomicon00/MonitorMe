package migration

import (
	"fmt"

	"monitorme/config"
	"monitorme/database/model"

	"gorm.io/gorm"
)

type Spans model.Span
type Events model.Event
type Users model.User
type Snapshots model.Snapshot

func DropAllTables(db *gorm.DB) error {

	if err := db.Migrator().DropTable(
		&Users{},
		&Spans{},
		&Events{},
		&Snapshots{},
	); err != nil {
		return err
	}

	fmt.Println("tables are deleted!")
	return nil
}

func PerformMigration(db *gorm.DB, configuration *config.Configuration) error {
	// List of models to migrate
	models := []interface{}{
		&Users{},
		&Spans{},
		&Events{},
		&Snapshots{},
	}

	for _, model := range models {
		// Check if the table already exists
		if db.Migrator().HasTable(model) {
			fmt.Printf("Table for model %T already exists, skipping migration for this table.\n", model)
		} else {
			// Migrate only if the table does not exist
			if err := db.AutoMigrate(model); err != nil {
				return fmt.Errorf("failed to migrate table for model %T: %w", model, err)
			}
		}
	}

	fmt.Println("Tables are migrated successfully")
	return nil
}
