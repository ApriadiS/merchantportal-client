/**
 * TypeScript types for backend v1.2.0
 * Matches Supabase schema exactly (field names unchanged)
 */

// ============================================================================
// Store Types
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
// Promo Types (Simplified - no JSON fields)
// ============================================================================

export interface Promo {
  id_promo: string; // UUID
  title_promo: string;
  description_promo: string;
  image_promo: string;
  terms_conditions: string;
  start_date: string;
  end_date: string;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePromoPayload {
  title_promo: string;
  description_promo: string;
  image_promo: string;
  terms_conditions: string;
  start_date: string;
  end_date: string;
  is_available?: boolean;
}

export interface UpdatePromoPayload {
  title_promo?: string;
  description_promo?: string;
  image_promo?: string;
  terms_conditions?: string;
  start_date?: string;
  end_date?: string;
  is_available?: boolean;
}

// ============================================================================
// PromoTenor Types (NEW - Normalized from JSON)
// ============================================================================

export interface PromoTenor {
  id: string; // UUID
  promo_id: string; // UUID FK to promo
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
// PromoStore Types (Composite Key)
// ============================================================================

export interface PromoStore {
  id: string; // UUID
  promo_id: string; // UUID
  store_id: string; // UUID
  tenor_ids?: string[] | null; // UUID[] - Phase 4
  created_at?: string;
  updated_at?: string;
}

export interface CreatePromoStorePayload {
  promo_id: string;
  store_id: string;
  tenor_ids?: string[] | null;
}

export interface UpdatePromoStorePayload {
  tenor_ids?: string[] | null;
}

// ============================================================================
// API Response Types
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
// Domain-Specific Error Types (from backend v1.2.0)
// ============================================================================

export type StoreErrorType = 
  | 'NotFound'
  | 'AlreadyExists'
  | 'InvalidRoute'
  | 'InvalidPayload'
  | 'DatabaseError';

export type PromoErrorType =
  | 'NotFound'
  | 'AlreadyExists'
  | 'InvalidId'
  | 'InvalidPayload'
  | 'DatabaseError';

export type PromoTenorErrorType =
  | 'NotFound'
  | 'AlreadyExists'
  | 'InvalidId'
  | 'InvalidTenor'
  | 'InvalidVoucher'
  | 'InvalidPayload'
  | 'DatabaseError';

export type PromoStoreErrorType =
  | 'NotFound'
  | 'AlreadyExists'
  | 'InvalidKey'
  | 'InvalidPayload'
  | 'DatabaseError';

// ============================================================================
// Combined Types for UI
// ============================================================================

export interface PromoWithTenors extends Promo {
  tenors: PromoTenor[];
}

export interface StoreWithPromos extends Store {
  promos: Promo[];
}
