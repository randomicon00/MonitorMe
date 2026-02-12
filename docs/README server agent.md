# MonitorMe Collector

The **MonitorMe Collector Agent** is a Go package designed for auto-instrumenting backend services, collecting custom metadata from frontend events, and tracing data across your application's services. It seamlessly integrates with the **MonitorMe\*\*\*\***\*\***\*\*\*\*** platform, providing rich observability and detailed insights into your application's performance.

## Features

- **Auto-instrumentation** for backend services
- **Custom metadata** collection from frontend events
- **Tracing support** for common databases like PostgreSQL and Redis
- **Centralized** tracing that integrates with the MonitorMe platform for storing, querying, and visualizing traces

## Installation

The **MonitorMe Collector Agent** is available as a Go package. To install, use the following command:

```bash
go get github.com/randomicon00/MonitorMe-Collector-Agent
```

### Configuring Backend Tracing

To enable backend tracing, import the package in your service's main file and load it as middleware for automatic instrumentation:

1. Import the MonitorMe Collector Agent:

```go
import "github.com/randomicon00/MonitorMe-Collector-Agent"
```

2. Load the agent as middleware:
   This middleware should be loaded before your application routes to ensure all requests are traced correctly.

```go
package main

import (
    "github.com/gin-gonic/gin"
    "github.com/randomicon00/MonitorMe-Collector-Agent"
)

func main() {
    r := gin.Default()

    // Load custom baggage for traces
    r.Use(monitorme.CollectBaggage())

    // Define your routes
    r.GET("/", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "message": "Hello MonitorMe!",
        })
    })

    // Start the server
    r.Run(":8080")
}
```

## Configuration

The **MonitorMe Collector Agent** requires a simple configuration to specify the service name, database usage, and endpoint for trace reporting.

1. Edit `config.yml`:
   You can configure your service's tracing behavior by editing the `config.yml` file included with the package.

- `serviceName`: Set this to the name of your service (e.g., `payment-service`).
- `dbOptions`: Enable or disable database auto-instrumentation for PostgreSQL, Redis, or any other databases you use.
- `endpoint`: Define the MonitorMe backend API where traces will be sent.

2. Example config.yml:

```yaml
serviceName: "payment-service"
dbOptions:
  postgresql: true
  redis: true
endpoint: "http://localhost:8080"
```

## Usage

Once configured, the MonitorMe Collector Agent will automatically collect trace data and send it to the specified endpoint. These traces are collected, transformed, and stored in the MonitorMe backend for analysis.

Your backend service will now be fully instrumented and integrated with MonitorMe, enabling you to track service performance, trace errors, and gain insight into user behavior.

### Example Start Command

To start your service with the MonitorMe Collector Agent enabled, update the `start` script in your `package.json` or `Makefile` (depending on your setup).

```json
{
  "start": "go run main.go"
}
```

Run the following command to start your service:

```bash
go run main.go
```

## Kubernetes Deployment

If you are using **Kubernetes** for deployment, include the MonitorMe Collector Agent as part of your service's configuration. The agent will automatically collect and send traces as your services are running in the cluster.

## Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request with your improvements. Visit randomicon00 on GitHub for more details.
