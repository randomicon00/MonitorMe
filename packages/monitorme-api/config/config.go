package config

import (
	"fmt"
	"log"
	"monitorme/middleware"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

type DatabaseConfig struct {
	// Environment
	Host     string
	Port     string
	TimeZone string

	// Db Access
	DbName string
	User   string
	Pass   string

	// Connections
	MaxIdleConns    int
	MaxOpenConns    int
	ConnMaxLifetime time.Duration

	// Logger
	LogLevel int
}

type Configuration struct {
	Database DatabaseConfig
}

var config *Configuration

func Database() (dbConfig DatabaseConfig, err error) {
	// Load env variables
	err = godotenv.Load()
	if err != nil {
		return dbConfig, fmt.Errorf("failed to load environment variables: %w", err)
	}

	// Db Env values
	dbConfig.Host = os.Getenv("DBHOST")
	if dbConfig.Host == "" {
		return dbConfig, fmt.Errorf("missing required environment variable: DBHOST")
	}

	dbConfig.Port = os.Getenv("PORT")
	if dbConfig.Port == "" {
		return dbConfig, fmt.Errorf("missing required environment variable: PORT")
	}

	dbConfig.TimeZone = os.Getenv("TIMEZONE")
	if dbConfig.TimeZone == "" {
		return dbConfig, fmt.Errorf("missing required environment variable: TIMEZONE")
	}

	// Db Access values
	dbConfig.DbName = os.Getenv("DBNAME")
	if dbConfig.DbName == "" {
		return dbConfig, fmt.Errorf("missing required environment variable: DBNAME")
	}

	dbConfig.User = os.Getenv("DBUSER")
	if dbConfig.User == "" {
		return dbConfig, fmt.Errorf("missing required environment variable: DBUSER")
	}

	dbConfig.Pass = os.Getenv("DBPASSWORD")
	if dbConfig.Pass == "" {
		return dbConfig, fmt.Errorf("missing required environment variable: DBPASSWORD")
	}

	// Db Connections
	dbMaxIdleConns := os.Getenv("DBMAXIDLECONNS")
	dbConfig.MaxIdleConns, err = strconv.Atoi(dbMaxIdleConns)
	if err != nil {
		return dbConfig, fmt.Errorf("invalid DBMAXIDLECONNS value: %v", err)
	}

	dbMaxOpenConns := os.Getenv("DBMAXOPENCONNS")
	dbConfig.MaxOpenConns, err = strconv.Atoi(dbMaxOpenConns)
	if err != nil {
		return dbConfig, fmt.Errorf("invalid DBMAXOPENCONNS value: %v", err)
	}

	dbConnMaxLifetime := os.Getenv("DBCONNMAXLIFETIME")
	dbConfig.ConnMaxLifetime, err = time.ParseDuration(dbConnMaxLifetime)
	if err != nil {
		return dbConfig, fmt.Errorf("invalid DBCONNMAXLIFETIME value: %v", err)
	}

	// Logger
	dbLogLevel := os.Getenv("DBLOGLEVEL")
	dbConfig.LogLevel, err = strconv.Atoi(dbLogLevel)
	if err != nil {
		return dbConfig, fmt.Errorf("invalid DBLOGLEVEL value: %v", err)
	}

	return dbConfig, nil
}

func InitJWTConfig() {
	accessTTL, err := strconv.Atoi(os.Getenv("JWT_ACCESS_TTL"))
	if err != nil {
		log.Printf("Invalid or missing JWT_ACCESS_TTL, defaulting to 240 minutes")
		accessTTL = 12 * 43200 // Default to 4 hours
	}

	refreshTTL, err := strconv.Atoi(os.Getenv("JWT_REFRESH_TTL"))
	if err != nil {
		log.Printf("Invalid or missing JWT_REFRESH_TTL, defaulting to 1440 minutes")
		refreshTTL = 12 * 43200 // Default to 1 day
	}

	middleware.JWTConfig = middleware.JWTConfiguration{
		AccessKey:  []byte(os.Getenv("JWT_ACCESS_KEY")),
		AccessTTL:  accessTTL,
		RefreshKey: []byte(os.Getenv("JWT_REFRESH_KEY")),
		RefreshTTL: refreshTTL,
		Audience:   "my-audience",
		Issuer:     "monitorme-service",
		AccNbf:     0, // No delay before access tokens are valid
		RefNbf:     0,
		Subject:    "monitorme",
	}
}

func Config() (err error) {
	var cfg Configuration

	cfg.Database, err = Database()
	if err != nil {
		return fmt.Errorf("failed to load database configuration: %w", err)
	}

	InitJWTConfig()

	config = &cfg

	return nil
}

func GetConfig() *Configuration {
	return config
}
