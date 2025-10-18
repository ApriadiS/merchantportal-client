import { apiRequest } from "./client";
import type {
  PromoTenor,
  CreatePromoTenorPayload,
  UpdatePromoTenorPayload,
} from "@/types";

// ============================================================================
// Public Endpoints (No Auth)
// ============================================================================

export async function getAllPromoTenors(filter?: { promo_id?: string; tenor?: number; voucher?: string }): Promise<PromoTenor[]> {
  const params = new URLSearchParams();
  if (filter?.promo_id) params.append("promo_id", filter.promo_id);
  if (filter?.tenor) params.append("tenor", String(filter.tenor));
  if (filter?.voucher) params.append("voucher", filter.voucher);
  const query = params.toString();
  return apiRequest<PromoTenor[]>(`/get-promo-tenor${query ? `?${query}` : ""}`);
}

export async function getPromoTenorsByPromoId(promoId: string): Promise<PromoTenor[]> {
  return apiRequest<PromoTenor[]>(`/get-promo-tenor?promo_id=${promoId}`);
}

export async function getPromoTenorsByTenor(tenor: number): Promise<PromoTenor[]> {
  return apiRequest<PromoTenor[]>(`/get-promo-tenor?tenor=${tenor}`);
}

export async function getPromoTenorsByVoucher(voucher: string): Promise<PromoTenor[]> {
  return apiRequest<PromoTenor[]>(`/get-promo-tenor?voucher=${voucher}`);
}

// ============================================================================
// Protected Endpoints (Auth Required)
// ============================================================================

export async function getPromoTenorById(id: string): Promise<PromoTenor> {
  return apiRequest<PromoTenor>(`/get-promo-tenor/${id}`);
}

export async function createPromoTenor(payload: CreatePromoTenorPayload): Promise<PromoTenor> {
  return apiRequest<PromoTenor>("/create-promo-tenor", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updatePromoTenor(
  id: string,
  payload: UpdatePromoTenorPayload
): Promise<PromoTenor> {
  return apiRequest<PromoTenor>(`/update-promo-tenor/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deletePromoTenor(id: string): Promise<void> {
  return apiRequest<void>(`/delete-promo-tenor/${id}`, {
    method: "DELETE",
  });
}
