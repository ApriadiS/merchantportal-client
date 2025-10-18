import { createClient } from "@/services/supabase/client";

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
         const supabase = createClient();
         await supabase.auth.signOut();
         window.location.href = "/admin";
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

   return response.json();
}
