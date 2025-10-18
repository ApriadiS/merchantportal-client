import { useState } from "react";
import { CreatePromoTenorPayload, UpdatePromoTenorPayload } from "@/types";
import { createPromoTenor, updatePromoTenor, deletePromoTenor } from "@/services/api/promo_tenor";

export function useTenorActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (payload: CreatePromoTenorPayload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createPromoTenor(payload);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to create tenor");
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, payload: UpdatePromoTenorPayload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updatePromoTenor(id, payload);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to update tenor");
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deletePromoTenor(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to delete tenor");
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { create, update, remove, loading, error };
}
