<script lang="ts">
   import { log } from "../../core/utils/logger";
   log("PromoCard loaded");
   import Card from "../../components/shared/Card.svelte";
   import type { PromoObject, StoreObject } from "../../core/types/type";
   export let promo: PromoObject;
   export let stores: StoreObject[] = [];
   export let onEdit: (promo: PromoObject) => void;
   export let onDelete: (id: string) => void;
   export let onToggleActive: (promo: PromoObject) => void;
   export let onSelect: (id: string) => void;
   export let selected: boolean;

   function formatCurrencyInput(value: string | number): string {
      const strValue = String(value).replace(/[^0-9]/g, "");
      if (strValue === "") return "";
      const num = Number(strValue);
      return `Rp ${new Intl.NumberFormat("id-ID").format(num)}`;
   }
</script>

<Card customClass="mb-4">
   <div class="p-5">
      <div class="mb-3 flex items-center gap-3">
         <input
            type="checkbox"
            checked={selected}
            on:change={() => onSelect(promo.idPromo)}
            class="h-4 w-4 rounded border-gray-300"
         />
         <h3 class="font-bold text-base text-gray-800 mb-2">
            {promo.titlePromo}
         </h3>
         <div class="flex items-center gap-3 flex-wrap">
            <span
               class={`px-3 py-1 text-xs font-semibold rounded-full ${promo.isActive ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"}`}
               >{promo.isActive ? "Aktif" : "Tidak Aktif"}</span
            >
            {#if promo.freeInstallment > 0}
               <span
                  class="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800"
                  >Gratis {promo.freeInstallment}x Cicilan</span
               >
            {/if}
         </div>
      </div>
      <div class="mb-4">
         <p class="text-sm text-gray-500">
            Voucher: <span class="font-semibold text-gray-700"
               >{promo.voucherCode}</span
            >
         </p>
         <p class="text-sm text-gray-500 mt-1">
            Toko: <span class="font-semibold text-red-500"
               >{stores
                  .filter((s) => promo.storeIds.includes(s.id))
                  .map((s) => s.name)
                  .join(", ") || "Tidak ada toko tertaut"}</span
            >
         </p>
      </div>
      <div
         class="flex justify-between items-center pt-4 border-t border-gray-200"
      >
         <label class="flex items-center cursor-pointer">
            <div class="relative">
               <input
                  type="checkbox"
                  checked={promo.isActive}
                  on:change={() => onToggleActive(promo)}
                  class="sr-only"
               />
               <div
                  class={`block w-12 h-6 rounded-full ${promo.isActive ? "bg-red-500" : "bg-gray-300"}`}
               ></div>
               <div
                  class={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${promo.isActive ? "transform translate-x-6" : ""}`}
               ></div>
            </div>
         </label>
         <div class="flex gap-2">
            <button
               type="button"
               class="px-3 py-1 rounded bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 transition"
               aria-label="Edit Promo"
               on:click={() => onEdit(promo)}>Edit</button
            >
            <button
               type="button"
               class="px-3 py-1 rounded bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 transition"
               aria-label="Hapus Promo"
               on:click={() => onDelete(promo.idPromo)}>Hapus</button
            >
         </div>
      </div>
   </div>
   <div
      class="bg-gray-50/70 border-t border-gray-200/80 px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"
   >
      <div>
         <p class="text-gray-500">Min. Transaksi</p>
         <p class="font-semibold text-gray-800">
            {formatCurrencyInput(promo.minTransactionPromo)}
         </p>
      </div>
      <div>
         <p class="text-gray-500">Tenor</p>
         <p class="font-semibold text-gray-800">{promo.tenorPromo} bulan</p>
      </div>
      <div>
         <p class="text-gray-500">Subsidi</p>
         <p class="font-semibold text-gray-800">{promo.subsidiPromo}%</p>
      </div>
      <div>
         <p class="text-gray-500">Admin</p>
         <p class="font-semibold text-gray-800">
            {promo.adminPromoType === "FIX"
               ? formatCurrencyInput(promo.adminPromo)
               : `${promo.adminPromo}%`}
         </p>
      </div>
   </div>
</Card>
