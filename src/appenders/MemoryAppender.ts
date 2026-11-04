import { LogEvent } from "../core/LogEvent";
import { BaseAppender } from "./BaseAppender";

/** Guarda tudo em memória; útil em testes da aplicação cliente. */
export class MemoryAppender extends BaseAppender {
  readonly lines: string[] = [];
  readonly events: LogEvent[] = [];

  protected write(line: string, event: LogEvent): void {
    this.lines.push(line);
    this.events.push(event);
  }

  clear(): void {
    this.lines.length = 0;
    this.events.length = 0;
  }
}
