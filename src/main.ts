import { Level, LoggerOptions } from 'pino';

// Map Pino levels to Google Cloud Logging severity levels
// https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity
const levelToSeverity: Record<string, string> = {
  trace: 'DEBUG',
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
  fatal: 'CRITICAL',
};

export interface ServiceContext {
  serviceName?: string;
  version?: string;
  mixin?: (mergeObject: object, level: number) => object;
}

export function gcpLogOptions(
  options?: LoggerOptions,
  context: ServiceContext = {},
): LoggerOptions {
  const { mixin, serviceName, version } = context;

  const base =
    serviceName && version
      ? { serviceContext: { service: serviceName, version } }
      : {};

  return {
    // https://cloud.google.com/error-reporting/docs/formatting-error-messages#json_representation
    base,
    formatters: {
      level(label: string) {
        const pinoLevel = label as Level;
        const severity = levelToSeverity[label] ?? 'INFO';
        // `@type` property tells Error Reporting to track even if there is no `stack_trace`
        // you might want to make this an option the plugin, in our case we do want error reporting for all errors, with or without a stack
        const typeProp =
          pinoLevel === 'error' || pinoLevel === 'fatal'
            ? {
                '@type':
                  'type.googleapis.com/google.devtools.clouderrorreporting.v1beta1.ReportedErrorEvent',
              }
            : {};
        return { severity, ...typeProp };
      },

      log(object) {
        const logObject = object as { err?: Error };
        const stackTrace = logObject.err?.stack;
        const stackProp = stackTrace ? { stack_trace: stackTrace } : {};
        return { ...object, ...stackProp };
      },
    },
    mixin,
    messageKey: 'message',
    ...options,
  };
}
