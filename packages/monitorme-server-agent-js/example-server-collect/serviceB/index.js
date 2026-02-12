const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const applyBaggageMiddleware = require("./middleware.js"); // Middleware for tracing

// Setup express app
const app = express();
const PORT = 4001;

// Apply middleware
app.use(cors());
app.use(express.json());
app.use(applyBaggageMiddleware); // Apply the baggage middleware

// API Endpoint to call Service C
app.get("/api/call-service-c", async (req, res) => {
  try {
    // Calling Service C using fetch
    console.log("Calling service C using fetch...");
    // Adding a slight delay before calling Service C
    await new Promise((resolve) => setTimeout(resolve, 10));
    const response = await fetch("http://localhost:5001/api/hello", {
      headers: req.headers, // Pass trace context and baggage to Service C
    });
    const data = await response.json();
    res.status(200).json({ message: "Response from Service C", data });
  } catch (error) {
    console.error("Failed to call Service C:", error);
    res.status(500).json({ error: "Failed to call Service C" });
  }
});

// Simple API Endpoint for Service B
app.get("/api/hello", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  res.status(200).json({ message: "Hello, this is Service B!" });
});

// Catch-all 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Service B running on port ${PORT}`);
});
