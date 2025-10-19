import { useState, useEffect, useCallback } from "react";
import { StoreResponse } from "@/utils/interface";
import { getAllStores } from "@/services/api/stores";

export function useStoreList() {
  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await getAllStores();
      const sorted = (rows as unknown as StoreResponse[]).sort((a, b) => a.name.localeCompare(b.name));
      setStores(sorted);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch stores"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const addStore = useCallback((store: StoreResponse) => {
    setStores((prev) => [store, ...prev]);
  }, []);

  const updateStore = useCallback((store: StoreResponse) => {
    setStores((prev) => prev.map((it) => (it.id === store.id ? store : it)));
  }, []);

  const removeStore = useCallback((route: string) => {
    setStores((prev) => prev.filter((s) => s.route !== route));
  }, []);

  return { stores, loading, error, refetch: fetchStores, addStore, updateStore, removeStore };
}
