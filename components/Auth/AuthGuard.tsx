"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSessionClient } from "@services/auth";
import Loading from "@components/shared/Loading";
import { useToast } from "@/hooks/useToast-old";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
   const router = useRouter();
   const [loading, setLoading] = useState(true);
   const [authenticated, setAuthenticated] = useState(false);
   const { push: pushToast } = useToast();

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

      const handleAuthExpired = (event: Event) => {
         const customEvent = event as CustomEvent<{ message: string }>;
         pushToast({
            type: "error",
            message: customEvent.detail.message,
            duration: 3000,
         });
      };

      window.addEventListener("auth:expired", handleAuthExpired);

      return () => {
         mounted = false;
         window.removeEventListener("auth:expired", handleAuthExpired);
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
