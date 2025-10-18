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
         const pRows = await getAllPromos();

         let psRows: Awaited<ReturnType<typeof getAllPromoStores>> = [];
         try {
            psRows = await getAllPromoStores();
         } catch {
            console.warn(
               "PromoStores not found (404), continuing with empty array"
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

         console.log("Mapped promos:", mappedPromos);
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

   const removePromo = useCallback((voucherCode: string) => {
      setPromos((prev) => prev.filter((s) => s.voucher_code !== voucherCode));
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
