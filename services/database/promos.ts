"use client";
import { supabaseClient } from "@services/supabase/supabaseClient";
import { PromoRequest, PromoResponse } from "@utils/interface";

/** Get all promos. */
export async function getAllPromos(): Promise<PromoResponse[]> {
   const { data, error } = await supabaseClient.from("promo").select("*");
   if (error) {
      console.error("getAllPromos failed", { error });
      throw new Error(`getAllPromos failed: ${error.message}`);
   }
   return data as PromoResponse[];
}

/** Create a new promo. Returns created row. */
export async function createPromo(
   payload: PromoRequest
): Promise<PromoResponse> {
   const { data, error } = await supabaseClient
      .from("promo")
      .insert([payload])
      .select("*")
      .single();
   if (error) {
      console.error("createPromo failed", { payload, error });
      throw new Error(`createPromo failed: ${error.message}`);
   }
   return data as PromoResponse;
}

/** Update a promo by id. Returns updated row. */
export async function updatePromo(
   id: number,
   payload: Partial<PromoRequest>
): Promise<PromoResponse> {
   console.log("updatePromo called with:", { id, payload });
   
   const { data, error } = await supabaseClient
      .from("promo")
      .update(payload)
      .eq("id_promo", id)
      .select("*");
   
   console.log("updatePromo response:", { data, error });
   
   if (error) {
      console.error("updatePromo failed", { id, payload, error });
      throw new Error(`updatePromo failed: ${error.message}`);
   }
   if (!data || data.length === 0) {
      console.error("updatePromo: no rows updated", { id, payload });
      throw new Error(`updatePromo: promo with id ${id} not found`);
   }
   return data[0] as PromoResponse;
}

/** Fetch promo by id. */
export async function getPromoById(id: number): Promise<PromoResponse | null> {
   if (!Number.isInteger(id) || id <= 0) {
      throw new Error("getPromoById: invalid id");
   }

   const { data, error } = await supabaseClient
      .from("promo")
      .select("*")
      .eq("id_promo", id)
      .limit(1);
   
   if (error) {
      console.error("getPromoById failed", { id, error });
      throw new Error(`getPromoById failed: ${error.message}`);
   }
   
   if (!data || data.length === 0) {
      return null;
   }
   
   return data[0] as PromoResponse;
}

/** Delete a promo by id. */
export async function deletePromo(id: number): Promise<void> {
   if (!Number.isInteger(id) || id <= 0) {
      throw new Error("deletePromo: invalid id");
   }

   const { error } = await supabaseClient
      .from("promo")
      .delete()
      .eq("id_promo", id);
   if (error) {
      console.error("deletePromo failed", { id, error });
      throw new Error(`deletePromo failed: ${error.message}`);
   }
}
