interface CacheEntry {
   data: unknown;
   timestamp: number;
}

class ApiCache {
   private cache = new Map<string, CacheEntry>();
   private ttl: Record<string, number> = {
      "/get-store": 5 * 60 * 1000,
      "/get-promo": 5 * 60 * 1000,
      "/get-promo-store": 5 * 60 * 1000,
      "/get-promo-tenor": 10 * 60 * 1000,
   };

   private getBasePath(endpoint: string): string {
      const path = endpoint.split("?")[0];
      for (const key of Object.keys(this.ttl)) {
         if (path.startsWith(key)) return key;
      }
      return path;
   }

   get<T>(endpoint: string): T | null {
      const entry = this.cache.get(endpoint);
      if (!entry) return null;

      const basePath = this.getBasePath(endpoint);
      const ttl = this.ttl[basePath] || 5 * 60 * 1000;
      const isExpired = Date.now() - entry.timestamp > ttl;

      if (isExpired) {
         this.cache.delete(endpoint);
         return null;
      }

      return entry.data as T;
   }

   set(endpoint: string, data: unknown): void {
      this.cache.set(endpoint, {
         data,
         timestamp: Date.now(),
      });
   }

   invalidate(pattern: string): void {
      const keys = Array.from(this.cache.keys());
      for (const key of keys) {
         if (key.includes(pattern)) {
            this.cache.delete(key);
         }
      }
   }

   clear(): void {
      this.cache.clear();
   }
}

export const apiCache = new ApiCache();
