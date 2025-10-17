"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSessionClient } from "@services/auth";
import Loading from "@components/shared/Loading";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
   const router = useRouter();
   const [loading, setLoading] = useState(true);
   const [authenticated, setAuthenticated] = useState(false);

   useEffect(() => {
      let mounted = true;

      const checkAuth = async () => {
         try {
            const { data: { session } } = await getSessionClient();
            
            if (!mounted) return;

            if (!session) {
               router.replace("/admin");
               return;
            }

            setAuthenticated(true);
         } catch (error) {
            console.error("Auth check failed:", error);
            if (mounted) {
               router.replace("/admin");
            }
         } finally {
            if (mounted) {
               setLoading(false);
            }
         }
      };

      checkAuth();

      return () => {
         mounted = false;
      };
   }, [router]);

   if (loading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <Loading label="Memeriksa autentikasi..." />
         </div>
      );
   }

   if (!authenticated) {
      return null;
   }

   return <>{children}</>;
}
