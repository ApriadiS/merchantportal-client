import { apiRequest } from "./client";

export interface PromoStoreResponse {
   promo_id: number;
   store_id: number;
}

export async function getAllPromoStores(): Promise<PromoStoreResponse[]> {
   return apiRequest<PromoStoreResponse[]>("/get-promo-store");
}

export async function getPromoStoresByPromo(promoId: number): Promise<PromoStoreResponse[]> {
   return apiRequest<PromoStoreResponse[]>(`/get-promo-store?promo_id=${promoId}`);
}

export async function getPromoStoresByStore(storeId: number): Promise<PromoStoreResponse[]> {
   return apiRequest<PromoStoreResponse[]>(`/get-promo-store?store_id=${storeId}`);
}

export async function getPromoStore(promoId: number, storeId: number): Promise<PromoStoreResponse> {
   const key = `${promoId}-${storeId}`;
   return apiRequest<PromoStoreResponse>(`/get-promo-store/${key}`);
}

export async function createPromoStore(payload: PromoStoreResponse): Promise<PromoStoreResponse> {
   return apiRequest<PromoStoreResponse>("/create-promo-store", {
      method: "POST",
      body: JSON.stringify(payload),
   });
}

export async function updatePromoStore(promoId: number, storeId: number, payload: Partial<PromoStoreResponse>): Promise<PromoStoreResponse> {
   const key = `${promoId}-${storeId}`;
   return apiRequest<PromoStoreResponse>(`/update-promo-store/${key}`, {
      method: "PUT",
      body: JSON.stringify(payload),
   });
}

export async function deletePromoStore(promoId: number, storeId: number): Promise<void> {
   const key = `${promoId}-${storeId}`;
   return apiRequest<void>(`/delete-promo-store/${key}`, {
      method: "DELETE",
   });
}
