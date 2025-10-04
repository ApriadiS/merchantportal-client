/* eslint-disable @typescript-eslint/no-explicit-any */

type Meta = Record<string, any>;
// Lightweight console-based logger to replace Winston.
// Keeps the same surface used across the codebase: info/warn/error/debug/child/stream

class ConsoleLogger {
   private prefix?: string;

   constructor(prefix?: string) {
      this.prefix = prefix;
   }

   private formatArgs(message: any, meta?: Meta) {
      const prefix = this.prefix ? `[${this.prefix}] ` : "";
      if (meta && Object.keys(meta).length) {
         return [prefix + message, meta];
      }
      return [prefix + message];
   }

   async info(message: any, meta?: Meta) {
      console.info(...this.formatArgs(message, meta));
   }

   async warn(message: any, meta?: Meta) {
      console.warn(...this.formatArgs(message, meta));
   }

   async error(message: any, meta?: Meta) {
      if (message instanceof Error) {
         console.error(this.prefix ? `[${this.prefix}]` : "", message);
      } else {
         console.error(...this.formatArgs(message, meta));
      }
   }

   async debug(message: any, meta?: Meta) {
      // Use console.debug when available; fall back to console.log
      if (console.debug) console.debug(...this.formatArgs(message, meta));
      else console.log(...this.formatArgs(message, meta));
   }

   child(bindings: Record<string, any>) {
      const childPrefix =
         bindings && bindings.name ? String(bindings.name) : undefined;
      return new ConsoleLogger(childPrefix || this.prefix);
   }

   get stream() {
      return {
         write: (msg: string) => {
            // Trim trailing newlines
            const m = msg?.toString?.().trim();
            if (m) this.info(m);
         },
      };
   }
}

// Export a singleton that matches the previous 'winston' default export shape.
// Files that `await winston.error(...)` will still work because methods return Promises.
const logger = new ConsoleLogger();
export default logger;
