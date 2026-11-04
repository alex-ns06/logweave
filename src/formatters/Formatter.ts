import { LogEvent } from "../core/LogEvent";

/** PADRÃO: Strategy. Cada implementação é um jeito intercambiável de transformar o evento em texto. */
export interface Formatter {
  format(event: LogEvent): string;
}
