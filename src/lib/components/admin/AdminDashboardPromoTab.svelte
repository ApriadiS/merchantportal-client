<script lang="ts">
  import PromoManager from "../../feature/promo/PromoManager.svelte";
  import type { PromoObject, StoreObject } from "../../core/types/type";
  import { promos, stores } from "../../core/admin/adminDashboardStore";

  function setPromos(val: PromoObject[]) {
    promos.set(val);
  }
</script>

<header class="mb-8 flex items-center gap-4">
  <svg class="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24"
    ><path stroke="currentColor" stroke-width="2" d="M5 13l4 4L19 7" /></svg
  >
  <div>
    <h2 class="text-2xl font-bold text-gray-800">Manajemen Promo</h2>
    <p class="text-gray-500 text-sm">
      Kelola promo, voucher, dan penawaran merchant Anda.
    </p>
  </div>
</header>

<PromoManager promos={$promos} {setPromos} stores={$stores} />
{#if $promos.length === 0}
  <div class="flex flex-col items-center justify-center py-16">
    <svg class="w-20 h-20 text-gray-200 mb-4" fill="none" viewBox="0 0 24 24"
      ><path stroke="currentColor" stroke-width="2" d="M5 13l4 4L19 7" /></svg
    >
    <p class="text-gray-500 text-lg text text-center">
      Belum ada promo. Tambahkan promo baru untuk memulai.
    </p>
  </div>
{/if}
