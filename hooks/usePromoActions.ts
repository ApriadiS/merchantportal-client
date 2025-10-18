import { useState } from "react";
import { CreatePromoPayload, UpdatePromoPayload } from "@/types";
import { createPromo, updatePromo, deletePromo } from "@/services/api/promos";

export function usePromoActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (payload: CreatePromoPayload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createPromo(payload);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to create promo");
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, payload: UpdatePromoPayload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updatePromo(id, payload);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to update promo");
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
      await deletePromo(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to delete promo");
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { create, update, remove, loading, error };
}
