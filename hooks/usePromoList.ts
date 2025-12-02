import { useState, useEffect, useCallback } from "react";
import { PromoResponse } from "@/utils/interface";
import { getAllPromos } from "@/services/api/promos";
import { getAllPromoStores } from "@/services/api/promo_store";

type PromoWithCount = PromoResponse & { storeCount?: number };

export function usePromoList() {
   const [promos, setPromos] = useState<PromoWithCount[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<Error | null>(null);

   const fetchPromos = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
         console.log('🔵 Fetching promos...');
         const pRows = await getAllPromos();
         console.log('✅ Promos fetched:', pRows.length, 'items');

         let psRows: Awaited<ReturnType<typeof getAllPromoStores>> = [];
         try {
            console.log('🔵 Fetching promo stores...');
            const timeoutPromise = new Promise((_, reject) => 
               setTimeout(() => reject(new Error('Timeout')), 5000)
            );
            psRows = await Promise.race([
               getAllPromoStores(),
               timeoutPromise
            ]) as Awaited<ReturnType<typeof getAllPromoStores>>;
            console.log('✅ Promo stores fetched:', psRows.length, 'items');
         } catch (err) {
            console.warn(
               "PromoStores fetch failed, continuing with empty array:",
               err instanceof Error ? err.message : err
            );
         }

         const storesByPromo = new Map<string, number>();
         psRows.forEach((ps) => {
            storesByPromo.set(
               ps.promo_id,
               (storesByPromo.get(ps.promo_id) || 0) + 1
            );
         });

         const mappedPromos = (pRows as unknown as PromoResponse[]).map(
            (p) => ({
               ...p,
               storeCount: storesByPromo.get(String(p.id_promo)) || 0,
            })
         );
         mappedPromos.sort((a, b) => a.title_promo.localeCompare(b.title_promo));

         console.log("✅ Mapped promos:", mappedPromos.length, 'items');
         console.log("📊 Promo details:", mappedPromos);
         setPromos(mappedPromos);
      } catch (err) {
         console.error("Error fetching promos:", err);
         setError(
            err instanceof Error ? err : new Error("Failed to fetch promos")
         );
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      fetchPromos();
   }, [fetchPromos]);

   const addPromo = useCallback((promo: PromoResponse) => {
      setPromos((prev) => [{ ...promo, storeCount: 0 }, ...prev]);
   }, []);

   const updatePromo = useCallback((promo: PromoResponse) => {
      setPromos((prev) =>
         prev.map((it) =>
            it.id_promo === promo.id_promo
               ? { ...promo, storeCount: it.storeCount }
               : it
         )
      );
   }, []);

   const removePromo = useCallback((id: string) => {
      setPromos((prev) => prev.filter((s) => s.id_promo !== id));
   }, []);

   return {
      promos,
      loading,
      error,
      refetch: fetchPromos,
      addPromo,
      updatePromo,
      removePromo,
   };
}
