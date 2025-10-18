import type { StoreResponse, PromoResponse } from "@/utils/interface";
import type { PromoTenor } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function getStoreByRoutePublic(route: string): Promise<StoreResponse | null> {
   const response = await fetch(`${API_URL}/get-store/${route}`);
   
   if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`API Error: ${response.statusText}`);
   }
   
   return response.json();
}

export async function getPromoByVoucherPublic(voucher: string): Promise<PromoResponse | null> {
   const response = await fetch(`${API_URL}/get-promo/${voucher}`);
   
   if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`API Error: ${response.statusText}`);
   }
   
   return response.json();
}

export async function getPromosByStoreIdPublic(storeId: number): Promise<PromoResponse[]> {
   const response = await fetch(`${API_URL}/get-promo?store_id=${storeId}`);
   
   if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(`API Error: ${response.statusText}`);
   }
   
   return response.json();
}

export async function getPromoTenorsByStoreIdPublic(storeId: string): Promise<PromoTenor[]> {
   const response = await fetch(`${API_URL}/get-promo-tenor-by-store/${storeId}`);
   
   if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(`API Error: ${response.statusText}`);
   }
   
   return response.json();
}
