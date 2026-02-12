# MonitorMe Client Agent

A browser-based session tracking agent that uses rrweb to capture user interactions and send them to the MonitorMe backend for full-stack observability.

## Installation

```bash
npm install
```

## Usage

Import and initialize the client agent in your application entry point:

```javascript
import sessionEventTracker from './index.js';

sessionEventTracker.initialize();
```

## Configuration

Edit `config.json` to configure endpoints and sampling behavior:

- `eventEndpoint`: URL for sending browser events
- `snapshotEndpoint`: URL for sending DOM snapshots
- `samplingConfig`: Configure which events to capture
- `snapshotInterval`: How often to capture full snapshots
- `authToken`: Authentication token for backend API

## Features

- Automatic session management with 30-minute expiration
- Fetch API interception to correlate frontend and backend traces
- Configurable event sampling
- Integration with OpenTelemetry backend traces
