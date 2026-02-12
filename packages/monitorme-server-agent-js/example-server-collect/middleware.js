const { trace, context, propagation } = require("@opentelemetry/api");

// Function to extract attributes from request headers
function extractAttributes(headers) {
  return {
    segmentId: headers["x-segment-id"] || "",
    sessionId: headers["x-session-id"] || "",
    userId: headers["x-user-id"] || "",
    triggerRoute: headers["x-trigger-route"] || "",
    requestData: headers["x-request-data"] || "",
  };
}

// Function to set extracted attributes on the current span
function setSpanAttributes(span, attributes) {
  Object.keys(attributes).forEach((key) => {
    if (attributes[key]) {
      span.setAttribute(key, attributes[key]); // Only set non-empty attributes
    }
  });
}

// Function to update the current baggage with new attributes
function updateBaggage(currentBaggage, attributes) {
  let updatedBaggage = {};

  // Iterate over the extracted attributes and add them to the new baggage
  Object.keys(attributes).forEach((key) => {
    if (attributes[key]) {
      // Only add if the value is not empty
      updatedBaggage[key] = { value: attributes[key] };
    }
  });

  return propagation.createBaggage({
    ...currentBaggage.getAllEntries(), // Merge with current baggage
    ...updatedBaggage, // Add new attributes to the baggage
  });
}

// Middleware to apply baggage and set attributes on the span
function applyBaggageMiddleware(req, res, next) {
  const attributes = extractAttributes(req.headers); // Extract attributes from request headers

  const activeContext = context.active(); // Get the current active context (associated with the request)
  const currentSpan = trace.getSpan(activeContext); // Get the current active span for tracing

  if (currentSpan) {
    // Set the extracted attributes on the current span for local trace visibility
    setSpanAttributes(currentSpan, attributes);
  }

  // Get the current baggage (if any) or create a new baggage if none exists
  const currentBaggage =
    propagation.getBaggage(activeContext) || propagation.createBaggage();

  // Update the current baggage by adding the new attributes to it
  const updatedBaggage = updateBaggage(currentBaggage, attributes);

  // Propagate the updated baggage in the active context, allowing it to be passed
  // to the next service (Service C, etc.)
  context.with(propagation.setBaggage(activeContext, updatedBaggage), next);
}

module.exports = applyBaggageMiddleware;
