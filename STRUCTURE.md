# MonitorMe Project Structure

This document describes the organization of the MonitorMe project.

## Directory Structure

```
monitorme/
├── packages/                            # All MonitorMe packages
│   ├── monitorme-client-agent/         # Frontend session recording agent
│   │   ├── index.js                    # Main client agent code
│   │   ├── config.json                 # Configuration file
│   │   ├── package.json                # NPM package definition
│   │   └── README.md                   # Client agent documentation
│   │
│   ├── monitorme-server-agent-js/      # Node.js backend tracing middleware
│   │   ├── middleware.js               # Custom baggage middleware
│   │   ├── tracing.js                  # OpenTelemetry tracing setup
│   │   ├── config.json                 # Configuration file
│   │   ├── utils.js                    # Utility functions
│   │   ├── example.js                  # Example usage
│   │   └── README.md                   # JS server agent documentation
│   │
│   ├── monitorme-server-agent-go/      # Go backend tracing middleware
│   │   ├── agent.go                    # Main agent code
│   │   ├── tracing.go                  # OpenTelemetry tracing setup
│   │   ├── config.go                   # Configuration handling
│   │   ├── config.json                 # Configuration file
│   │   └── example.go                  # Example usage
│   │
│   ├── monitorme-api/                  # Go API service
│   │   ├── main.go                     # Main entry point
│   │   ├── go.mod                      # Go module definition
│   │   ├── app/                        # Application logic
│   │   ├── config/                     # Configuration management
│   │   ├── controllers/                # HTTP request handlers
│   │   ├── database/                   # Database connections
│   │   ├── logic/                      # Business logic
│   │   ├── middleware/                 # HTTP middleware
│   │   └── router/                     # Route definitions
│   │
│   └── monitorme-dashboard/            # Next.js dashboard UI
│       ├── package.json                # NPM package definition
│       ├── next.config.js              # Next.js configuration
│       ├── tsconfig.json               # TypeScript configuration
│       ├── tailwind.config.js          # Tailwind CSS configuration
│       ├── components/                 # React components
│       ├── pages/                      # Next.js pages
│       ├── styles/                     # CSS styles
│       ├── public/                     # Static assets
│       ├── types/                      # TypeScript type definitions
│       └── utils/                      # Utility functions
│
├── deploy/                             # Deployment configurations
│   └── kubernetes/                     # Kubernetes manifests
│       ├── postgres-deployment.yaml    # PostgreSQL database deployment
│       ├── postgres-service.yaml       # PostgreSQL service
│       ├── golang-deployment.yaml      # API service deployment
│       ├── golang-service.yaml         # API service
│       ├── nextjs-deployment.yaml      # Dashboard deployment
│       ├── nextjs-service.yaml         # Dashboard service
│       ├── ingress.yaml                # Ingress configuration
│       └── README.md                   # Deployment documentation
│
├── docs/                               # Documentation
│   ├── README client agent.md          # Client agent documentation
│   ├── README server agent.md          # Server agent documentation
│   ├── README service.md               # API service documentation
│   └── README user interface.md        # Dashboard documentation
│
├── README.md                           # Main project README
├── .gitignore                          # Git ignore rules
└── STRUCTURE.md                        # This file
```

## Component Overview

### Client Agent (monitorme-client-agent)
- **Purpose**: Captures browser events and user interactions
- **Technology**: rrweb for session recording
- **Language**: JavaScript
- **Integration**: Installed via npm in frontend applications

### Server Agents (monitorme-server-agent-js/go)
- **Purpose**: Instruments backend services for distributed tracing
- **Technology**: OpenTelemetry
- **Languages**: JavaScript (Node.js) and Go
- **Integration**: Installed as middleware in backend services

### API Service (monitorme-api)
- **Purpose**: Receives, processes, and serves observability data
- **Technology**: Gin (Go web framework), GORM (ORM)
- **Language**: Go
- **Database**: PostgreSQL

### Dashboard (monitorme-dashboard)
- **Purpose**: Visualizes traces and session recordings
- **Technology**: Next.js, React, Tailwind CSS
- **Language**: TypeScript/JavaScript
- **Features**: Trace visualization, session replay, search and filtering

## Key Files

- `README.md` - Main project documentation
- `.gitignore` - Specifies files to ignore in version control
- `STRUCTURE.md` - This file, describing project organization

## Development Workflow

1. **Frontend Changes**: Work in `packages/monitorme-dashboard/`
2. **API Changes**: Work in `packages/monitorme-api/`
3. **Client Agent Changes**: Work in `packages/monitorme-client-agent/`
4. **Server Agent Changes**: Work in `packages/monitorme-server-agent-js/` or `packages/monitorme-server-agent-go/`
5. **Deployment**: Update configurations in `deploy/kubernetes/`
6. **Documentation**: Update files in `docs/` and main `README.md`

## Package Dependencies

### Client Agent
- rrweb
- uuid
- fetch-intercept

### Server Agents (JS)
- @opentelemetry/api
- @opentelemetry/sdk-node
- @opentelemetry/auto-instrumentations-node

### Server Agents (Go)
- go.opentelemetry.io/otel
- go.opentelemetry.io/contrib/instrumentation

### API Service
- github.com/gin-gonic/gin
- gorm.io/gorm
- gorm.io/driver/postgres

### Dashboard
- next
- react
- react-dom
- rrweb-player
- chart.js
- tailwindcss

## Environment Variables

See individual package README files and the main README.md for required environment variables for each component.
