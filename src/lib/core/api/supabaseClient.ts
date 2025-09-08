// Konfigurasi Supabase untuk merchantportal-client
// Buat file ini di src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";
import { log, error } from "../utils/logger";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  error("Supabase env vars missing", { supabaseUrl, supabaseAnonKey });
} else {
  log("Supabase env vars loaded", { supabaseUrl });
}
log("Creating Supabase client", { supabaseUrl });
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
