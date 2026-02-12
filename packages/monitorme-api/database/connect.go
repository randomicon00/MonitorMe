package database

import (
	"database/sql"
	"fmt"
	"os"

	"monitorme/config"
	"monitorme/database/migration"

	// go orm
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	// postgresql
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"

	// Logger
	log "github.com/sirupsen/logrus"
)

var dbClient *gorm.DB

func InitDB() *gorm.DB {
	var db = dbClient

	configureDB := config.GetConfig().Database

	username := configureDB.User
	password := configureDB.Pass
	database := configureDB.DbName
	host := configureDB.Host
	port := configureDB.Port
	timeZone := configureDB.TimeZone
	maxIdleConns := configureDB.MaxIdleConns
	maxOpenConns := configureDB.MaxOpenConns
	connMaxLifetime := configureDB.ConnMaxLifetime
	logLevel := configureDB.LogLevel

	dsn := fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s TimeZone=%s sslmode=disable",
		host, port, username, database, password, timeZone)

	sqlDB, err := sql.Open("postgres", dsn)
	if err != nil {
		log.WithError(err).Panic("panic code: 153")
	}
	sqlDB.SetMaxIdleConns(maxIdleConns)
	sqlDB.SetMaxOpenConns(maxOpenConns)
	sqlDB.SetConnMaxLifetime(connMaxLifetime)

	db, err = gorm.Open(postgres.New(postgres.Config{
		Conn: sqlDB,
	}), &gorm.Config{
		Logger: logger.Default.LogMode(logger.LogLevel(logLevel)),
	})
	if err != nil {
		log.WithError(err).Panic("panic code: 154")
	}

	fmt.Println("DB connection successful!")
	dbClient = db

	// Ensure dbClient is not nil
	if dbClient == nil {
		log.Fatal("Production DB connection is not initialized!")
	}

	// Check if CLEANUP_ALL_DBS environment variable is set
	log.Println("About to check if cleanup dbs is set!")
	if cleanup := os.Getenv("CLEANUP_ALL_DBS"); cleanup == "true" {
		log.Println("CLEANUP_ALL_DBS is set. Cleaning up all databases...")
		if err := migration.DropAllTables(db); err != nil {
			log.WithError(err).Panic("Failed to drop tables")
		}
	}

	// Perform migration
	if err := migration.PerformMigration(db, config.GetConfig()); err != nil {
		log.WithError(err).Panic("Failed to perform migration")
	}

	// Temporary
	SeedDummyUser(dbClient)

	log.Println("Returning Production DB Client: ", dbClient)
	return dbClient
}

func GetDB() *gorm.DB {
	// Do not return a nil db client ref
	if dbClient == nil {
		log.Fatal("Cannot return a nil DB client. Check DB connection.")
	}

	return dbClient
}

func SetDB(db *gorm.DB) {
	if db == nil {
		log.Fatal("Cannot set a db client that is null!")
	}

	dbClient = db
}

// InitTestDB initializes a test in-memory SQLite database.
func InitTestDB() *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to initialize test database: %v", err)
	}
	return db
}
