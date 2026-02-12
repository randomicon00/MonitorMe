![MonitorMe logo](https://github.com/user-attachments/assets/b23517a8-8783-4788-8121-9f8210469784)

# MonitorMe

**MonitorMe** is an open-source, full-stack observability tool for distributed applications. It allows you to gather, correlate, and filter events and traces from both front-end and back-end systems, providing comprehensive visibility into your microservices architecture.

## What is MonitorMe?

MonitorMe combines distributed tracing with session replay to give you complete visibility into your applications:

- **Full-Stack Observability**: Monitor both front-end user interactions and back-end service calls in one unified platform
- **Distributed Tracing**: Track requests as they flow through your microservices using OpenTelemetry
- **Session Replay**: Record and replay user sessions to understand exactly what happened before an error occurred
- **Easy to Deploy**: Simple integration with existing applications with minimal code changes
- **Open Source**: Own your data and customize the solution to fit your needs

## Key Features

### Distributed Tracing
- Built on OpenTelemetry for backend tracing
- Automatic instrumentation for Node.js applications
- Context propagation across services
- Custom span processors for enhanced metadata

### Session Recording
- Browser event capture using rrweb
- DOM snapshots for session replay
- Selective event recording to minimize overhead
- Automatic correlation with backend traces

### Unified Dashboard
- Next.js-based user interface
- Search and filter spans by user, session, or segment
- Visual trace representation
- Integrated session replay viewer
- Real-time data updates

## Use Cases

### Detecting Service Delays
Quickly identify which service is causing slowdowns in your request chain. MonitorMe shows you the duration of each span, making it easy to spot bottlenecks.

### Debugging Service Outages
When a service goes down, MonitorMe helps you identify which service failed and what the error was, reducing mean time to resolution (MTTR).

### Understanding User Experience
Combine backend traces with frontend session recordings to see exactly what the user experienced when an error occurred.

## Architecture

MonitorMe consists of four main components:

1. **Client Agent** (`packages/monitorme-client-agent/`) - Browser-based rrweb collector for capturing user interactions
2. **Server Agents** (`packages/monitorme-server-agent-js/`, `packages/monitorme-server-agent-go/`, `packages/monitorme-server-agent-py/`) - OpenTelemetry instrumentation for backend services
3. **API Service** (`packages/monitorme-api/`) - Go-based API server for data ingestion and querying
4. **Dashboard** (`packages/monitorme-dashboard/`) - Next.js frontend for visualization and analysis

### Project Structure

```
monitorme/
├── packages/
│   ├── monitorme-client-agent/      # Frontend session recording agent (rrweb)
│   ├── monitorme-server-agent-js/   # Backend tracing middleware for Node.js
│   ├── monitorme-server-agent-go/   # Backend tracing middleware for Go
│   ├── monitorme-server-agent-py/   # Backend tracing middleware for Python
│   ├── monitorme-api/               # Go API service for data ingestion
│   └── monitorme-dashboard/         # Next.js dashboard UI
├── deploy/
│   └── kubernetes/                  # Kubernetes deployment configurations
├── docs/                            # Documentation
├── README.md                        # This file
└── .gitignore                       # Git ignore rules
```

## Installation

### Prerequisites
- Node.js 14+ (for JavaScript services)
- Go 1.19+ (for Go services)
- Python 3.10+ (for Python services)
- PostgreSQL 12+ (for data storage)
- Kubernetes (optional, for deployment)

### Installing Server Observability Components

1. **Install the Server Agent:**
```bash
npm install monitorme-server-agent
```

2. **Update Configuration:**
Create or modify `config.json` in your service:
```json
{
  "serviceName": "your-service-name",
  "endpoint": "http://monitorme-api:8888",
  "dbOptions": {
    "mongodb": true,
    "postgres": false
  }
}
```

3. **Import Custom Middleware:**
```javascript
const { applyBaggageMiddleware } = require('monitorme-server-agent');
app.use(applyBaggageMiddleware);
```

4. **Update Start Script:**
```json
{
  "scripts": {
    "start": "node -r monitorme-server-agent/tracing.js index.js"
  }
}
```

### Installing Python Server Observability Components

1. **Install the Python Server Agent (local package):**
```bash
cd packages/monitorme-server-agent-py
python -m pip install -e .
```

2. **Create Configuration:**
```bash
cp config.example.json config.json
```

3. **Initialize in FastAPI:**
```python
from fastapi import FastAPI
from monitorme_server_agent_py import load_config, setup_fastapi

app = FastAPI()
setup_fastapi(app, load_config("config.json"))
```

### Setting Up Client Observability Features

1. **Install the Client Agent:**
```bash
npm install monitorme-client-agent
```

2. **Update Configuration:**
Modify `config.json` in the client agent package:
```json
{
  "eventEndpoint": "http://monitorme-api:8888/events",
  "snapshotEndpoint": "http://monitorme-api:8888/snapshots",
  "samplingConfig": {
    "mouseMove": false,
    "mouseInteractions": {
      "click": true,
      "doubleClick": true,
      "focus": true,
      "blur": true
    },
    "inputStrategy": "last"
  },
  "snapshotInterval": 10,
  "authToken": "your-auth-token"
}
```

3. **Initialize in Your Application:**
```javascript
import sessionEventTracker from 'monitorme-client-agent';

// Initialize the tracker
sessionEventTracker.initialize();
```

### Deploying the MonitorMe Dashboard

#### Kubernetes Deployment

1. **Clone the repository:**
```bash
git clone https://github.com/randomicon00/MonitorMe.git monitorme
cd monitorme
```

2. **Apply Kubernetes configurations:**
```bash
cd deploy/kubernetes
kubectl apply -f postgres-deployment.yaml
kubectl apply -f postgres-service.yaml
kubectl apply -f golang-deployment.yaml
kubectl apply -f golang-service.yaml
kubectl apply -f nextjs-deployment.yaml
kubectl apply -f nextjs-service.yaml
kubectl apply -f ingress.yaml
```

3. **Verify deployments:**
```bash
kubectl get pods
kubectl get services
```

#### Manual Deployment

1. **Set up PostgreSQL:**
```bash
# Create database
createdb monitorme

# Run migrations (if provided)
psql monitorme < database/schema.sql
```

2. **Start the API Server:**
```bash
cd packages/monitorme-api
cp .env.example .env
# Edit .env with your database credentials
go build -o monitorme-api
./monitorme-api
```

3. **Start the Dashboard:**
```bash
cd packages/monitorme-dashboard
npm install
npm run build
npm start
```

## Configuration

### Environment Variables

#### API Service (`packages/monitorme-api/.env`)
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=monitorme
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
SERVER_PORT=8888
JWT_SECRET=your_jwt_secret
```

#### Dashboard (`packages/monitorme-dashboard/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8888
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## Documentation

For detailed documentation, please refer to the following:

- [Client Agent Documentation](docs/README%20client%20agent.md)
- [Server Agent Documentation](docs/README%20server%20agent.md)
- [API Service Documentation](docs/README%20service.md)
- [User Interface Documentation](docs/README%20user%20interface.md)

## Dashboard Screenshots

### dashboard.png
![dashboard.png](https://github.com/user-attachments/assets/5d6b6996-9d33-449c-b768-dbdd46a02c97)

### sessions.png
![sessions.png](https://github.com/user-attachments/assets/ff15c03e-3f6b-4619-876b-fc52a9cdf7b9)

### events.png
![events.png](https://github.com/user-attachments/assets/87dfd392-eaef-4707-9e55-4d01c46a54d8)

### settings.png
![settings.png](https://github.com/user-attachments/assets/eb99f4bd-0c6e-451a-ba9a-63992d7d716e)

### issues_events_error.png
![issues_events_error.png](https://github.com/user-attachments/assets/fc26e956-62d2-48a9-b50c-243da9450fb4)

### shoppingcart.png
![shoppingcart.png](https://github.com/user-attachments/assets/2abd4589-92ab-456e-8c50-19725cf8dfda)

### issues_spans_404.png
![issues_spans_404.png](https://github.com/user-attachments/assets/05d7ce8d-7089-4eca-872b-bfd1f3440963)

### spans.png
![spans.png](https://github.com/user-attachments/assets/60bfd070-1182-4fb2-8914-2f2c9bddd79f)

### triggerroutes.png
![triggerroutes.png](https://github.com/user-attachments/assets/3f154a35-4168-4027-b209-aba114de6f3c)

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [OpenTelemetry](https://opentelemetry.io/) for distributed tracing
- Uses [rrweb](https://www.rrweb.io/) for session recording
- Frontend built with [Next.js](https://nextjs.org/)
- Backend built with [Go](https://golang.org/) and [Gin](https://gin-gonic.com/)

## Future Roadmap

- [ ] Enhanced scaling options for database clusters
- [ ] Support for additional backend languages (Python, Java, .NET)
- [ ] Advanced alerting and notification system
- [ ] Performance metrics and analytics dashboard
- [ ] Integration with more observability tools

## Author

**Mehdi Akiki**
- Location: New York City, NY
- Website: [MonitorMe Case Study](https://monitorme.dev)

## Contact & Support

For questions, issues, or feature requests, please open an issue on GitHub or contact the maintainers.

---

**MonitorMe** - Simplifying observability for distributed systems, one trace at a time.
