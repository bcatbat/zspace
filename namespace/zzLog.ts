namespace zz {
  export enum LogLevel {
    Log = 0,
    Warn,
    Error,
    No,
  }
  /**0 */
  export const logLevel = LogLevel.Log;
  export function log(...data: any[]) {
    if (logLevel <= LogLevel.Log) console.log(...data);
  }
  export function warn(...data: any[]) {
    if (logLevel <= LogLevel.Warn) console.warn(...data);
  }
  export function error(...data: any[]) {
    if (logLevel <= LogLevel.Error) console.error(...data);
  }
  export function assertEqual(a: any, b: any, msg: string) {
    console.assert(a == b, msg);
  }
}
