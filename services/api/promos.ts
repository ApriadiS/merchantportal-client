import { apiRequest } from "./client";
import type { PromoResponse, PromoRequest } from "@/utils/interface";

// ============================================================================
// Public Endpoints (No Auth)
// ============================================================================

export async function getPromosByStoreId(storeId: string): Promise<PromoResponse[]> {
   return apiRequest<PromoResponse[]>(`/get-promo?store_id=${storeId}`);
}

export async function getPromosByStoreIdPublic(storeId: string): Promise<PromoResponse[]> {
   const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
   const response = await fetch(`${API_URL}/get-promo?store_id=${storeId}`);
   if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(`API Error: ${response.statusText}`);
   }
   return response.json();
}

// ============================================================================
// Protected Endpoints (Auth Required)
// ============================================================================

export async function getAllPromos(): Promise<PromoResponse[]> {
   return apiRequest<Promo[]>("/get-promo");
}

export async function getPromoById(id: string): Promise<PromoResponse> {
   return apiRequest<Promo>(`/get-promo/${id}`);
}

export async function createPromo(payload: Partial<PromoRequest>): Promise<PromoResponse> {
   return apiRequest<Promo>("/create-promo", {
      method: "POST",
      body: JSON.stringify(payload),
   });
}

export async function updatePromo(id: string, payload: Partial<PromoRequest>): Promise<PromoResponse> {
   return apiRequest<Promo>(`/update-promo/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
   });
}

export async function deletePromo(id: string): Promise<void> {
   return apiRequest<void>(`/delete-promo/${id}`, {
      method: "DELETE",
   });
}
