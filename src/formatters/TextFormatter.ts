import { LogEvent } from "../core/LogEvent";
import { levelName } from "../core/LogLevel";
import { Formatter } from "./Formatter";
import { safeJson } from "./safeJson";

/** Strategy concreta: linha legível para humanos. */
export class TextFormatter implements Formatter {
  format(event: LogEvent): string {
    const hasContext = Object.keys(event.context).length > 0;
    const context = hasContext ? ` ${safeJson(event.context)}` : "";
    const error = event.error ? ` | ${event.error.name}: ${event.error.message}` : "";
    return `[${levelName(event.level)}] ${event.loggerName}: ${event.message}${context}${error}`;
  }
}
