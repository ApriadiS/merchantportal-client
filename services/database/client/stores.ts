"use client";
import { supabaseClient } from "@services/supabase/supabaseClient";
import { StoreRequest, StoreResponse } from "@utils/interface";

export async function getAllStores(): Promise<StoreResponse[]> {
    const { data, error } = await supabaseClient.from("store").select("*");
    if (error) {
        console.error("Error fetching stores:", error);
        throw error;
    }
    return data as StoreResponse[];
}

export async function createStore(payload: StoreRequest): Promise<StoreResponse> {
    const { data, error } = await supabaseClient
        .from("store")
        .insert([payload])
        .select("*")
        .single();

    if (error) {
        console.error("Error creating store:", error);
        throw error;
    }
    return data as StoreResponse;
}

export async function updateStore(id: number, payload: Partial<StoreRequest>): Promise<StoreResponse> {
    const { data, error } = await supabaseClient
        .from("store")
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
        console.error("Error updating store:", error);
        throw error;
    }
    return data as StoreResponse;
}

export async function deleteStore(id: number): Promise<void> {
    const { error } = await supabaseClient.from("store").delete().eq("id", id);
    if (error) {
        console.error("Error deleting store:", error);
        throw error;
    }
}

export async function getStoresByIds(ids: number[]): Promise<StoreResponse[]> {
   if (!Array.isArray(ids) || ids.length === 0) return [];
   const sanitized = ids.filter((i) => Number.isInteger(i) && i > 0);
   if (sanitized.length === 0) return [];

   const { data, error } = await supabaseClient
      .from("store")
      .select("*")
      .in("id", sanitized);

   if (error) {
      console.error("Error fetching stores by ids:", error);
      throw error;
   }
   return (data ?? []) as StoreResponse[];
}
