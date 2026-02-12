// tracing.js should include your tracing setup
require("./tracing");

const cors = require("cors");
const express = require("express");
const applyBaggageMiddleware = require("monitorme-baggage-middleware");

const app = express();

// Apply CORS middleware
app.use(cors());

// Apply baggage middleware for tracing
app.use(applyBaggageMiddleware);

const port = 3000;

app.get("/", function (req, res, next) {
  // Your application logic here
  console.log("Your application logic goes here");
});

app.listen(port, () => {
  console.log(`Service running on port ${port}`);
});
