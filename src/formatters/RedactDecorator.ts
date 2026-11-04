import { LogEvent } from "../core/LogEvent";
import { Formatter } from "./Formatter";
import { FormatterDecorator } from "./FormatterDecorator";

const DEFAULT_KEYS = ["password", "senha", "token", "secret", "authorization", "apiKey"];

/** Mascara valores de chaves sensíveis (`password`, `token`...) na saída de qualquer Formatter. */
export class RedactDecorator extends FormatterDecorator {
  private readonly pattern: RegExp;

  constructor(inner: Formatter, keys: string[] = DEFAULT_KEYS) {
    super(inner);
    const alternatives = keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
    this.pattern = new RegExp(`("?(?:${alternatives})"?\\s*[:=]\\s*)("(?:[^"\\\\]|\\\\.)*"|[^\\s,}]+)`, "gi");
  }

  format(event: LogEvent): string {
    return this.inner.format(event).replace(this.pattern, '$1"***"');
  }
}
