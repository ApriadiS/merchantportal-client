import { useState, useEffect } from "react";
import { Promo, PromoTenor } from "@/types";
import { getPromoById } from "@/services/api/promos";
import { getAllPromoTenors } from "@/services/api/promo_tenor";

export function usePromoWithTenors(promoId?: string) {
  const [promo, setPromo] = useState<Promo | null>(null);
  const [tenors, setTenors] = useState<PromoTenor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!promoId) {
      setPromo(null);
      setTenors([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [promoData, allTenors] = await Promise.all([
          getPromoById(promoId),
          getAllPromoTenors()
        ]);
        const tenorData = allTenors.filter(t => t.promo_id === promoId);
        setPromo(promoData);
        setTenors(tenorData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch data"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [promoId]);

  const refetch = async () => {
    if (!promoId) return;
    setLoading(true);
    setError(null);
    try {
      const [promoData, allTenors] = await Promise.all([
        getPromoById(promoId),
        getAllPromoTenors()
      ]);
      const tenorData = allTenors.filter(t => t.promo_id === promoId);
      setPromo(promoData);
      setTenors(tenorData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch data"));
    } finally {
      setLoading(false);
    }
  };

  return { promo, tenors, loading, error, refetch };
}
