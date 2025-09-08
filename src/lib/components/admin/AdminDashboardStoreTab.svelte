<script lang="ts">
  import StoreManager from "../../feature/store/StoreManager.svelte";
  import type { StoreObject } from "../../core/types/type";
  import { stores } from "../../core/admin/adminDashboardStore";
  function setStores(val: StoreObject[]) {
    stores.set(val);
  }
</script>

<div class="mb-8 flex items-center gap-4">
  <svg class="w-8 h-8 text-[#ff4745]" fill="none" viewBox="0 0 24 24"
    ><path
      stroke="currentColor"
      stroke-width="2"
      d="M4 10V7a3 3 0 013-3h10a3 3 0 013 3v3"
    /></svg
  >
  <div>
    <h2 class="text-2xl font-bold text-gray-800">Manajemen Toko</h2>
    <p class="text-gray-500 text-sm">
      Kelola data toko merchant Anda secara efisien.
    </p>
  </div>
</div>
<StoreManager stores={$stores} {setStores} />
{#if $stores.length === 0}
  <div class="flex flex-col items-center justify-center py-16">
    <svg class="w-20 h-20 text-gray-200 mb-4" fill="none" viewBox="0 0 24 24"
      ><path
        stroke="currentColor"
        stroke-width="2"
        d="M4 10V7a3 3 0 013-3h10a3 3 0 013 3v3"
      /></svg
    >
    <p class="text-gray-500 text-lg text-center">
      Belum ada toko. Tambahkan toko baru untuk memulai.
    </p>
  </div>
{/if}
