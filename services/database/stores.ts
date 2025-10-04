"use server";
import { createAuthedSupabaseClient } from "@services/supabase/supabaseServer";
import { StoreRequest, StoreResponse } from "@utils/interface";
import winston from "@utils/logging";

/**
 * Database helpers for `public.store`.
 * These are server-side actions (async) intended to be used from server components or API routes.
 */
const TABLE = "store";

/** Fetch all stores. */
export async function getAllStores(): Promise<StoreResponse[]> {
   const supabase = await createAuthedSupabaseClient();
   const { data, error } = await supabase.from(TABLE).select("*");

   if (error) {
      await winston.error("getAllStores failed", { error });
      throw new Error(`getAllStores failed: ${error.message}`);
   }
   return (data ?? []) as StoreResponse[];
}

/** Fetch a single store by id. Returns null if not found. */
export async function getStoreById(id: number): Promise<StoreResponse | null> {
   if (!Number.isInteger(id) || id <= 0) {
      await winston.warn("getStoreById: invalid id", { id });
      throw new Error("getStoreById: invalid id");
   }

   const supabase = await createAuthedSupabaseClient();
   const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .single();

   if (error) {
      // If the row is not found Supabase returns an error; map not-found to null
      if (error.message && error.message.includes("No rows")) {
         await winston.debug("getStoreById: no rows", { id });
         return null;
      }
      await winston.error("getStoreById failed", { id, error });
      throw new Error(`getStoreById failed: ${error.message}`);
   }

   return data as StoreResponse;
}

/** Create a new store row. Returns the created row. */
export async function createStore(
   payload: StoreRequest
): Promise<StoreResponse> {
   if (!payload || typeof payload.name !== "string" || !payload.name.trim()) {
      await winston.warn("createStore: 'name' is required", { payload });
      throw new Error("createStore: 'name' is required");
   }

   const toInsert = {
      name: payload.name,
      company: payload.company,
      address: payload.address,
      route: payload.route ?? null,
   } as const;

   // Supabase expects arrays for insert when not using typed schema helpers
   const supabase = await createAuthedSupabaseClient();
   const { data, error } = await supabase
      .from(TABLE)
      .insert([toInsert])
      .select("*")
      .single();

   if (error) {
      // Check authenticated user
      // If the row is not found Supabase returns an error; map not-found to null
      if (error.message && error.message.includes("not authenticated")) {
         await winston.warn("createStore: not authenticated", {
            payload,
            error,
         });
         throw new Error("createStore: not authenticated");
      }
      await winston.error("createStore failed", { payload, error });
      throw new Error(`createStore failed: ${error.message}`);
   }
   return data as StoreResponse;
}

/** Update an existing store by id. Returns the updated row. */
export async function updateStore(
   id: number,
   payload: Partial<StoreRequest>
): Promise<StoreResponse> {
   if (!Number.isInteger(id) || id <= 0) {
      await winston.warn("updateStore: invalid id", { id });
      throw new Error("updateStore: invalid id");
   }
   if (!payload || Object.keys(payload).length === 0) {
      await winston.warn("updateStore: empty payload", { id });
      throw new Error("updateStore: empty payload");
   }

   const toUpdate: Partial<StoreRequest> = {};
   if (typeof payload.name === "string") toUpdate.name = payload.name;
   if (typeof payload.company === "string") toUpdate.company = payload.company;
   if (typeof payload.address === "string") toUpdate.address = payload.address;
   if (payload.route !== undefined) toUpdate.route = payload.route;

   const supabase = await createAuthedSupabaseClient();
   const { data, error } = await supabase
      .from(TABLE)
      .update(toUpdate)
      .eq("id", id)
      .select("*")
      .single();

   if (error) {
      await winston.error("updateStore failed", { id, payload, error });
      throw new Error(`updateStore failed: ${error.message}`);
   }
   return data as StoreResponse;
}

/** Delete a store by id. Returns void. */
export async function deleteStore(id: number): Promise<void> {
   if (!Number.isInteger(id) || id <= 0) {
      winston.warn("deleteStore: invalid id", { id });
      throw new Error("deleteStore: invalid id");
   }

   const supabase = await createAuthedSupabaseClient();
   const { error } = await supabase.from(TABLE).delete().eq("id", id);
   if (error) {
      await winston.error("deleteStore failed", { id, error });
      throw new Error(`deleteStore failed: ${error.message}`);
   }
}

/** Fetch multiple stores by ids (preserves ordering of returned rows not guaranteed) */
export async function getStoresByIds(ids: number[]): Promise<StoreResponse[]> {
   if (!Array.isArray(ids) || ids.length === 0) return [];
   const sanitized = ids.filter((i) => Number.isInteger(i) && i > 0);
   if (sanitized.length === 0) return [];

   const supabase = await createAuthedSupabaseClient();
   const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .in("id", sanitized);

   if (error) {
      await winston.error("getStoresByIds failed", { ids, error });
      throw new Error(`getStoresByIds failed: ${error.message}`);
   }
   return (data ?? []) as StoreResponse[];
}
