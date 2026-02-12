# MonitorMe Baggage Middleware

MonitorMe Baggage Middleware is a Node.js package that is part of the **MonitorMe** observability platform, which provides a comprehensive solution for tracing, monitoring, and debugging distributed applications. This middleware specifically focuses on capturing and propagating custom baggage information from frontend events to backend services, ensuring consistent context propagation throughout the request lifecycle.

MonitorMe includes several components:

- **UI Interface**: A user-friendly dashboard for viewing and analyzing traces.
- **API Service**: Backend service for collecting and processing trace data.
- **Client Agent**: Agent that instruments frontend services to capture events.
- **Baggage Middleware**: The server-side middleware (this package) that injects baggage information into the trace context for seamless propagation across services.

## Installation

To use the MonitorMe Baggage Middleware in your Node.js application, install it via npm:

```bash
npm install monitorme-baggage-middleware
```

## Configuration Backend Tracing

To instrument your Node.js backend and enable baggage propagation, import the `applyBaggageMiddleware` package and register it in your
application.

### Example Setup

1. Integrate Tracing and Middleware in Your Main Service Startup File:

At the top of your main service startup file (e.g., `index.js` or `app.js`), import the tracing setup and baggage middleware:

```javascript
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
});

app.listen(port, () => {
  console.log(`Service running on port ${port}`);
});
```

3. Edit `config.json` to include your service-specific tracing settings. For example, specify the `serviceName`, enable database
   instrumentation, and configure the trace collection endpoint.

## Configuration Options

- `serviceName`: The name of the service that MonitorMe will trace. It helps differentiate traces between services in a distributed system.
- `dbOptions`: Enables database instrumentation based on your service needs.
  - `mongodb`: Set to true if your service uses MongoDB to enable instrumentation for MongoDB queries.
  - `redis`: Set to true if your service uses Redis to enable instrumentation for Redis operations.
- `endpoint`: The URL of the backend tracing service where trace data will be sent. MonitorMe provides an API to collect and transform traces.

### Example `config.json` using a domain as an endpoint:

```json
{
  "serviceName": "orders-service",
  "dbOptions": {
    "mongodb": true,
    "redis": false
  },
  "endpoint": "http://mycustomapidomain.com"
}
```

### Example `config.json` using a local Docker endpoint:

```json
{
  "serviceName": "orders-service",
  "dbOptions": {
    "mongodb": true,
    "redis": false
  },
  "endpoint": "http://tracing-service.default.svc.cluster.local"
}
```

In this example, the tracing data is sent to a service running inside the Kubernetes cluster. The endpoint `http://tracing-service.default.svc.cluster.local` uses Kubernetes' internal DNS naming convention:

- `tracing-service` is the name of the service in Kubernetes that is collecting the trace data.
- `default` is the namespace where the service is running (you can replace this with your specific namespace).
- `svc.cluster.local` is the default suffix for services in Kubernetes' internal DNS system.

## Applying Baggage and Attributes

MonitorMe Baggage Middleware extracts key attributes (e.g., `userId`, `sessionId`) from request headers and attaches them to the current span for local tracing. These attributes are also added to the baggage, ensuring global context propagation across downstream services. This maintains consistent and enriched trace data throughout your distributed system.
