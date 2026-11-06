export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

export const LogLevel = {
  Debug: 0,
  Info: 1,
  Warn: 2,
  Error: 3,
  None: 4,
} as const;

export type LogSink = (level: LogLevel, data: any[]) => void;

export class Logger {
  public level: LogLevel;

  constructor(level: LogLevel) {
    this.level = level;
  }

  debug(...data: any[]) {
    if (this.level <= LogLevel.Debug) console.debug(data);
  }

  info(...data: any[]) {
    if (this.level <= LogLevel.Info) console.info(data);
  }

  warn(...data: any[]) {
    if (this.level <= LogLevel.Warn) console.warn(data);
  }

  error(...data: any[]) {
    if (this.level <= LogLevel.Error) console.error(data);
  }
}
