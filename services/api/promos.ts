import { apiRequest } from "./client";
import type { PromoResponse } from "@/utils/interface";

export async function getAllPromos(): Promise<PromoResponse[]> {
   return apiRequest<PromoResponse[]>("/get-promo");
}

export async function getPromoByVoucher(voucher: string): Promise<PromoResponse> {
   return apiRequest<PromoResponse>(`/get-promo/${voucher}`);
}

export async function createPromo(payload: Partial<PromoResponse>): Promise<PromoResponse> {
   return apiRequest<PromoResponse>("/create-promo", {
      method: "POST",
      body: JSON.stringify(payload),
   });
}

export async function updatePromo(voucher: string, payload: Partial<PromoResponse>): Promise<PromoResponse> {
   return apiRequest<PromoResponse>(`/update-promo/${voucher}`, {
      method: "PUT",
      body: JSON.stringify(payload),
   });
}

export async function deletePromo(voucher: string): Promise<void> {
   return apiRequest<void>(`/delete-promo/${voucher}`, {
      method: "DELETE",
   });
}

export async function getPromosByStoreId(storeId: number): Promise<PromoResponse[]> {
   return apiRequest<PromoResponse[]>(`/get-promo?store_id=${storeId}`);
}
