import supabaseClient from "@services/supabase/supabaseClient";

/**
 * Client-side wrappers for Supabase Auth.
 * Keep all auth access through this module so you can later swap implementations
 * or add server-side wrappers in the same folder.
 */
export async function signInClient(email: string, password: string) {
   return supabaseClient.auth.signInWithPassword({ email, password });
}

export async function signOutClient() {
   return supabaseClient.auth.signOut();
}

export async function getSessionClient() {
   return supabaseClient.auth.getSession();
}

// Server-side helper (may return null unless server-side cookies are set)
export async function getSessionServer() {
   return supabaseClient.auth.getSession();
}

const auth = {
   signInClient,
   signOutClient,
   getSessionClient,
   getSessionServer,
};

export default auth;
