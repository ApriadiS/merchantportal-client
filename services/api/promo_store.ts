import { apiRequest } from "./client";
import type { PromoStore, CreatePromoStorePayload, UpdatePromoStorePayload } from "@/types";

// ============================================================================
// Protected Endpoints (Auth Required)
// ============================================================================

export async function getAllPromoStores(filter?: { promo_id?: string; store_id?: string }): Promise<PromoStore[]> {
   const params = new URLSearchParams();
   if (filter?.promo_id) params.append("promo_id", filter.promo_id);
   if (filter?.store_id) params.append("store_id", filter.store_id);
   const query = params.toString();
   return apiRequest<PromoStore[]>(`/get-promo-store${query ? `?${query}` : ""}`);
}

export async function getPromoStoresByPromo(promoId: string): Promise<PromoStore[]> {
   return apiRequest<PromoStore[]>(`/get-promo-store?promo_id=${promoId}`);
}

export async function getPromoStoresByStore(storeId: string): Promise<PromoStore[]> {
   return apiRequest<PromoStore[]>(`/get-promo-store?store_id=${storeId}`);
}

export async function getPromoStore(promoId: string, storeId: string): Promise<PromoStore> {
   const key = `${promoId}-${storeId}`;
   try {
      return await apiRequest<PromoStore>(`/get-promo-store/${key}`);
   } catch (err) {
      console.error("getPromoStore error:", err);
      return { id: "", promo_id: promoId, store_id: storeId, tenor_ids: null };
   }
}

export async function createPromoStore(payload: CreatePromoStorePayload): Promise<PromoStore> {
   return apiRequest<PromoStore>("/create-promo-store", {
      method: "POST",
      body: JSON.stringify(payload),
   });
}

export async function updatePromoStore(
   promoId: string,
   storeId: string,
   payload: UpdatePromoStorePayload
): Promise<PromoStore> {
   const key = `${promoId}-${storeId}`;
   return apiRequest<PromoStore>(`/update-promo-store/${key}`, {
      method: "PUT",
      body: JSON.stringify(payload),
   });
}

export async function deletePromoStore(promoId: string, storeId: string): Promise<void> {
   const key = `${promoId}-${storeId}`;
   return apiRequest<void>(`/delete-promo-store/${key}`, {
      method: "DELETE",
   });
}
