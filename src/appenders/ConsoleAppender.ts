import { LogEvent } from "../core/LogEvent";
import { LogLevel } from "../core/LogLevel";
import { BaseAppender } from "./BaseAppender";

export class ConsoleAppender extends BaseAppender {
  protected write(line: string, event: LogEvent): void {
    (event.level >= LogLevel.WARN ? console.error : console.log)(line);
  }
}
