"use client";
import { supabaseClient } from "@services/supabase/supabaseClient";
import { PromoStoreRequest, PromoStoreResponse } from "@utils/interface";

const TABLE = "promo_store";

/** Fetch all promo_store rows */
export async function getAllPromoStores(): Promise<PromoStoreResponse[]> {
   const { data, error } = await supabaseClient.from(TABLE).select("*");
   if (error) {
      throw new Error(`getAllPromoStores failed: ${error.message}`);
   }
   return (data ?? []) as PromoStoreResponse[];
}

/** Fetch a promo_store row by id */
export async function getPromoStoreById(
   id: number
): Promise<PromoStoreResponse | null> {
   if (!Number.isInteger(id) || id <= 0) {
      throw new Error("getPromoStoreById: invalid id");
   }
   const { data, error } = await supabaseClient
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .single();
   if (error) {
      if (error.message && error.message.includes("No rows")) {
         return null;
      }
      throw new Error(`getPromoStoreById failed: ${error.message}`);
   }
   return data as PromoStoreResponse;
}

/** Fetch all promo_store rows for a given promo_id */
export async function getPromoStoresByPromoId(
   promo_id: number
): Promise<PromoStoreResponse[]> {
   if (!Number.isInteger(promo_id) || promo_id <= 0) {
      throw new Error("getPromoStoresByPromoId: invalid promo_id");
   }
   const { data, error } = await supabaseClient
      .from(TABLE)
      .select("*")
      .eq("promo_id", promo_id);
   if (error) {
      throw new Error(`getPromoStoresByPromoId failed: ${error.message}`);
   }
   return (data ?? []) as PromoStoreResponse[];
}

/** Fetch all promo_store rows for a given store_id */
export async function getPromoStoresByStoreId(
   store_id: number
): Promise<PromoStoreResponse[]> {
   if (!Number.isInteger(store_id) || store_id <= 0) {
      throw new Error("getPromoStoresByStoreId: invalid store_id");
   }
   const { data, error } = await supabaseClient
      .from(TABLE)
      .select("*")
      .eq("store_id", store_id);
   if (error) {
      throw new Error(`getPromoStoresByStoreId failed: ${error.message}`);
   }
   return (data ?? []) as PromoStoreResponse[];
}

/** Create a promo_store mapping */
export async function addPromoToStore(
   payload: PromoStoreRequest
): Promise<PromoStoreResponse> {
   if (
      !payload ||
      !Number.isInteger(payload.promo_id) ||
      !Number.isInteger(payload.store_id)
   ) {
      throw new Error("addPromoToStore: invalid payload");
   }

   const toInsert = {
      promo_id: payload.promo_id,
      store_id: payload.store_id,
   } as const;
   const { data, error } = await supabaseClient
      .from(TABLE)
      .insert([toInsert])
      .select("*")
      .single();
   if (error) {
      throw new Error(`addPromoToStore failed: ${error.message}`);
   }
   return data as PromoStoreResponse;
}

/** Remove a promo_store mapping by id */
export async function removePromoFromStore(id: number): Promise<void> {
   if (!Number.isInteger(id) || id <= 0) {
      throw new Error("removePromoFromStore: invalid id");
   }
   const { error } = await supabaseClient.from(TABLE).delete().eq("id", id);
   if (error) {
      throw new Error(`removePromoFromStore failed: ${error.message}`);
   }
}
