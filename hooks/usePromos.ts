import { useState, useEffect, useCallback } from "react";
import { Promo } from "@/types";
import { getAllPromos } from "@/services/api/promos";

export function usePromos() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPromos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllPromos();
      setPromos(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch promos"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  return { promos, loading, error, refetch: fetchPromos };
}
