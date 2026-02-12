![MonitorMe logo](https://github.com/user-attachments/assets/b23517a8-8783-4788-8121-9f8210469784)

# MonitorMe

MonitorMe is an open-source, full-stack observability project for distributed applications. It combines backend distributed tracing with frontend session data so teams can identify incidents faster and understand user impact more clearly.

## Who This Is For

This repository is written to be easy to evaluate by recruiters, engineering managers, and senior engineers.

- Recruiters can quickly see product scope, ownership, and business relevance.
- Engineering managers can review architecture decisions, stack choices, and delivery quality.
- Engineers can inspect implementation details in each package and service.

## What MonitorMe Solves

Most teams can see backend traces or frontend behavior, but not both in one workflow. MonitorMe correlates both signals so a team can move from "an alert fired" to "root cause found" with less context switching.

## Core Capabilities

- Full-stack observability across browser and backend services
- Distributed tracing based on OpenTelemetry concepts
- Session event and snapshot collection using rrweb
- Correlated debugging in a single dashboard
- Deployable with local setup or Kubernetes manifests

## Architecture

MonitorMe has four main parts:

1. `packages/monitorme-client-agent/`: Browser session recorder
2. `packages/monitorme-server-agent-js/` and `packages/monitorme-server-agent-go/`: Service instrumentation agents
3. `packages/monitorme-api/`: Go API for ingestion, auth, and querying
4. `packages/monitorme-dashboard/`: Next.js UI for search, filtering, and replay

### Repository Structure

```text
monitorme/
├── packages/
│   ├── monitorme-client-agent/
│   ├── monitorme-server-agent-js/
│   ├── monitorme-server-agent-go/
│   ├── monitorme-api/
│   └── monitorme-dashboard/
├── deploy/
│   └── kubernetes/
├── docs/
├── README.md
└── STRUCTURE.md
```

## Quick Evaluation Path

If you are reviewing this project for hiring:

1. Read `STRUCTURE.md` for the high-level system map.
2. Review `packages/monitorme-api/` for backend design and data flow.
3. Review `packages/monitorme-dashboard/` for frontend architecture and UX decisions.
4. Review `deploy/kubernetes/` for deployment and operational setup.

## Local Setup

Prerequisites:

- Node.js 14+
- Go 1.19+
- PostgreSQL 12+

Run API service:

```bash
cd packages/monitorme-api
cp .env.example .env
go build -o monitorme-api
./monitorme-api
```

Run dashboard:

```bash
cd packages/monitorme-dashboard
npm install
npm run dev
```

For Kubernetes deployment manifests, see `deploy/kubernetes/README.md`.

## Documentation

- [Client Agent Documentation](docs/README%20client%20agent.md)
- [Server Agent Documentation](docs/README%20server%20agent.md)
- [API Service Documentation](docs/README%20service.md)
- [User Interface Documentation](docs/README%20user%20interface.md)

## Technology Stack

- Backend: Go, Gin, GORM, PostgreSQL
- Frontend: Next.js, React, Tailwind
- Observability: OpenTelemetry concepts, rrweb session recording
- Deployment: Kubernetes manifests

## Contributing

Contributions are welcome through pull requests.

1. Create a branch from `main`
2. Make focused changes
3. Add or update tests where relevant
4. Open a pull request with context and screenshots/logs as needed

## License

This project is licensed under the MIT License.
