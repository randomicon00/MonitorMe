"use strict";

const { propagation } = require("@opentelemetry/api");
const { BatchSpanProcessor } = require("@opentelemetry/tracing");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { GrpcInstrumentation } = require("@opentelemetry/instrumentation-grpc");
const {
  MongoDBInstrumentation,
} = require("@opentelemetry/instrumentation-mongodb");
const {
  RedisInstrumentation,
} = require("@opentelemetry/instrumentation-redis");

// Define the EnhancedSpanProcessor class to enhance traces with baggage attributes
class EnhancedSpanProcessor extends BatchSpanProcessor {
  onStart(span, spanContext) {
    const activeBaggage = propagation.getBaggage(spanContext);

    if (activeBaggage) {
      activeBaggage.getAllEntries().forEach(([key, { value }]) => {
        span.setAttribute(key, value);
      });
    }
  }
}

// Function to create and register instrumentations based on config options
function createAndRegisterInstrumentations(dbOptions) {
  const instrumentations = [
    new HttpInstrumentation(), // HTTP instrumentation for tracing HTTP requests
    new GrpcInstrumentation(), // gRPC instrumentation for tracing gRPC calls
  ];

  // Conditionally add MongoDB and Redis instrumentation based on configuration
  if (dbOptions.mongodb) {
    instrumentations.push(new MongoDBInstrumentation());
  }
  if (dbOptions.redis) {
    instrumentations.push(new RedisInstrumentation());
  }

  return instrumentations;
}

// Export the class and the function
module.exports = {
  EnhancedSpanProcessor,
  createAndRegisterInstrumentations,
};
