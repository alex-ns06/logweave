import { LogEvent } from "../core/LogEvent";
import { Interceptor } from "./Interceptor";

/** Descarta eventos cuja mensagem contenha um texto (string) ou case com uma RegExp. */
export class BlockListInterceptor extends Interceptor {
  constructor(private readonly patterns: Array<string | RegExp>) {
    super();
  }
  protected process(event: LogEvent): LogEvent | null {
    const blocked = this.patterns.some((p) =>
      typeof p === "string" ? event.message.includes(p) : p.test(event.message),
    );
    return blocked ? null : event;
  }
}
