import { LogEvent } from "../core/LogEvent";
import { LogLevel } from "../core/LogLevel";
import { Interceptor } from "./Interceptor";

/** Deixa passar só uma fração (`rate`, 0..1) dos eventos abaixo de `exemptFrom` (padrão: WARN nunca é amostrado). */
export class SamplingInterceptor extends Interceptor {
  constructor(
    private readonly rate: number,
    private readonly exemptFrom: LogLevel = LogLevel.WARN,
    private readonly random: () => number = Math.random,
  ) {
    super();
  }
  protected process(event: LogEvent): LogEvent | null {
    if (event.level >= this.exemptFrom) return event;
    return this.random() < this.rate ? event : null;
  }
}
