package agent

import (
	"net/http"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/trace"
)

func CustomBaggage(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		tracer := otel.Tracer("retrospect-server-agent")

		// Start tracing span
		spanCtx, span := tracer.Start(ctx, "CustomBaggage")
		defer span.End()

		// Extract headers and set attributes
		headers := r.Header
		segmentID := headers.Get("x-segment-id")
		sessionID := headers.Get("x-session-id")
		userID := headers.Get("x-user-id")
		triggerRoute := headers.Get("x-triggerroute")
		requestData := headers.Get("x-requestdata")

		span.SetAttributes(
			trace.String("frontendSegment", segmentID),
			trace.String("frontendSession", sessionID),
			trace.String("frontendUser", userID),
			trace.String("triggerRoute", triggerRoute),
			trace.String("requestData", requestData),
		)

		// Inject baggage into the context
		baggage := propagation.Baggage{}
		baggage.Set("frontendChapter", segmentID)
		baggage.Set("frontendSession", sessionID)
		baggage.Set("frontendUser", userID)
		baggage.Set("triggerRoute", triggerRoute)
		baggage.Set("requestData", requestData)

		// Add baggage to the context and proceed to the next handler
		ctx = baggage.WithContext(spanCtx)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
