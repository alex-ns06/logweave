import { LogEvent } from "../core/LogEvent";
import { FormatterDecorator } from "./FormatterDecorator";

/** Prefixa a saída com a data ISO. Use com TextFormatter (o JsonFormatter já inclui timestamp). */
export class TimestampDecorator extends FormatterDecorator {
  format(event: LogEvent): string {
    return `${event.timestamp.toISOString()} ${this.inner.format(event)}`;
  }
}
