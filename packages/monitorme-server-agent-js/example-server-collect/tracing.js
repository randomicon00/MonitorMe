"use strict";

const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");
const { Resource } = require("@opentelemetry/resources");
const { ATTR_SERVICE_NAME } = require("@opentelemetry/semantic-conventions");
const { propagation } = require("@opentelemetry/api");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { GrpcInstrumentation } = require("@opentelemetry/instrumentation-grpc");
const {
  MongoDBInstrumentation,
} = require("@opentelemetry/instrumentation-mongodb");
const {
  RedisInstrumentation,
} = require("@opentelemetry/instrumentation-redis");

const config = require("./config.json");

console.log(`${JSON.stringify(config)}`);

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

// Create a ZipkinExporter to send trace data to Zipkin
const traceExporter = new ZipkinExporter({
  url: `${config.endpoint}/spans`, // Define the endpoint where traces will be sent
});

// Set up the tracer provider with resources, such as service name
const tracerProvider = new NodeTracerProvider({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: config.serviceName, // Set service name from configuration
  }),
});

// Add the custom EnhancedSpanProcessor to handle spans before exporting them
tracerProvider.addSpanProcessor(
  new EnhancedSpanProcessor(traceExporter, {
    maxQueueSize: 10000, // Maximum number of spans that can be queued
    maxExportBatchSize: 5120, // Maximum number of spans that can be exported in one batch
    scheduledDelayMillis: 5000, // Time interval between export attempts
    exportTimeoutMillis: 30000, // Maximum time allowed for exporting a batch of spans
  }),
);

// Register the provider to make it active for instrumentation
tracerProvider.register();

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

// Register the instrumentations from the utils function
registerInstrumentations({
  instrumentations: createAndRegisterInstrumentations(config.dbOptions),
});

console.log("Tracing initialized!");
