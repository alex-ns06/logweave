// Uso padrão (out-of-the-box): nenhuma classe própria é necessária.
import {
  JsonFormatter,
  LevelFilterInterceptor,
  LogLevel,
  LogManager,
  LoggerBuilder,
  RedactDecorator,
  TextFormatter,
  TimestampDecorator,
} from "../src/index";

// 1) Logger padrão: console, nível INFO.
const simple = new LoggerBuilder("app").build();
simple.info("Aplicação iniciada");
simple.debug("Isto não aparece (abaixo de INFO)");

// 2) Logger configurado: dois destinos, formatos diferentes e senha mascarada.
const logger = new LoggerBuilder("auth")
  .level(LogLevel.DEBUG)
  .interceptor(new LevelFilterInterceptor(LogLevel.DEBUG))
  .appenderOf("console", { formatter: new TimestampDecorator(new RedactDecorator(new TextFormatter())) })
  .appenderOf("memory", { formatter: new JsonFormatter() })
  .build();

logger.info("Login realizado", { user: "alex", password: "123456" });
logger.error("Falha ao autenticar", new Error("token expirado"), { token: "abc.def" });

// 3) Singleton: o mesmo logger em qualquer módulo.
LogManager.getInstance().register(logger);
LogManager.getInstance().getLogger("auth").warn("Recuperado do registro global");
