"use server";
import supabaseClient from "@services/supabase/supabaseClient";
import { PromoRequest, PromoResponse } from "@utils/interface";
import winston from "@utils/logging";

const TABLE = "promo";

/** Fetch all promos. */
export async function getAllPromos(): Promise<PromoResponse[]> {
   const { data, error } = await supabaseClient.from(TABLE).select("*");
   if (error) {
      await winston.error("getAllPromos failed", { error });
      throw new Error(`getAllPromos failed: ${error.message}`);
   }
   return (data ?? []) as PromoResponse[];
}

/** Fetch promo by id. */
export async function getPromoById(id: number): Promise<PromoResponse | null> {
   if (!Number.isInteger(id) || id <= 0) {
      await winston.warn("getPromoById: invalid id", { id });
      throw new Error("getPromoById: invalid id");
   }

   const { data, error } = await supabaseClient
      .from(TABLE)
      .select("*")
      .eq("id_promo", id)
      .single();
   if (error) {
      if (error.message && error.message.includes("No rows")) {
         await winston.debug("getPromoById: no rows", { id });
         return null;
      }
      await winston.error("getPromoById failed", { id, error });
      throw new Error(`getPromoById failed: ${error.message}`);
   }
   return data as PromoResponse;
}

/** Fetch promo by voucher code. */
export async function getPromoByVoucherCode(
   voucherCode: string
): Promise<PromoResponse | null> {
   if (!voucherCode || typeof voucherCode !== "string") {
      await winston.warn("getPromoByVoucherCode: invalid voucherCode", {
         voucherCode,
      });
      throw new Error("getPromoByVoucherCode: invalid voucherCode");
   }

   const { data, error } = await supabaseClient
      .from(TABLE)
      .select("*")
      .eq("voucher_code", voucherCode)
      .single();
   if (error) {
      if (error.message && error.message.includes("No rows")) {
         await winston.debug("getPromoByVoucherCode: no rows", { voucherCode });
         return null;
      }
      await winston.error("getPromoByVoucherCode failed", {
         voucherCode,
         error,
      });
      throw new Error(`getPromoByVoucherCode failed: ${error.message}`);
   }
   return data as PromoResponse;
}

/** Create a new promo. Returns created row. */
export async function createPromo(
   payload: PromoRequest
): Promise<PromoResponse> {
   if (!payload || !payload.title_promo) {
      await winston.warn("createPromo: title_promo is required", { payload });
      throw new Error("createPromo: title_promo is required");
   }

   const toInsert = {
      title_promo: payload.title_promo,
      min_transaction_promo: payload.min_transaction_promo,
      tenor_promo: payload.tenor_promo,
      subsidi_promo: payload.subsidi_promo ?? 0,
      admin_promo: payload.admin_promo,
      admin_promo_type: payload.admin_promo_type,
      interest_rate: payload.interest_rate,
      voucher_code: payload.voucher_code,
      start_date_promo:
         payload.start_date_promo instanceof Date
            ? payload.start_date_promo.toISOString().slice(0, 10)
            : payload.start_date_promo,
      end_date_promo:
         payload.end_date_promo instanceof Date
            ? payload.end_date_promo.toISOString().slice(0, 10)
            : payload.end_date_promo,
      free_installment: payload.free_installment ?? 0,
      is_active: payload.is_active ?? true,
   } as const;

   const { data, error } = await supabaseClient
      .from(TABLE)
      .insert([toInsert])
      .select("*")
      .single();
   if (error) {
      await winston.error("createPromo failed", { payload, error });
      throw new Error(`createPromo failed: ${error.message}`);
   }
   return data as PromoResponse;
}

/** Update a promo by id. Returns updated row. */
export async function updatePromo(
   id: number,
   payload: Partial<PromoRequest>
): Promise<PromoResponse> {
   if (!Number.isInteger(id) || id <= 0) {
      await winston.warn("updatePromo: invalid id", { id });
      throw new Error("updatePromo: invalid id");
   }
   if (!payload || Object.keys(payload).length === 0) {
      await winston.warn("updatePromo: empty payload", { id });
      throw new Error("updatePromo: empty payload");
   }

   const toUpdate: Partial<PromoRequest> = {};
   if (payload.title_promo !== undefined)
      toUpdate.title_promo = payload.title_promo;
   if (payload.min_transaction_promo !== undefined)
      toUpdate.min_transaction_promo = payload.min_transaction_promo;
   if (payload.tenor_promo !== undefined)
      toUpdate.tenor_promo = payload.tenor_promo;
   if (payload.subsidi_promo !== undefined)
      toUpdate.subsidi_promo = payload.subsidi_promo;
   if (payload.admin_promo !== undefined)
      toUpdate.admin_promo = payload.admin_promo;
   if (payload.admin_promo_type !== undefined)
      toUpdate.admin_promo_type = payload.admin_promo_type;
   if (payload.interest_rate !== undefined)
      toUpdate.interest_rate = payload.interest_rate;
   if (payload.voucher_code !== undefined)
      toUpdate.voucher_code = payload.voucher_code;
   if (payload.start_date_promo !== undefined)
      toUpdate.start_date_promo =
         payload.start_date_promo instanceof Date
            ? payload.start_date_promo.toISOString().slice(0, 10)
            : payload.start_date_promo;
   if (payload.end_date_promo !== undefined)
      toUpdate.end_date_promo =
         payload.end_date_promo instanceof Date
            ? payload.end_date_promo.toISOString().slice(0, 10)
            : payload.end_date_promo;
   if (payload.free_installment !== undefined)
      toUpdate.free_installment = payload.free_installment;
   if (payload.is_active !== undefined) toUpdate.is_active = payload.is_active;

   const { data, error } = await supabaseClient
      .from(TABLE)
      .update(toUpdate)
      .eq("id_promo", id)
      .select("*")
      .single();
   if (error) {
      await winston.error("updatePromo failed", { id, payload, error });
      throw new Error(`updatePromo failed: ${error.message}`);
   }
   return data as PromoResponse;
}

/** Delete a promo by id. */
export async function deletePromo(id: number): Promise<void> {
   if (!Number.isInteger(id) || id <= 0) {
      winston.warn("deletePromo: invalid id", { id });
      throw new Error("deletePromo: invalid id");
   }

   const { error } = await supabaseClient
      .from(TABLE)
      .delete()
      .eq("id_promo", id);
   if (error) {
      await winston.error("deletePromo failed", { id, error });
      throw new Error(`deletePromo failed: ${error.message}`);
   }
}

// Named exports are sufficient for server actions; avoid default object export to satisfy
// Next.js constraint that a module containing "use server" should only export async functions.
