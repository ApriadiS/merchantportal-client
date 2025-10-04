"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@components/shared/Loading";
import auth from "@services/auth";

export default function DashboardClient() {
   const router = useRouter();
   const [onMount, setOnMount] = useState(true);

   useEffect(() => {
      let mounted = true;
      (async () => {
         try {
            const {
               data: { session },
            } = await auth.getSessionClient();
            if (!mounted) return;
            if (!session) {
               router.replace("/admin");
               return;
            }
         } catch (err) {
            console.error(err);
            router.replace("/admin");
         } finally {
            if (mounted) setOnMount(false);
            router.replace("/admin-dashboard/store");
         }
      })();

      return () => {
         mounted = false;
      };
   }, [router]);

   const handleSignOut = async () => {
      await auth.signOutClient();
      router.replace("/admin");
   };

   return (
      <>
         {onMount ? (
            <Loading label="Memuat data..." speed={1.4} />
         ) : (
            <div className="min-h-screen flex items-center justify-center p-6">
               <main className="w-full max-w-2xl bg-white rounded-lg shadow p-6">
                  <h1 className="text-xl font-semibold mb-4">
                     Admin Dashboard
                  </h1>
                  <p className="mb-4">Selamat datang. Anda terautentikasi.</p>
                  <div className="flex gap-2">
                     <button
                        onClick={handleSignOut}
                        className="px-4 py-2 rounded  text-white"
                     >
                        Keluar
                     </button>
                  </div>
               </main>
            </div>
         )}
      </>
   );
}
