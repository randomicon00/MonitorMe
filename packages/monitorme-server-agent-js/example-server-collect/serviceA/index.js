const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const fetch = require("node-fetch"); // Use node-fetch for fetch in Node.js
const applyBaggageMiddleware = require("./middleware.js"); // Middleware for tracing

// Setup express app
const app = express();
const PORT = 3003;

// Apply middleware
app.use(cors());
app.use(express.json());
app.use(applyBaggageMiddleware); // Apply the baggage middleware

// MongoDB setup
const mongoUrl = "mongodb://localhost:27017";
const dbName = "sampleDB";
let db;

MongoClient.connect(mongoUrl)
  .then((client) => {
    console.log("Connected to MongoDB");
    db = client.db(dbName);
  })
  .catch((err) => console.error(err));

// Sample API Endpoints

// 1. Fetch all items (GET request)
app.get("/api/items", async (req, res) => {
  try {
    const items = await db.collection("items").find({}).toArray();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

// 2. Create a new item (POST request)
app.post("/api/items", async (req, res) => {
  try {
    const newItem = req.body;
    const result = await db.collection("items").insertOne(newItem);

    const insertedItem = await db
      .collection("items")
      .findOne({ _id: result.insertedId });
    res.status(201).json(insertedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create item" });
  }
});

// 3. Call Service B (GET request) using fetch
app.get("/api/call-service-b", async (req, res) => {
  try {
    // Calling Service B using fetch
    console.log("Calling Service B using fetch...");
    const response = await fetch("http://localhost:4001/api/call-service-c", {
      headers: req.headers, // Pass trace context
    });
    const data = await response.json();
    res.json({ message: "Response from Service B", data });
  } catch (error) {
    res.status(500).json({ error: "Failed to call Service B" });
  }
});

// 3. Call Service B simple
app.get("/api/hello", async (req, res) => {
  try {
    // Add delay for testing purposes
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log("Calling Service B using fetch...");
    const response = await fetch("http://localhost:4001/api/hello");
    const data = await response.json();
    res.json({ message: "Response from Service B: ", data });
  } catch (error) {
    res.status(500).json({ error: "Failed to call Service B" });
  }
});

// 404 error route
app.get("/api/not-found", (req, res) => {
  res.status(404).json({ error: "This is a 404 error" });
});

// 500 error route
app.get("/api/internal-error", (req, res) => {
  res.status(500).json({ error: "This is a 500 internal server error" });
});

// Catch-all 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Service A running on port ${PORT}`);
});
