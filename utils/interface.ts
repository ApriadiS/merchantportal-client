/**
 * Interface definitions for backend v1.2.0
 * Synced with Rust API backend (UUID-based)
 * Only interfaces - types are in types/index.ts
 */

import type { AdminPromoType, DiscountType } from "../types";

// ============================================================================
// Store Interfaces
// ============================================================================

export interface Store {
  id: string; // UUID
  name: string;
  company: string;
  address: string;
  route: string;
  store_type: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateStorePayload {
  name: string;
  company: string;
  address: string;
  route: string;
  store_type: string;
}

export interface UpdateStorePayload {
  name?: string;
  company?: string;
  address?: string;
  route?: string;
  store_type?: string;
}

// ============================================================================
// Promo Interfaces
// ============================================================================

export interface Promo {
  id_promo: string; // UUID
  title_promo: string;
  admin_promo_type: AdminPromoType;
  interest_rate: number;
  discount_type: DiscountType;
  is_active: boolean;
  start_date_promo?: string;
  end_date_promo?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePromoPayload {
  title_promo: string;
  admin_promo_type: AdminPromoType;
  interest_rate: number;
  discount_type: DiscountType;
  is_active?: boolean;
  start_date_promo?: string;
  end_date_promo?: string;
}

export interface UpdatePromoPayload {
  title_promo?: string;
  admin_promo_type?: AdminPromoType;
  interest_rate?: number;
  discount_type?: DiscountType;
  is_active?: boolean;
  start_date_promo?: string;
  end_date_promo?: string;
}

// ============================================================================
// PromoTenor Interfaces
// ============================================================================

export interface PromoTenor {
  id: string; // UUID
  promo_id: string; // UUID
  tenor: number;
  min_transaction: number;
  subsidi: number;
  admin: number;
  discount: number;
  max_discount: number;
  voucher_code: string | null;
  free_installment: number;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePromoTenorPayload {
  promo_id: string;
  tenor: number;
  min_transaction: number;
  subsidi: number;
  admin: number;
  discount: number;
  max_discount: number;
  voucher_code?: string | null;
  free_installment: number;
  is_available: boolean;
}

export interface UpdatePromoTenorPayload {
  promo_id?: string;
  tenor?: number;
  min_transaction?: number;
  subsidi?: number;
  admin?: number;
  discount?: number;
  max_discount?: number;
  voucher_code?: string | null;
  free_installment?: number;
  is_available?: boolean;
}

// ============================================================================
// PromoStore Interfaces
// ============================================================================

export interface PromoStore {
  id: string; // UUID
  promo_id: string; // UUID
  store_id: string; // UUID
  tenor_ids?: string[] | null; // UUID[]
  is_ka?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePromoStorePayload {
  promo_id: string;
  store_id: string;
  tenor_ids?: string[] | null;
  is_ka?: boolean;
}

export interface UpdatePromoStorePayload {
  tenor_ids?: string[] | null;
  is_ka?: boolean;
}

// ============================================================================
// API Response Interfaces
// ============================================================================

export interface ApiError {
  message: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

// ============================================================================
// Combined Interfaces for UI
// ============================================================================

export interface PromoWithTenors extends Promo {
  tenors: PromoTenor[];
}

export interface StoreWithPromos extends Store {
  promos: Promo[];
}

// ============================================================================
// Type Aliases for Backward Compatibility
// ============================================================================

export type StoreResponse = Store;
export type PromoResponse = Promo;
export type PromoStoreResponse = PromoStore;
export type PromoTenorResponse = PromoTenor;
