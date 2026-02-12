# MonitorMe Python Server Agent

The MonitorMe Python Server Agent instruments Python backend services and exports traces to the MonitorMe API using the same `/spans` Zipkin-compatible endpoint used by the existing JS and Go agents.

## Features

- FastAPI auto-instrumentation
- Outbound HTTP instrumentation (`requests`)
- Request metadata enrichment from frontend headers:
  - `x-segment-id`
  - `x-session-id`
  - `x-user-id`
  - `x-trigger-route`
  - `x-request-data`
- Zipkin JSON export to `${endpoint}/spans`

## Install

From this repository:

```bash
cd packages/monitorme-server-agent-py
python -m pip install -e .
```

## Configuration

Copy and edit the example config:

```bash
cp config.example.json config.json
```

Config fields:

- `serviceName`: service name shown in traces
- `endpoint`: MonitorMe API base URL (agent appends `/spans`)
- `authToken`: optional bearer token
- `dbOptions`: reserved for parity with other agents

## FastAPI Usage

```python
from fastapi import FastAPI
from monitorme_server_agent_py import load_config, setup_fastapi

app = FastAPI()
setup_fastapi(app, load_config("config.json"))
```

Run the included example:

```bash
uvicorn example_fastapi:app --host 0.0.0.0 --port 8000
```
