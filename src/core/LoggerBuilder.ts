import { Appender } from "../appenders/Appender";
import { ConsoleAppender } from "../appenders/ConsoleAppender";
import { AppenderConfig, AppenderFactory } from "../factory/AppenderFactory";
import { Interceptor } from "../interceptors/Interceptor";
import { LogLevel } from "./LogLevel";
import { Logger } from "./Logger";

/**
 * PADRÃO: Builder. Monta um Logger passo a passo com API fluente, evitando um
 * construtor com muitos parâmetros opcionais. Sem configuração, usa console (INFO).
 */
export class LoggerBuilder {
  private minLevel = LogLevel.INFO;
  private readonly appenders: Appender[] = [];
  private readonly interceptors: Interceptor[] = [];

  constructor(private readonly name: string) {}

  level(level: LogLevel): this {
    this.minLevel = level;
    return this;
  }

  appender(appender: Appender): this {
    this.appenders.push(appender);
    return this;
  }

  /** Cria o appender pelo nome registrado na AppenderFactory (ex.: "file", "console"). */
  appenderOf(type: string, config?: AppenderConfig): this {
    return this.appender(AppenderFactory.create(type, config));
  }

  /** Adiciona um elo à corrente de interceptors, na ordem em que foram adicionados. */
  interceptor(interceptor: Interceptor): this {
    this.interceptors.push(interceptor);
    return this;
  }

  build(): Logger {
    const logger = new Logger(this.name, this.minLevel, this.linkChain());
    const appenders = this.appenders.length > 0 ? this.appenders : [new ConsoleAppender()];
    appenders.forEach((appender) => logger.subscribe(appender));
    return logger;
  }

  private linkChain(): Interceptor | undefined {
    const [head, ...rest] = this.interceptors;
    rest.reduce<Interceptor>((previous, current) => previous.setNext(current), head);
    return head;
  }
}
