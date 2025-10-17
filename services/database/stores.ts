"use client";
import { supabaseClient } from "@services/supabase/supabaseClient";
import { StoreRequest, StoreResponse } from "@utils/interface";

/** Fetch a single store by route (for public access) */
export async function getStoreByRoutePublic(route: string): Promise<StoreResponse | null> {
    if (!route || typeof route !== "string") {
        console.warn("getStoreByRoutePublic: invalid route", { route });
        throw new Error("getStoreByRoutePublic: invalid route");
    }
    
    const { data, error } = await supabaseClient
        .from("store")
        .select("*")
        .eq("route", route)
        .single();
        
    if (error) {
        if (error.message && error.message.includes("No rows")) {
            return null;
        }
        console.error("getStoreByRoutePublic failed", error);
        return null;
    }
    
    return data as StoreResponse;
}

export async function getAllStores(): Promise<StoreResponse[]> {
    const { data, error } = await supabaseClient.from("store").select("*");
    if (error) {
        console.error("Error fetching stores:", error);
        throw error;
    }
    return data as StoreResponse[];
}

export async function createStore(payload: StoreRequest): Promise<StoreResponse> {
    const insertPayload = {
        name: payload.name,
        company: payload.company,
        address: payload.address,
        route: payload.route || "",
        store_type: payload.store_type || "KA"
    };

    const { data, error } = await supabaseClient
        .from("store")
        .insert([insertPayload])
        .select("*")
        .single();

    if (error) {
        console.error("Error creating store:", error);
        throw error;
    }
    return data as StoreResponse;
}

export async function updateStore(id: number, payload: Partial<StoreRequest>): Promise<StoreResponse> {
    console.log("updateStore called with:", { id, payload });
    
    // Hanya kirim field yang ada nilainya
    const updatePayload: Partial<StoreRequest> = {};
    
    if (payload.name !== undefined) updatePayload.name = payload.name;
    if (payload.company !== undefined) updatePayload.company = payload.company;
    if (payload.address !== undefined) updatePayload.address = payload.address;
    if (payload.route !== undefined) updatePayload.route = payload.route;
    if (payload.store_type !== undefined) updatePayload.store_type = payload.store_type;

    console.log("Final update payload:", updatePayload);
    console.log("Payload keys:", Object.keys(updatePayload));

    if (Object.keys(updatePayload).length === 0) {
        throw new Error("No fields to update");
    }

    const { data, error } = await supabaseClient
        .from("store")
        .update(updatePayload)
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
        console.error("Supabase error details:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
        });
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
