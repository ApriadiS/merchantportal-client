import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Note: avoid importing the server-only logger here (it uses winston and Node
// built-ins). This module is imported by client-side code (auth client wrappers)
// so we dynamically import the logger only when running on the server.

// Prefer NEXT_PUBLIC_* for client usage; fall back to server env names
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
   // server-only logging (do not import in client bundle)
   if (typeof window === "undefined") {
      import("@utils/logging")
         .then((mod) =>
            mod.default?.error?.("Supabase environment variables are not set", {
               NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
               NEXT_PUBLIC_SUPABASE_ANON_KEY:
                  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            })
         )
         .catch(() => {});
   }
   throw new Error(
      "Supabase environment variables are not set. Define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_URL and SUPABASE_ANON_KEY)."
   );
}

export const supabaseClient: SupabaseClient = createClient(
   supabaseUrl,
   supabaseAnonKey
);

// Log creation only on the server to avoid pulling logger into client bundles
if (typeof window === "undefined") {
   import("@utils/logging")
      .then((mod) =>
         mod.default?.info?.("Supabase client created", {
            url: supabaseUrl ? "(redacted)" : null,
         })
      )
      .catch(() => {});
}

export default supabaseClient;
