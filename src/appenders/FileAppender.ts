import { appendFileSync } from "node:fs";
import { AppenderOptions } from "./Appender";
import { BaseAppender } from "./BaseAppender";

/** Acrescenta uma linha por evento em um arquivo (escrita síncrona, simples e previsível). */
export class FileAppender extends BaseAppender {
  constructor(private readonly path: string, options: AppenderOptions = {}) {
    super(options);
  }

  protected write(line: string): void {
    appendFileSync(this.path, `${line}\n`, "utf8");
  }
}
