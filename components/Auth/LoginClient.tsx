"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import auth from "@services/auth";
import Loading from "@components/shared/Loading";

export default function LoginClient() {
   const router = useRouter();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(true);
   const [submitting, setSubmitting] = useState(false);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      let mounted = true;
      (async () => {
         try {
            const {
               data: { session },
            } = await auth.getSessionClient();
            if (!mounted) return;
            if (session) router.replace("/admin-dashboard");
         } catch (err) {
            console.error(err);
         } finally {
            if (mounted) setLoading(false);
         }
      })();

      return () => {
         mounted = false;
      };
   }, [router]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      if (!email) return setError("Email diperlukan");
      if (!password) return setError("Password diperlukan");

      setSubmitting(true);
      try {
         const { data, error: authError } = await auth.signInClient(
            email,
            password
         );
         if (authError) {
            setError(authError.message || "Gagal login");
            return;
         }
         if (data?.session) router.replace("/admin-dashboard");
         else setError("Gagal mendapatkan session");
      } catch (err) {
         console.error(err);
         setError("Terjadi kesalahan saat login");
      } finally {
         setSubmitting(false);
      }
   };

   return loading ? (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
         <Loading />
      </div>
   ) : (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-red-50 to-red-100">
         <main className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-red-100">
            <div className="text-center mb-8">
               <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
               </div>
               <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Login</h1>
               <p className="text-sm text-gray-500">Masuk ke dashboard admin</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                     Email
                  </label>
                  <input
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="admin@example.com"
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                     required
                  />
               </div>

               <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                     Password
                  </label>
                  <input
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="••••••••"
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                     required
                  />
               </div>

               {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                     {error}
                  </div>
               )}

               <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
               >
                  {submitting ? (
                     <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Memproses...
                     </span>
                  ) : (
                     "Masuk"
                  )}
               </button>
            </form>
         </main>
      </div>
   );
}
