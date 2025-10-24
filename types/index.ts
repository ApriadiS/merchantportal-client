/**
 * Type definitions for backend v1.2.0
 * Only type aliases, unions, and enums - interfaces are in utils/interface.ts
 */

// ============================================================================
// Enum Types
// ============================================================================

export type AdminPromoType = "FIX" | "PERCENT";
export type DiscountType = "FIX" | "PERCENT";
export type ItemType = "store" | "promo";

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
// Re-export interfaces for convenience
// ============================================================================

export type {
  Store,
  CreateStorePayload,
  UpdateStorePayload,
  Promo,
  CreatePromoPayload,
  UpdatePromoPayload,
  PromoTenor,
  CreatePromoTenorPayload,
  UpdatePromoTenorPayload,
  PromoStore,
  CreatePromoStorePayload,
  UpdatePromoStorePayload,
  ApiError,
  ApiResponse,
  PromoWithTenors,
  StoreWithPromos,
} from '../utils/interface';
