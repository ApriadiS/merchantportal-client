import { supabase } from "../supabaseClient";
import type { PromoObject, StoreObject } from "../type";
import { writable } from "svelte/store";
import { log } from "../../logger";

log("adminDashboardStore loaded");

export const promos = writable<PromoObject[]>([]);
export const stores = writable<StoreObject[]>([]);
export const isLoading = writable(true);
export const activeTab = writable<"store" | "promo">("store");
export const isUploadModalOpen = writable(false);

export async function fetchData() {
   isLoading.set(true);
   try {
      const { data: tableStatus, error: rpcError } = await supabase.rpc(
         "check_data_promo_and_store"
      );
      if (rpcError || !tableStatus || tableStatus.length === 0) {
         stores.set([]);
         promos.set([]);
         isLoading.set(false);
         return;
      }
      const { total_stores, total_promos } = tableStatus[0];
      if (total_stores > 0) {
         const { data: storesData, error: storesError } = await supabase
            .from("store")
            .select("*");
         stores.set(storesError ? [] : storesData || []);
      } else {
         stores.set([]);
      }
      if (total_promos > 0) {
         const { data: promosData, error: promosError } = await supabase
            .from("promo")
            .select("*");
         promos.set(promosError ? [] : promosData || []);
      } else {
         promos.set([]);
      }
   } catch (err) {
      stores.set([]);
      promos.set([]);
   } finally {
      isLoading.set(false);
   }
}
