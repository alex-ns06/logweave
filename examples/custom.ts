// Uso estendido: o cliente cria suas próprias classes SEM alterar a biblioteca.
import {
  AppenderFactory,
  BaseAppender,
  Formatter,
  Interceptor,
  LogEvent,
  LoggerBuilder,
  LogLevel,
  levelName,
} from "../src/index";

// Novo destino (Template Method): só implementa `write`.
class WebhookAppender extends BaseAppender {
  protected write(line: string): void {
    console.log(`[webhook simulado] POST ${line}`);
  }
}

// Novo formato (Strategy).
class CsvFormatter implements Formatter {
  format(e: LogEvent): string {
    return `${e.timestamp.toISOString()};${levelName(e.level)};${e.loggerName};${e.message}`;
  }
}

// Novo elo da corrente (Chain of Responsibility): acrescenta o contexto "env".
class EnvInterceptor extends Interceptor {
  protected process(e: LogEvent): LogEvent | null {
    return { ...e, context: { ...e.context, env: "dev" } };
  }
}

// Cadastro na fábrica (Factory + Registry): agora existe o tipo "webhook".
AppenderFactory.register("webhook", (config) => new WebhookAppender(config));

const logger = new LoggerBuilder("pagamentos")
  .level(LogLevel.INFO)
  .interceptor(new EnvInterceptor())
  .appenderOf("webhook", { formatter: new CsvFormatter() })
  .appenderOf("console")
  .build();

logger.info("Pagamento aprovado", { valor: 49.9 });
