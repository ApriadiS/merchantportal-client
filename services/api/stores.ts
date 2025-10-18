import { apiRequest } from "./client";
import type { Store, CreateStorePayload, UpdateStorePayload } from "@/types";

// ============================================================================
// Public Endpoints (No Auth)
// ============================================================================

export async function getAllStores(): Promise<Store[]> {
   return apiRequest<Store[]>("/get-store");
}

export async function getStoreByRoute(route: string): Promise<Store> {
   return apiRequest<Store>(`/get-store/${route}`);
}

// ============================================================================
// Protected Endpoints (Auth Required)
// ============================================================================

export async function createStore(payload: CreateStorePayload): Promise<Store> {
   return apiRequest<Store>("/create-store", {
      method: "POST",
      body: JSON.stringify(payload),
   });
}

export async function updateStore(route: string, payload: UpdateStorePayload): Promise<Store> {
   return apiRequest<Store>(`/update-store/${route}`, {
      method: "PUT",
      body: JSON.stringify(payload),
   });
}

export async function deleteStore(route: string): Promise<void> {
   return apiRequest<void>(`/delete-store/${route}`, {
      method: "DELETE",
   });
}
