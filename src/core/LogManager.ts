import { Logger } from "./Logger";
import { LoggerBuilder } from "./LoggerBuilder";

/**
 * PADRÃO: Singleton. Um único registro de loggers por processo: qualquer módulo
 * da aplicação pede `getLogger("nome")` e recebe sempre a mesma instância.
 */
export class LogManager {
  private static instance?: LogManager;
  private readonly loggers = new Map<string, Logger>();

  private constructor() {}

  static getInstance(): LogManager {
    return (LogManager.instance ??= new LogManager());
  }

  register(logger: Logger): Logger {
    this.loggers.set(logger.name, logger);
    return logger;
  }

  /** Devolve o logger registrado ou cria um padrão (console, INFO). */
  getLogger(name: string): Logger {
    return this.loggers.get(name) ?? this.register(new LoggerBuilder(name).build());
  }

  has(name: string): boolean {
    return this.loggers.has(name);
  }

  clear(): void {
    this.loggers.clear();
  }
}
