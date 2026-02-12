const express = require("express");
const cors = require("cors");
const applyBaggageMiddleware = require("./middleware.js"); // Middleware for tracing

// Setup express app
const app = express();
const PORT = 5001;

// Apply middleware
app.use(cors());
app.use(express.json());
app.use(applyBaggageMiddleware); // Apply the baggage middleware

// Simple API Endpoint for Service C
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello, this is Service C!" });
});

// Catch-all 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Service C running on port ${PORT}`);
});
