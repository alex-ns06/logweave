import { LogEvent } from "../core/LogEvent";

/**
 * PADRÃO: Chain of Responsibility. Cada elo decide em `process`:
 *  - devolver um evento (possivelmente alterado) -> segue para o próximo elo;
 *  - devolver null -> o evento é descartado e a corrente para.
 * O cliente cria novos elos estendendo esta classe.
 */
export abstract class Interceptor {
  private next?: Interceptor;

  /** Define o próximo elo e o devolve, permitindo `a.setNext(b).setNext(c)`. */
  setNext(next: Interceptor): Interceptor {
    this.next = next;
    return next;
  }

  handle(event: LogEvent): LogEvent | null {
    const result = this.process(event);
    if (result === null) return null;
    return this.next ? this.next.handle(result) : result;
  }

  protected abstract process(event: LogEvent): LogEvent | null;
}
