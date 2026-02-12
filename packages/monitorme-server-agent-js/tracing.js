"use strict";

const { NodeTracerProvider } = require("@opentelemetry/node");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");
const { Resource } = require("@opentelemetry/resources");
const { ResourceAttributes } = require("@opentelemetry/semantic-conventions");
const config = require("./config.json");

// Import the utilities from utils.js
const {
  EnhancedSpanProcessor,
  createAndRegisterInstrumentations,
} = require("./utils");

// Create a ZipkinExporter to send trace data to Zipkin
const traceExporter = new ZipkinExporter({
  url: `${config.endpoint}/spans`, // Define the endpoint where traces will be sent
  headers: {
    Authorization: `Bearer ${config.authTokeh}`,
  },
});

// Set up the tracer provider with resources, such as service name
const tracerProvider = new NodeTracerProvider({
  resource: new Resource({
    [ResourceAttributes.SERVICE_NAME]: config.serviceName, // Set service name from configuration
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

// Register the instrumentations from the utils function
registerInstrumentations({
  instrumentations: createAndRegisterInstrumentations(config.dbOptions),
});
