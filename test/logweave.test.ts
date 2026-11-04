import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  AppenderFactory,
  BaseAppender,
  BlockListInterceptor,
  Interceptor,
  JsonFormatter,
  LevelFilterInterceptor,
  LogEvent,
  LogLevel,
  LogManager,
  LoggerBuilder,
  MemoryAppender,
  RedactDecorator,
  SamplingInterceptor,
  TextFormatter,
  TimestampDecorator,
} from "../src/index";

const event = (over: Partial<LogEvent> = {}): LogEvent => ({
  level: LogLevel.INFO,
  message: "msg",
  loggerName: "t",
  timestamp: new Date("2026-01-01T00:00:00.000Z"),
  context: {},
  ...over,
});

test("Builder: logger padrão filtra abaixo de INFO e respeita nível configurado", () => {
  const memory = new MemoryAppender();
  const logger = new LoggerBuilder("a").appender(memory).build();
  logger.debug("x");
  logger.info("y");
  assert.equal(memory.events.length, 1);

  const verbose = new MemoryAppender();
  new LoggerBuilder("b").level(LogLevel.DEBUG).appender(verbose).build().debug("z");
  assert.equal(verbose.events.length, 1);
});

test("Strategy: formatters trocáveis", () => {
  assert.equal(new TextFormatter().format(event()), "[INFO] t: msg");
  const json = JSON.parse(new JsonFormatter().format(event({ context: { a: 1 } })));
  assert.equal(json.level, "INFO");
  assert.deepEqual(json.context, { a: 1 });
});

test("Observer: vários appenders recebem o evento e podem cancelar a inscrição", () => {
  const a = new MemoryAppender();
  const b = new MemoryAppender();
  const logger = new LoggerBuilder("o").appender(a).build();
  const cancel = logger.subscribe(b);
  logger.info("1");
  cancel();
  logger.info("2");
  assert.equal(a.events.length, 2);
  assert.equal(b.events.length, 1);
});

test("Observer: appender defeituoso não afeta os outros", () => {
  const ok = new MemoryAppender();
  const logger = new LoggerBuilder("o").appender({ append() { throw new Error("boom"); } }).appender(ok).build();
  logger.info("x");
  assert.equal(ok.events.length, 1);
});

test("Chain of Responsibility: elos em ordem, descarte interrompe a corrente", () => {
  const memory = new MemoryAppender();
  const seen: string[] = [];
  class Spy extends Interceptor {
    protected process(e: LogEvent) { seen.push("spy"); return e; }
  }
  const logger = new LoggerBuilder("c")
    .interceptor(new BlockListInterceptor(["secreto", /^ping/]))
    .interceptor(new Spy())
    .appender(memory)
    .build();
  logger.info("tem secreto aqui");
  logger.info("ping 1");
  logger.info("ok");
  assert.deepEqual(memory.events.map((e) => e.message), ["ok"]);
  assert.deepEqual(seen, ["spy"]);
});

test("Chain of Responsibility: LevelFilter e Sampling (WARN nunca é amostrado)", () => {
  const memory = new MemoryAppender();
  const logger = new LoggerBuilder("c")
    .level(LogLevel.DEBUG)
    .interceptor(new LevelFilterInterceptor(LogLevel.INFO))
    .interceptor(new SamplingInterceptor(0, LogLevel.WARN, () => 0.5))
    .appender(memory)
    .build();
  logger.debug("a");
  logger.info("b");
  logger.warn("c");
  assert.deepEqual(memory.events.map((e) => e.message), ["c"]);
});

test("Decorator: timestamp e redact empilhados, em texto e JSON", () => {
  const text = new TimestampDecorator(new RedactDecorator(new TextFormatter()));
  const out = text.format(event({ context: { password: "123", user: "alex" } }));
  assert.ok(out.startsWith("2026-01-01T00:00:00.000Z [INFO]"));
  assert.ok(out.includes('"password":"***"'));
  assert.ok(out.includes('"user":"alex"'));
  assert.ok(!out.includes("123"));

  const json = new RedactDecorator(new JsonFormatter()).format(event({ context: { token: "abc" } }));
  assert.equal(JSON.parse(json).context.token, "***");
});

test("Factory + Registry: tipos embutidos e tipo customizado sem alterar a lib", () => {
  assert.deepEqual(AppenderFactory.types().slice(0, 3), ["console", "memory", "file"]);
  assert.throws(() => AppenderFactory.create("inexistente"), /não registrado/);
  assert.throws(() => AppenderFactory.create("file"), /path/);

  const received: string[] = [];
  class Custom extends BaseAppender {
    protected write(line: string) { received.push(line); }
  }
  AppenderFactory.register("custom", (c) => new Custom(c));
  new LoggerBuilder("f").appenderOf("custom").build().info("olá");
  assert.deepEqual(received, ["[INFO] f: olá"]);
});

test("Template Method: nível do appender e hook de erro", () => {
  const errors: string[] = [];
  class Failing extends BaseAppender {
    protected write(): void { throw new Error("falhou"); }
    protected onError(e: Error) { errors.push(e.message); }
  }
  const failing = new Failing({ level: LogLevel.ERROR });
  failing.append(event({ level: LogLevel.INFO }));
  assert.equal(errors.length, 0);
  failing.append(event({ level: LogLevel.ERROR }));
  assert.deepEqual(errors, ["falhou"]);
});

test("FileAppender: grava uma linha por evento", () => {
  const path = join(mkdtempSync(join(tmpdir(), "logweave-")), "app.log");
  const logger = new LoggerBuilder("file").appenderOf("file", { path }).build();
  logger.info("um");
  logger.warn("dois");
  assert.deepEqual(readFileSync(path, "utf8").trim().split("\n"), ["[INFO] file: um", "[WARN] file: dois"]);
});

test("Singleton: mesma instância e mesmos loggers", () => {
  const manager = LogManager.getInstance();
  assert.equal(manager, LogManager.getInstance());
  manager.clear();
  assert.equal(manager.getLogger("x"), manager.getLogger("x"));
  assert.ok(manager.has("x"));
  const custom = new LoggerBuilder("y").appender(new MemoryAppender()).build();
  manager.register(custom);
  assert.equal(manager.getLogger("y"), custom);
});
