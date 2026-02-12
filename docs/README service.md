# MonitorMe API Service

**MonitorMe API Service** is a high-performance API that facilitates controlled access to your data through an easy-to-use interface built with **Gin** and G**GORM**. This service forms a key part of the overall **MonitorMe** application, providing backend data collection capabilities for your observability needs.

## Features:

- Built using Gin for efficient HTTP routing
- Database interaction managed with GORM
- Easily scalable and deployable on Kubernetes
- End-to-end Go test integration to ensure reliability

## Installation

### Manual Installation:

1. Clone the repository:

```bash
git clone https://github.com/randomicon00/MonitorMe-API-Service.git
cd MonitorMe-API-Service
```

2. Ensure Go is installed:

Make sure you have Go installed on your machine.

3. Install dependencies and build:

```bash
go mod tidy
go build -o monitorme-api-service
```

4. Configure the application:

Rename `config.yml.example` to `config.yml` and adjust the configuration to your environment (e.g., database settings).

Run the API service:

```bash
./monitorme-api-service
```

### Kubernetes Deployment

The MonitorMe API Service is configured for deployment on Kubernetes. Follow these steps:

1. Modify the `kubernetes/deployment.yaml` file to match your environment.
2. Apply the configuration:

```bash
kubectl apply -f kubernetes/deployment.yaml
```

This will deploy the API service to your Kubernetes cluster.

## Testing

The API Service comes with comprehensive test coverage written in Go. Run the tests to ensure everything is working correctly:

1. Run tests with Go:

```bash
go test ./...
```

The tests cover various API routes, database interactions, and edge cases, ensuring the service remains reliable and performant.

## Contributing

We welcome contributions! Please fork the repo, make your changes, and submit a pull request.

For any issues or questions, feel free to reach out via GitHub at randomicon00.
