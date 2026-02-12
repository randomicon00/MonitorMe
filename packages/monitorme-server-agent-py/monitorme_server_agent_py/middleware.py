from __future__ import annotations

from collections.abc import Mapping

from opentelemetry import baggage, context, trace

HEADER_TO_ATTRIBUTE = {
    "x-segment-id": "segmentId",
    "x-session-id": "sessionId",
    "x-user-id": "userId",
    "x-trigger-route": "triggerRoute",
    "x-request-data": "requestData",
}


def _extract_attributes(headers: Mapping[str, str]) -> dict[str, str]:
    attributes: dict[str, str] = {}
    for header_name, attribute_name in HEADER_TO_ATTRIBUTE.items():
        value = headers.get(header_name, "").strip()
        if value:
            attributes[attribute_name] = value
    return attributes


def _set_span_attributes(attributes: dict[str, str]) -> None:
    current_span = trace.get_current_span()
    if current_span and current_span.is_recording():
        for key, value in attributes.items():
            current_span.set_attribute(key, value)


def _attach_baggage(attributes: dict[str, str]) -> context.Token:
    current_context = context.get_current()
    for key, value in attributes.items():
        current_context = baggage.set_baggage(key, value, context=current_context)
    return context.attach(current_context)


class MonitorMeASGIBaggageMiddleware:
    def __init__(self, app) -> None:
        self.app = app

    async def __call__(self, scope, receive, send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        headers = {
            key.decode("latin-1").lower(): value.decode("latin-1")
            for key, value in scope.get("headers", [])
        }
        attributes = _extract_attributes(headers)

        if not attributes:
            await self.app(scope, receive, send)
            return

        _set_span_attributes(attributes)
        token = _attach_baggage(attributes)
        try:
            await self.app(scope, receive, send)
        finally:
            context.detach(token)
