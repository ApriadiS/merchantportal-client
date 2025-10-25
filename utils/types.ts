/**
 * Centralized types and interfaces (moved from `interface.ts`).
 * Keep in a single file to simplify imports across server and client code.
 */
export type AdminPromoType = "FIX" | "PERCENT";
export type DiscountType = "FIX" | "PERCENT";

/* ---------------------- Item Component Data ---------------------- */
export type ItemType = "store" | "promo";

// Re-export interfaces from utils/interface.ts for convenience
export type { StoreResponse, PromoResponse } from "./interface";
