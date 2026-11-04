import { LogEvent } from "../core/LogEvent";
import { LogLevel } from "../core/LogLevel";
import { Formatter } from "../formatters/Formatter";
import { TextFormatter } from "../formatters/TextFormatter";
import { Appender, AppenderOptions } from "./Appender";

/**
 * PADRÃO: Template Method. `append` define o esqueleto fixo:
 * checar nível -> formatar -> `write` (passo variável) -> tratar erro (hook).
 * O cliente só implementa `write` e, se quiser, sobrescreve `onError`.
 */
export abstract class BaseAppender implements Appender {
  protected readonly level: LogLevel;
  protected readonly formatter: Formatter;

  constructor(options: AppenderOptions = {}) {
    this.level = options.level ?? LogLevel.DEBUG;
    this.formatter = options.formatter ?? new TextFormatter();
  }

  append(event: LogEvent): void {
    if (event.level < this.level) return;
    try {
      this.write(this.formatter.format(event), event);
    } catch (error) {
      this.onError(error as Error, event);
    }
  }

  /** Passo variável: entregar a linha já formatada ao destino. */
  protected abstract write(line: string, event: LogEvent): void;

  /** Hook: por padrão, avisa no stderr; um log nunca deve derrubar a aplicação. */
  protected onError(error: Error, _event: LogEvent): void {
    process.stderr.write(`[logweave] falha no appender: ${error.message}\n`);
  }
}
