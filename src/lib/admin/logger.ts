// src/lib/logger.ts
// Simple logger utility for Svelte app

export function log(...args: unknown[]) {
   console.log("[LOG]", ...args);
}

export function warn(...args: unknown[]) {
   console.warn("[WARN]", ...args);
}

export function error(...args: unknown[]) {
   console.error("[ERROR]", ...args);
}

// You can extend this logger with more features as needed
