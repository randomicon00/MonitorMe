from __future__ import annotations

from opentelemetry import trace
from opentelemetry.exporter.zipkin.json import ZipkinExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

from .config import AgentConfig
from .middleware import MonitorMeASGIBaggageMiddleware


def _spans_endpoint(endpoint: str) -> str:
    return f"{endpoint.rstrip('/')}/spans"


def setup_tracing(config: AgentConfig) -> TracerProvider:
    headers = {}
    if config.auth_token:
        headers["Authorization"] = f"Bearer {config.auth_token}"

    resource = Resource.create({SERVICE_NAME: config.service_name})
    tracer_provider = TracerProvider(resource=resource)
    tracer_provider.add_span_processor(
        BatchSpanProcessor(
            ZipkinExporter(
                endpoint=_spans_endpoint(config.endpoint),
                headers=headers,
            )
        )
    )
    trace.set_tracer_provider(tracer_provider)
    RequestsInstrumentor().instrument()
    return tracer_provider


def setup_fastapi(app, config: AgentConfig) -> TracerProvider:
    tracer_provider = setup_tracing(config)
    app.add_middleware(MonitorMeASGIBaggageMiddleware)
    FastAPIInstrumentor.instrument_app(app, tracer_provider=tracer_provider)
    return tracer_provider
