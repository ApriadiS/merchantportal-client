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
   
   const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
   };

   if (token) {
      headers["Authorization"] = `Bearer ${token}`;
   }

   const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
   });

   if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
   }

   return response.json();
}
