"use server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createAuthedSupabaseClient() {
   const cookieStore = await cookies();

   const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
         // Ini adalah bagian yang diperbarui
         cookies: {
            get(name: string) {
               return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
               try {
                  cookieStore.set({ name, value, ...options });
               } catch {
                  // The `set` method was called from a Server Component.
                  // This can be ignored if you have middleware refreshing
                  // user sessions.
               }
            },
            remove(name: string, options: CookieOptions) {
               try {
                  cookieStore.set({ name, value: "", ...options });
               } catch {
                  // The `delete` method was called from a Server Component.
                  // This can be ignored if you have middleware refreshing
                  // user sessions.
               }
            },
         },
      }
   );

   // Bagian ini tetap sama
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) {
      throw new Error("User not authenticated. Access denied.");
   }

   return supabase;
}
