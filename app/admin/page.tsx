import LoginClient from "@components/Auth/LoginClient";
export default function AdminPage() {
   // Server-side session detection may not be available in this setup
   // (Supabase session cookies may not be set). Rely on client-side
   // checks inside `LoginClient` to redirect when appropriate.

   return <LoginClient />;
}
