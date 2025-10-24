import { createClient } from "@/services/supabase/client";
import { apiCache } from "@/utils/apiCache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getAuthToken(): Promise<string | null> {
   const supabase = createClient();
   const { data: { session } } = await supabase.auth.getSession();
   return session?.access_token || null;
}

export async function apiRequest<T>(
   endpoint: string,
   options: RequestInit = {}
): Promise<T> {
   const method = options.method || "GET";
   const cacheKey = `${method}:${endpoint}`;

   if (method === "GET") {
      const cached = apiCache.get<T>(cacheKey);
      if (cached) {
         return cached;
      }
   }

   const token = await getAuthToken();
   
   const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
   };

   if (token) {
      headers["Authorization"] = `Bearer ${token}`;
   }

   const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
   });

   if (!response.ok) {
      if (response.status === 401) {
         apiCache.clear();
         
         if (typeof window !== "undefined") {
            const event = new CustomEvent("auth:expired", {
               detail: { message: "Session expired. Please login again." }
            });
            window.dispatchEvent(event);
         }
         
         const supabase = createClient();
         await supabase.auth.signOut();
         
         if (typeof window !== "undefined") {
            setTimeout(() => {
               window.location.href = "/admin";
            }, 1000);
         }
         
         throw new Error("Session expired. Please login again.");
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
         const errorData = await response.json();
         throw new Error(`API Error: ${errorData.message || response.statusText}`);
      }
      throw new Error(`API Error: ${response.statusText} (${response.status})`);
   }

   const contentType = response.headers.get("content-type");
   if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`API returned non-JSON response. Is the backend running at ${API_URL}?`);
   }

   const data = await response.json();

   if (method === "GET") {
      apiCache.set(cacheKey, data);
   } else if (["POST", "PUT", "DELETE"].includes(method)) {
      const basePath = endpoint.split("?")[0];
      if (basePath.includes("/create-") || basePath.includes("/update-") || basePath.includes("/delete-")) {
         const resource = basePath.split("/")[1].replace("create-", "").replace("update-", "").replace("delete-", "");
         apiCache.invalidate(resource);
      }
   }

   return data;
}

export function invalidateCache(pattern: string): void {
   apiCache.invalidate(pattern);
}

export function clearCache(): void {
   apiCache.clear();
}
