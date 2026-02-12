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

// Log Zipkin Trace Data (for tracing)
app.post("/spans", (req, res) => {
  const traceData = req.body;
  console.log(
    "Received trace data in Service C:",
    JSON.stringify(traceData, null, 2),
  );
  res.status(200).send("Trace data received and logged!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Service C running on port ${PORT}`);
});
