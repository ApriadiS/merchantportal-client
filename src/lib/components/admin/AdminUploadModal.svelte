<script lang="ts">
  import UploadExcelModal from "../../components/admin/UploadExcelModal.svelte";
  import {
    isUploadModalOpen,
    isProcessingUpload,
    isSaving,
    uploadResult,
    uploadMode,
    handleCloseUploadModal,
  } from "../../core/admin/adminDashboardModal";
  import {
    handleSaveData,
    handleUploadExcelModal,
  } from "../../core/admin/adminDashboardUpload";
</script>

<UploadExcelModal
  isOpen={$isUploadModalOpen}
  onClose={handleCloseUploadModal}
  onUpload={handleUploadExcelModal}
/>
{#if $isProcessingUpload || $isSaving}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
    <div class="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center">
      <svg
        class="w-12 h-12 text-[#ff4745] animate-spin mb-4"
        fill="none"
        viewBox="0 0 24 24"
        ><circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle><path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        ></path></svg
      >
      <p class="text-lg text-[#ff4745] font-bold animate-pulse">
        Memproses data upload...
      </p>
    </div>
  </div>
{/if}
{#if $uploadResult}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
    <div
      class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl flex flex-col"
    >
      <h3 class="text-xl font-bold text-gray-800 mb-4">Validasi Data</h3>
      {#if $uploadResult.error}
        <div class="text-red-600 font-bold text-center py-8">
          {$uploadResult.error}
        </div>
      {/if}
      <div class="flex justify-end mt-6 gap-2">
        <button
          class="px-4 py-2 rounded bg-[#ff4745] text-white font-semibold hover:bg-red-700 transition text-sm"
          on:click={handleSaveData}
          disabled={$isSaving ||
            !(
              $uploadResult &&
              $uploadResult.valid &&
              $uploadResult.valid.length > 0
            )}
        >
          {#if $isSaving}
            <svg
              class="w-4 h-4 mr-2 inline-block animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              ><circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle><path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path></svg
            >
            Menyimpan...
          {:else}
            Simpan
          {/if}
        </button>
        <button
          class="px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition text-sm"
          on:click={handleCloseUploadModal}
          disabled={$isSaving}>Tutup</button
        >
      </div>
      <div class="mb-6">
        <div class="mb-6">
          {#if $uploadMode === "store_promo"}
            <div class="mb-2 text-green-700 font-semibold">
              Data Store Valid: {$uploadResult && $uploadResult.storeValid
                ? $uploadResult.storeValid.length
                : 0}
            </div>
            <div class="mb-2 text-red-700 font-semibold">
              Data Store Duplikat: {$uploadResult && $uploadResult.storeDupe
                ? $uploadResult.storeDupe.length
                : 0}
            </div>
            <div class="mb-2 text-green-700 font-semibold">
              Data Promo Valid: {$uploadResult && $uploadResult.promoValid
                ? $uploadResult.promoValid.length
                : 0}
            </div>
            <div class="mb-2 text-red-700 font-semibold">
              Data Promo Duplikat: {$uploadResult && $uploadResult.promoDupe
                ? $uploadResult.promoDupe.length
                : 0}
            </div>
          {:else}
            <div class="mb-2 text-green-700 font-semibold">
              Data Valid: {$uploadResult && $uploadResult.valid
                ? $uploadResult.valid.length
                : 0}
            </div>
            <div class="mb-2 text-red-700 font-semibold">
              Data Duplikat: {$uploadResult && $uploadResult.dupe
                ? $uploadResult.dupe.length
                : 0}
            </div>
          {/if}
        </div>
        <div class="space-y-4">
          {#if $uploadMode === "store_promo"}
            <!-- ...existing details for storeValid, storeDupe, promoValid, promoDupe... -->
            <!-- Copy table rendering logic here from previous file -->
          {:else}
            <!-- ...existing details for valid, dupe... -->
            <!-- Copy table rendering logic here from previous file -->
          {/if}
        </div>
        <div class="flex justify-end mt-6">
          <button
            class="px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition text-sm"
            on:click={handleCloseUploadModal}>Tutup</button
          >
        </div>
      </div>
    </div>
  </div>
{/if}
