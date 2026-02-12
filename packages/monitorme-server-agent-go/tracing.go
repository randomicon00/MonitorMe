package agent

import (
	"fmt"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/zipkin"
	"go.opentelemetry.io/otel/sdk/resource"
	"go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.4.0"
)

// SetupTracing initializes the OpenTelemetry provider with Zipkin exporter
func SetupTracing(cfg *Config) error {
	exporter, err := zipkin.New(
		fmt.Sprintf("%s/spans", cfg.Endpoint),
	)
	if err != nil {
		return fmt.Errorf("failed to create Zipkin exporter: %w", err)
	}

	// Create and register a trace provider
	tp := trace.NewTracerProvider(
		trace.WithBatcher(exporter),
		trace.WithResource(resource.NewWithAttributes(
			semconv.ServiceNameKey.String(cfg.ServiceName),
		)),
	)

	otel.SetTracerProvider(tp)
	return nil
}
