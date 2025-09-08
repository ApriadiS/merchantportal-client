// Logger terstruktur dengan level dan timestamp
type LogLevel = "INFO" | "WARN" | "ERROR";

function formatLog(level: LogLevel, ...args: unknown[]) {
   const time = new Date().toISOString();
   return `[${level}] [${time}]`;
}

export function log(...args: unknown[]) {
   console.log(formatLog("INFO"), ...args);
}

export function warn(...args: unknown[]) {
   console.warn(formatLog("WARN"), ...args);
}

export function error(...args: unknown[]) {
   console.error(formatLog("ERROR"), ...args);
}
