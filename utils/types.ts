import {
   StoreResponse,
   StoreRequest,
   PromoResponse,
   PromoRequest,
} from "./interface";

/**
 * Centralized types and interfaces (moved from `interface.ts`).
 * Keep in a single file to simplify imports across server and client code.
 */
export type AdminPromoType = string;

/* ---------------------- public.promo_store ---------------------- */

export type PromoOrPromoRequest = PromoResponse | PromoRequest;
export type StoreOrStoreRequest = StoreResponse | StoreRequest;

/* ---------------------- Item Component Data ---------------------- */
export type ItemType = "store" | "promo";
