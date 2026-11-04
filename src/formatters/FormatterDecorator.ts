import { LogEvent } from "../core/LogEvent";
import { Formatter } from "./Formatter";

/**
 * PADRÃO: Decorator. Envolve outro Formatter, tem a mesma interface e acrescenta
 * comportamento antes/depois. Decorators podem ser empilhados em qualquer ordem.
 */
export abstract class FormatterDecorator implements Formatter {
  constructor(protected readonly inner: Formatter) {}
  abstract format(event: LogEvent): string;
}
