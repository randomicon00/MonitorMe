package app

import (
	"log"
	"monitorme/middleware"
	"monitorme/router"
)

// startServer sets up the router and starts the HTTP server for testing controllers
func StartServer(port string) {
	// Set up the router
	r, err := router.SetupRouter(nil)
	if err != nil {
		log.Fatalf("Error setting up router: %s", err)
	}

	// Apply middleware (e.g., CORS, JWT if needed)
	r.Use(middleware.Cors())

	// Start the server for testing
	log.Printf("Server is running at http://localhost%s", port)
	if err := r.Run(port); err != nil {
		log.Fatalf("Error starting server: %s", err)
	}
}

/*
// RunDev sets up a temporary SQLite database and runs the server for development and testing purposes
func RunDev() {
	// Initialize the SQLite development database
	db, dbName, err := initDevDB()
	if err != nil {
		log.Fatalf("Error initializing development database: %s", err)
	}

	defer cleanupDevDB(db, dbName)

	// Populate the development database with dummy data
	populateDevData(db)

	// Set up the temporary database connection for the application
	database.SetDB(db)

	// Set up the router and run the server for testing the controllers
	startServer(":8080")
}

// initDevDB creates a temporary SQLite database for testing purposes
func initDevDB() (*gorm.DB, string, error) {
	dbName, err := createDevDB()
	if err != nil {
		return nil, "", err
	}

	// Open a connection to the SQLite database
	db, err := gorm.Open(sqlite.Open(fmt.Sprintf("file:%s", dbName)), &gorm.Config{})
	if err != nil {
		return nil, "", fmt.Errorf("error connecting to the development database: %s", err)
	}

	// Run database migrations for the development environment
	if err := runMigrations(db); err != nil {
		return nil, "", fmt.Errorf("error running migrations: %s", err)
	}

	return db, dbName, nil
}

// cleanupDevDB closes the database connection and removes the temporary SQLite file
func cleanupDevDB(db *gorm.DB, dbName string) {
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("Error getting the database instance: %s", err)
	}

	sqlDB.Close()

	// Optionally remove the development database file
	os.Remove(dbName)
}

// createDevDB generates a unique SQLite database name and creates the corresponding file
func createDevDB() (string, error) {
	dbPath := os.Getenv("DEVDBPATH")
	if dbPath == "" {
		dbPath = "./" // Fallback to the current directory if DEVDBPATH is not set
	}
	dbName := fmt.Sprintf("dev_db_%s.db", helpers.RandomString(3))
	dbDSN := filepath.Join(dbPath, dbName)

	// Create the SQLite database file
	file, err := os.Create(dbDSN)
	if err != nil {
		return "", fmt.Errorf("failed to create development database file: %s", err)
	}
	file.Close()

	return dbDSN, nil
}

// runMigrations runs the necessary database migrations for the development environment
func runMigrations(db *gorm.DB) error {
	models := []interface{}{
		&model.Span{},
		&model.Event{},
		&model.Snapshot{},
	}

	return db.AutoMigrate(models...)
}

// populateDevData populates the development database with dummy data for testing purposes
func populateDevData(db *gorm.DB) {
	PopulateSpans(db)
	PopulateEvents(db)
	PopulateSnapshots(db)
}
*/
