import { useState, useEffect } from "react";
import { PromoTenor } from "@/types";
import { getAllPromoTenors } from "@/services/api/promo_tenor";

export function usePromoTenors(promoId?: string) {
  const [tenors, setTenors] = useState<PromoTenor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!promoId) {
      setTenors([]);
      return;
    }

    const fetchTenors = async () => {
      setLoading(true);
      setError(null);
      try {
        const allTenors = await getAllPromoTenors();
        const data = allTenors.filter(t => t.promo_id === promoId);
        setTenors(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch tenors"));
      } finally {
        setLoading(false);
      }
    };

    fetchTenors();
  }, [promoId]);

  return { tenors, loading, error };
}
