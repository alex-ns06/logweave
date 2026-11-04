import { LogEvent } from "../core/LogEvent";
import { LogLevel } from "../core/LogLevel";
import { Interceptor } from "./Interceptor";

/** Descarta eventos abaixo de um nível mínimo. */
export class LevelFilterInterceptor extends Interceptor {
  constructor(private readonly minLevel: LogLevel) {
    super();
  }
  protected process(event: LogEvent): LogEvent | null {
    return event.level >= this.minLevel ? event : null;
  }
}
