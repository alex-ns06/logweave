# logweave

**Nome do projeto:** logweave

## Significado do nome

**logweave** vem da junção de duas palavras em inglês:

- **log**: "registro". É o que a biblioteca faz: registrar os eventos de uma aplicação.
- **weave**: "tecer, entrelaçar".

**Por que esse nome?** Porque a biblioteca funciona como um tecido: ela entrelaça peças independentes (appenders, formatters, interceptors e decorators) em um único fluxo de logging. O `LoggerBuilder` monta essas peças, e o cliente pode criar novas e encaixá-las sem alterar o código da lib. Além disso, o nome é curto, fácil de digitar em um `import` e de lembrar.

## Sobre

Biblioteca **extensível de logging e telemetria in-process** para Node.js/TypeScript, sem dependências em tempo de execução.

Trabalho final de **Design Patterns e Clean Code** (tema: Logging e Telemetria In-Process (Opção B)).

## Equipe

- Alex Narok Stavasz
- Felipe da Veiga Gomes
- Logan Ail Bernardes Borges
- Rogério de Abreu Mar

## Vídeo de apresentação

Link do YouTube: _(a ser adicionado)_

## Índice

1. [Como rodar este projeto](#1-como-rodar-este-projeto)
2. [Como usar a biblioteca em outro projeto](#2-como-usar-a-biblioteca-em-outro-projeto)
3. [Uso padrão](#3-uso-padrão-out-of-the-box)
4. [Uso estendido](#4-uso-estendido-sem-alterar-a-lib)
5. [API resumida](#5-api-resumida)
6. [Padrões de projeto](#6-padrões-de-projeto-utilizados)
7. [Estrutura do repositório](#7-estrutura-do-repositório)

---

## 1. Como rodar este projeto

Requisito: Node.js 18 ou superior. Execute cada comando em uma linha separada, na pasta do projeto:

```bash
npm install
npm test
npm run example:basic
npm run example:custom
```

| Comando | O que faz |
|---|---|
| `npm install` | Instala as dependências de desenvolvimento (`typescript` e `@types/node`) |
| `npm test` | Compila e executa os testes automatizados (`node:test`) |
| `npm run example:basic` | Executa o exemplo de **uso padrão** (`examples/basic.ts`) |
| `npm run example:custom` | Executa o exemplo em que o **cliente estende a lib** (`examples/custom.ts`) |
| `npm run build` | Apenas compila para a pasta `dist/` |

## 2. Como usar a biblioteca em outro projeto

Depois de publicada no npm:

```bash
npm install logweave
```

Enquanto não estiver publicada, gere um pacote local (`.tgz`) a partir da pasta da biblioteca e instale-o no outro projeto.

**Passo 1: gerar o pacote** (na pasta da biblioteca). Isso cria o arquivo `logweave-0.1.0.tgz` nessa mesma pasta:

```powershell
cd C:\_PUCPR\sexto-semestre\design-patterns\logweave
npm install
npm pack
```

**Passo 2: instalar no outro projeto** (exemplo com o caminho do `ai-interaction-framework`):

```powershell
cd C:\_PUCPR\cre\ai-interaction-framework
npm install C:\_PUCPR\sexto-semestre\design-patterns\logweave\logweave-0.1.0.tgz
```

Em um monorepo que usa **pnpm**, instale no pacote desejado (substitua `<nome-do-pacote>` pelo campo `name` do `package.json` dele):

```powershell
pnpm add C:\_PUCPR\sexto-semestre\design-patterns\logweave\logweave-0.1.0.tgz --filter <nome-do-pacote>
```

**Passo 3: importar e usar:**

```ts
import { LoggerBuilder } from "logweave";

const log = new LoggerBuilder("app").build();
log.info("Funcionou!");
```

Se alterar a biblioteca, rode `npm pack` de novo e reinstale o `.tgz` no outro projeto.

## 3. Uso padrão (out-of-the-box)

A biblioteca já vem com appenders, formatters e interceptors prontos.

```ts
import {
  LoggerBuilder, LogLevel, TextFormatter, JsonFormatter,
  RedactDecorator, TimestampDecorator,
} from "logweave";

// Sem configuração: escreve no console, nível INFO.
const log = new LoggerBuilder("app").build();
log.info("Aplicação iniciada");

// Configurado: vários destinos, formatos e máscara de dados sensíveis.
const auth = new LoggerBuilder("auth")
  .level(LogLevel.DEBUG)
  .appenderOf("console", {
    formatter: new TimestampDecorator(new RedactDecorator(new TextFormatter())),
  })
  .appenderOf("file", { path: "auth.log", formatter: new JsonFormatter(), level: LogLevel.WARN })
  .build();

auth.info("Login realizado", { user: "alex", password: "123456" }); // password sai como "***"
auth.error("Falha ao autenticar", new Error("token expirado"));
```

Logger compartilhado por todo o processo:

```ts
import { LogManager } from "logweave";

LogManager.getInstance().register(auth);
LogManager.getInstance().getLogger("auth").warn("chamado de qualquer módulo");
```

Itens prontos para uso:

| Categoria | Implementações |
|---|---|
| Appenders (nomes: `"console"`, `"memory"`, `"file"`) | `ConsoleAppender`, `MemoryAppender`, `FileAppender` |
| Formatters | `TextFormatter`, `JsonFormatter` |
| Decorators de formatter | `TimestampDecorator`, `RedactDecorator` |
| Interceptors | `LevelFilterInterceptor`, `SamplingInterceptor`, `BlockListInterceptor` |

## 4. Uso estendido (sem alterar a lib)

O desenvolvedor cliente cria as próprias classes e as pluga na biblioteca:

```ts
import {
  AppenderFactory, BaseAppender, Formatter, Interceptor, LogEvent, LoggerBuilder,
} from "logweave";

// Novo destino: basta implementar `write`.
class WebhookAppender extends BaseAppender {
  protected write(line: string): void {
    /* enviar `line` para o webhook */
  }
}

// Novo formato.
class CsvFormatter implements Formatter {
  format(e: LogEvent): string {
    return `${e.timestamp.toISOString()};${e.level};${e.message}`;
  }
}

// Novo elo da corrente de interceptors.
class EnvInterceptor extends Interceptor {
  protected process(e: LogEvent): LogEvent | null {
    return { ...e, context: { ...e.context, env: "dev" } };
  }
}

// Cadastra o novo tipo na fábrica: agora "webhook" pode ser usado por nome.
AppenderFactory.register("webhook", (config) => new WebhookAppender(config));

const log = new LoggerBuilder("pagamentos")
  .interceptor(new EnvInterceptor())
  .appenderOf("webhook", { formatter: new CsvFormatter() })
  .build();

log.info("Pagamento aprovado", { valor: 49.9 });
```

O exemplo completo e executável está em `examples/custom.ts` (`npm run example:custom`).

## 5. API resumida

- `new LoggerBuilder(nome)`: `.level()`, `.appender()`, `.appenderOf(tipo, config)`, `.interceptor()`, `.build()`
- `Logger`: `debug`, `info`, `warn`, `error`, `log`, `subscribe(appender)` (devolve uma função que cancela a inscrição) e `unsubscribe`
- `LogManager.getInstance()`: `register`, `getLogger`, `has`, `clear`
- `AppenderFactory`: `register(tipo, creator)`, `create(tipo, config)`, `types()`
- `Interceptor`: estenda e implemente `process(event)`; devolva o evento para seguir ou `null` para descartá-lo
- `BaseAppender`: estenda e implemente `write(line, event)`; opcionalmente sobrescreva `onError`
- `Formatter`: implemente `format(event)`

## 6. Padrões de projeto utilizados

| # | Padrão | Arquivo | Problema resolvido | Responsável |
|---|---|---|---|---|
| 1 | Builder | `src/core/LoggerBuilder.ts` | Configurar um logger com muitas opções opcionais sem um construtor gigante | Alex |
| 2 | Singleton | `src/core/LogManager.ts` | Ponto único e compartilhado de acesso aos loggers do processo | Alex |
| 3 | Strategy | `src/formatters/Formatter.ts` | Trocar o formato de saída sem alterar o logger | Felipe |
| 4 | Decorator | `src/formatters/FormatterDecorator.ts` | Combinar comportamentos (data, máscara) empilhando formatters | Felipe |
| 5 | Observer | `src/core/Logger.ts` | Notificar vários destinos e plugar novos sem alterar o logger | Logan |
| 6 | Template Method | `src/appenders/BaseAppender.ts` | Reaproveitar o fluxo fixo do appender; o cliente implementa só `write` | Logan |
| 7 | Chain of Responsibility | `src/interceptors/Interceptor.ts` | Filtrar, amostrar ou alterar eventos em elos encadeáveis | Rogério |
| 8 | Factory + Registry | `src/factory/AppenderFactory.ts` | Criar appenders por nome e aceitar tipos novos (Open/Closed) | Rogério |

## 7. Estrutura do repositório

```
src/
  core/          Logger, LoggerBuilder, LogManager, LogEvent, LogLevel
  appenders/     Appender, BaseAppender, Console/Memory/FileAppender
  formatters/    Formatter, Text/JsonFormatter, decorators
  interceptors/  Interceptor, LevelFilter, Sampling, BlockList
  factory/       AppenderFactory
  index.ts       API pública
examples/        basic.ts (uso padrão) e custom.ts (uso estendido)
test/            testes com node:test
```