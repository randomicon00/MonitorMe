package main

import (
	"fmt"
	"net/http"
)

func main() {
	// Load the configuration for tracing
	cfg, err := agent.LoadConfig("./config.json")
	if err != nil {
		fmt.Printf("Error loading config: %v\n", err)
		return
	}

	// Initialize tracing before the application starts
	err = agent.SetupTracing(cfg)
	if err != nil {
		fmt.Printf("Error setting up tracing: %v\n", err)
		return
	}

	// Application starts after tracing has been set up
	mux := http.NewServeMux()
	mux.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello, World!"))
	}))

	// Adding custom baggage middleware
	muxWithMiddleware := agent.CustomBaggage(mux)

	// Start the HTTP server
	http.ListenAndServe(":3000", muxWithMiddleware)
}
