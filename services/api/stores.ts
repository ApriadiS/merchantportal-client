import { apiRequest } from "./client";
import type { StoreResponse } from "@/utils/interface";

export async function getAllStores(): Promise<StoreResponse[]> {
   return apiRequest<StoreResponse[]>("/get-store");
}

export async function getStoreByRoute(route: string): Promise<StoreResponse> {
   return apiRequest<StoreResponse>(`/get-store/${route}`);
}

export async function createStore(payload: Partial<StoreResponse>): Promise<StoreResponse> {
   return apiRequest<StoreResponse>("/create-store", {
      method: "POST",
      body: JSON.stringify(payload),
   });
}

export async function updateStore(route: string, payload: Partial<StoreResponse>): Promise<StoreResponse> {
   return apiRequest<StoreResponse>(`/update-store/${route}`, {
      method: "PUT",
      body: JSON.stringify(payload),
   });
}

export async function deleteStore(route: string): Promise<void> {
   return apiRequest<void>(`/delete-store/${route}`, {
      method: "DELETE",
   });
}
