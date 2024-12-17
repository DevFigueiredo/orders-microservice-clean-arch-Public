import * as winston from 'winston';
import { OpenTelemetryTransportV3 } from '@opentelemetry/winston-transport';
class Logger {
  private consoleLogger: winston.Logger;
  private level: 'info' | 'error' | 'debug' | 'warn' = 'info';

  constructor(private readonly appName: string) {
    this.level = 'info';

    // Criando transporte do console com formatação bonita
    const consoleTransport = new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        winston.format.printf(({ timestamp, level, message, context }) => {
          const contextString = context ? ` | context: ${context}` : '';
          return `${timestamp} [${appName}] [${level}] ${message}${contextString}`;
        }),
      ),
    });

    // Transporte para OpenTelemetry sem formatação extra
    const otlpTransport = new OpenTelemetryTransportV3({
      format: winston.format.json(), // Garantindo compatibilidade OTLP
    });

    // Criando o logger com múltiplos transportes
    this.consoleLogger = winston.createLogger({
      level: this.level,
      transports: [consoleTransport, otlpTransport],
    });
  }

  private logging(
    level: 'info' | 'error' | 'debug' | 'warn',
    msg: string,
    context?: any,
  ) {
    this.consoleLogger.log(
      level,
      msg,
      typeof context === 'string'
        ? { context }
        : { context: JSON.stringify(context) },
    );
  }

  log(msg: string, context?: any) {
    this.logging('info', msg, context);
  }

  info(msg: string, context?: any) {
    this.logging('info', msg, context);
  }

  error(msg: string, context?: any) {
    this.logging('error', msg, context);
  }

  debug(msg: string, context?: any) {
    this.logging('debug', msg, context);
  }

  warn(msg: string, context?: any) {
    this.logging('warn', msg, context);
  }
}
export default new Logger('pilula-order');
