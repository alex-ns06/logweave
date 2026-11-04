import { Appender, AppenderOptions } from "../appenders/Appender";
import { ConsoleAppender } from "../appenders/ConsoleAppender";
import { FileAppender } from "../appenders/FileAppender";
import { MemoryAppender } from "../appenders/MemoryAppender";

export type AppenderConfig = AppenderOptions & { [key: string]: unknown };
export type AppenderCreator = (config: AppenderConfig) => Appender;

/**
 * PADRÃO: Factory + Registry. Cria appenders pelo NOME do tipo. Tipos novos são
 * cadastrados com `register`, sem alterar a biblioteca (Open/Closed Principle).
 */
export class AppenderFactory {
  private static readonly creators = new Map<string, AppenderCreator>([
    ["console", (c) => new ConsoleAppender(c)],
    ["memory", (c) => new MemoryAppender(c)],
    [
      "file",
      (c) => {
        if (typeof c.path !== "string") throw new Error('O appender "file" exige a opção "path".');
        return new FileAppender(c.path, c);
      },
    ],
  ]);

  static register(type: string, creator: AppenderCreator): void {
    this.creators.set(type, creator);
  }

  static create(type: string, config: AppenderConfig = {}): Appender {
    const creator = this.creators.get(type);
    if (!creator) {
      throw new Error(`Appender "${type}" não registrado. Tipos disponíveis: ${this.types().join(", ")}`);
    }
    return creator(config);
  }

  static types(): string[] {
    return [...this.creators.keys()];
  }
}
