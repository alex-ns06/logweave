import { LogEvent } from "../core/LogEvent";
import { levelName } from "../core/LogLevel";
import { Formatter } from "./Formatter";
import { safeJson } from "./safeJson";

/** Strategy concreta: uma linha JSON por evento (ideal para ferramentas de coleta). */
export class JsonFormatter implements Formatter {
  format(event: LogEvent): string {
    return safeJson({
      timestamp: event.timestamp.toISOString(),
      level: levelName(event.level),
      logger: event.loggerName,
      message: event.message,
      context: event.context,
      error: event.error && { name: event.error.name, message: event.error.message },
    });
  }
}
