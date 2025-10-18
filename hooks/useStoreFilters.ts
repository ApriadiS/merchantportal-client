import { useState, useEffect, useMemo } from "react";
import { StoreResponse } from "@/utils/interface";

const STORAGE_KEY = "store:list:filters";

export function useStoreFilters(stores: StoreResponse[]) {
  const [q, setQ] = useState("");
  const [filterCompany, setFilterCompany] = useState<string | "">("");
  const [filterRoute, setFilterRoute] = useState("");

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.q) setQ(parsed.q);
      if (parsed.filterCompany) setFilterCompany(parsed.filterCompany);
      if (parsed.filterRoute) setFilterRoute(parsed.filterRoute);
    } catch (err) {
      console.warn("Could not load persisted store filters", err);
    }
  }, []);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ q, filterCompany, filterRoute }));
    } catch {}
  }, [q, filterCompany, filterRoute]);

  const filtered = useMemo(() => {
    return stores.filter((s) => {
      const term = q.trim().toLowerCase();
      if (term) {
        const matches =
          s.name.toLowerCase().includes(term) ||
          s.company.toLowerCase().includes(term) ||
          (s.route || "").toLowerCase().includes(term);
        if (!matches) return false;
      }

      if (filterCompany && s.company !== filterCompany) return false;
      if (filterRoute && !(s.route || "").toLowerCase().includes(filterRoute.toLowerCase())) return false;

      return true;
    });
  }, [stores, q, filterCompany, filterRoute]);

  const resetFilters = () => {
    setQ("");
    setFilterCompany("");
    setFilterRoute("");
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  };

  return { q, setQ, filterCompany, setFilterCompany, filterRoute, setFilterRoute, filtered, resetFilters };
}
