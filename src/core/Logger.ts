import { Appender } from "../appenders/Appender";
import { Interceptor } from "../interceptors/Interceptor";
import { LogContext, LogEvent } from "./LogEvent";
import { LogLevel } from "./LogLevel";

/**
 * PADRÃO: Observer. O Logger é o "subject": os Appenders se inscrevem com
 * `subscribe` e são notificados a cada evento aprovado. Novos destinos entram
 * sem nenhuma mudança nesta classe.
 */
export class Logger {
  private readonly appenders = new Set<Appender>();

  constructor(
    readonly name: string,
    private readonly minLevel: LogLevel = LogLevel.INFO,
    private readonly chain?: Interceptor,
  ) {}

  /** Inscreve um appender e devolve uma função que cancela a inscrição. */
  subscribe(appender: Appender): () => void {
    this.appenders.add(appender);
    return () => this.unsubscribe(appender);
  }

  unsubscribe(appender: Appender): void {
    this.appenders.delete(appender);
  }

  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }
  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }
  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }
  error(message: string, error?: Error, context?: LogContext): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  log(level: LogLevel, message: string, context: LogContext = {}, error?: Error): void {
    if (level < this.minLevel) return;
    const event: LogEvent = { level, message, loggerName: this.name, timestamp: new Date(), context, error };
    const approved = this.chain ? this.chain.handle(event) : event;
    if (approved) this.notify(approved);
  }

  private notify(event: LogEvent): void {
    for (const appender of this.appenders) {
      try {
        appender.append(event);
      } catch {
        // Um appender defeituoso não pode afetar os demais nem a aplicação.
      }
    }
  }
}
