import { LogLevel } from "./LogLevel";

export type LogContext = Record<string, unknown>;

export interface LogEvent {
  readonly level: LogLevel;
  readonly message: string;
  readonly loggerName: string;
  readonly timestamp: Date;
  readonly context: LogContext;
  readonly error?: Error;
}
