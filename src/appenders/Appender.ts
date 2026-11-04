import { LogEvent } from "../core/LogEvent";
import { LogLevel } from "../core/LogLevel";
import { Formatter } from "../formatters/Formatter";

/** Observador do Logger: recebe cada evento aprovado. */
export interface Appender {
  append(event: LogEvent): void;
}

export interface AppenderOptions {
  level?: LogLevel;
  formatter?: Formatter;
}
