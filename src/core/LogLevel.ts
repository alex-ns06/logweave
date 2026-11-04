export enum LogLevel {
  DEBUG = 10,
  INFO = 20,
  WARN = 30,
  ERROR = 40,
}

export const levelName = (level: LogLevel): string => LogLevel[level] ?? String(level);
