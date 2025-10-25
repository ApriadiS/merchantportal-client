import { useState, useEffect, useMemo } from "react";
import { PromoResponse } from "@/utils/interface";

const STORAGE_KEY = "promo:list:filters";

export function usePromoFilters(promos: PromoResponse[]) {
   const [q, setQ] = useState("");
   const [filterAdminType, setFilterAdminType] = useState<string | "">("");
   const [filterActive, setFilterActive] = useState<boolean | "">("");

   useEffect(() => {
      try {
         if (typeof window === "undefined") return;
         const raw = localStorage.getItem(STORAGE_KEY);
         if (!raw) return;
         const parsed = JSON.parse(raw);
         if (parsed.q) setQ(parsed.q);
         if (parsed.filterAdminType) setFilterAdminType(parsed.filterAdminType);
         if (parsed.filterActive !== undefined)
            setFilterActive(parsed.filterActive);
      } catch (err) {
         console.warn("Could not load persisted promo filters", err);
      }
   }, []);

   useEffect(() => {
      try {
         if (typeof window === "undefined") return;
         localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ q, filterAdminType, filterActive })
         );
      } catch {}
   }, [q, filterAdminType, filterActive]);

   const filtered = useMemo(() => {
      return promos.filter((p) => {
         const term = q.trim().toLowerCase();
         if (term) {
            const matches =
               (p.title_promo || "").toLowerCase().includes(term);
            if (!matches) return false;
         }

         if (filterAdminType && p.admin_promo_type !== filterAdminType)
            return false;
         if (
            filterActive !== "" &&
            Boolean(p.is_active) !== Boolean(filterActive)
         )
            return false;

         return true;
      });
   }, [promos, q, filterAdminType, filterActive]);

   const resetFilters = () => {
      setQ("");
      setFilterAdminType("");
      setFilterActive("");
      try {
         if (typeof window !== "undefined") {
            localStorage.removeItem(STORAGE_KEY);
         }
      } catch {}
   };

   return {
      q,
      setQ,
      filterAdminType,
      setFilterAdminType,
      filterActive,
      setFilterActive,
      filtered,
      resetFilters,
   };
}
