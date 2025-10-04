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
      <div className="min-h-screen flex items-center justify-center">
         <Loading />
      </div>
   ) : (
      <div className="min-h-screen flex items-center justify-center p-6">
         <main className="w-full max-w-md bg-white rounded-lg shadow-red-500 shadow-2xl p-6">
            <h1 className="text-center font-bold text-3xl mb-4">Admin Login</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700">
                     Email
                  </label>
                  <input
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full mt-1 px-3 py-2 border rounded"
                     required
                  />
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700">
                     Password
                  </label>
                  <input
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="w-full mt-1 px-3 py-2 border rounded"
                     required
                  />
               </div>

               {error && <p className="text-sm text-red-600">{error}</p>}

               <div>
                  <button
                     type="submit"
                     disabled={submitting}
                     className="w-full  text-white py-2 rounded font-bold"
                  >
                     {submitting ? "Memproses..." : "Masuk"}
                  </button>
               </div>
            </form>
         </main>
      </div>
   );
}
