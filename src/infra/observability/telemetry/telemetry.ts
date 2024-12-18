import { NodeSDK } from '@opentelemetry/sdk-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { Resource } from '@opentelemetry/resources';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions/incubating';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: `${process.env.OTLP_TRACE_EXPORTER_URL}/v1/traces`,
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: `${process.env.OTLP_TRACE_EXPORTER_URL}/v1/metrics`,
    }),
  }),
  resource: new Resource({
    [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME,
    [ATTR_SERVICE_VERSION]: process.env.npm_package_version,
  }),
  logRecordProcessors: [
    new BatchLogRecordProcessor(
      new OTLPLogExporter({
        url: `${process.env.OTLP_TRACE_EXPORTER_URL}/v1/logs`,
      }),
    ),
  ],
  instrumentations: [
    new PrismaInstrumentation({ enabled: true }),
    new HttpInstrumentation(),
    new NestInstrumentation(),
    new ExpressInstrumentation(),
    new WinstonInstrumentation(),
    getNodeAutoInstrumentations(),
  ],
});

sdk.start();

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  try {
    await sdk.shutdown();
    console.log('Tracing shut down successfully');
  } catch (err) {
    console.error('Error shutting down tracing', err);
  } finally {
    process.exit(0);
  }
});
