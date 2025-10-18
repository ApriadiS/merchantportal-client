import { useState, useEffect } from "react";
import { PromoResponse } from "@/utils/interface";
import { getPromoById } from "@/services/api/promos";

export function usePromo(promoId?: string) {
  const [promo, setPromo] = useState<PromoResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!promoId) {
      setPromo(null);
      return;
    }

    const fetchPromo = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPromoById(promoId);
        setPromo(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch promo"));
      } finally {
        setLoading(false);
      }
    };

    fetchPromo();
  }, [promoId]);

  return { promo, loading, error };
}
