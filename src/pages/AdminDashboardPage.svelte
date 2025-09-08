<script lang="ts">
   import { writable } from "svelte/store";
   import { isReloadingData } from "../lib/core/api/dashboardReload";
   import { fade, slide } from "svelte/transition";

   const activeTab = writable<"store" | "promo">("store");
   const showUploadExcelModal = writable(false);
   const showDashboardUploadModal = writable(false);
   const uploadedFile = writable<File | null>(null);
   const uploadMode = writable<string>("store");
   const showMobileMenu = writable(false);

   import { onMount } from "svelte";
   import { fetchData } from "../lib/core/api/adminDashboardApi";
   import AdminStoreTab from "../lib/components/admin/AdminDashboardStoreTab.svelte";
   import AdminPromoTab from "../lib/components/admin/AdminDashboardPromoTab.svelte";
   import AdminDashboardUploadModal from "../lib/components/admin/AdminDashboardUploadModal.svelte";
   import UploadExcelModal from "../lib/components/shared/UploadExcelModal.svelte";

   onMount(() => {
      fetchData();
      // Listen reload trigger
      isReloadingData.subscribe(async (val) => {
         if (val) {
            // Simulasi loading 1s, lalu fetch ulang data
            setTimeout(async () => {
               await fetchData();
               isReloadingData.set(false);
            }, 1000);
         }
      });
   });
</script>

<nav class="bg-white shadow-sm sticky top-0 z-20">
   <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
   >
      <div class="flex items-center justify-between w-full">
         <h1 class="text-2xl font-bold text-gray-900">
            Admin <span class="text-[#ff4745]">Dashboard</span>
         </h1>
         <!-- Desktop Menu -->
         <div class="hidden md:flex gap-2">
            <button
               class="px-4 py-2 rounded-md font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none"
               on:click={() => activeTab.set("store")}
               class:font-bold={$activeTab === "store"}>Store</button
            >
            <button
               class="px-4 py-2 rounded-md font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none"
               on:click={() => activeTab.set("promo")}
               class:font-bold={$activeTab === "promo"}>Promo</button
            >
            <button
               type="button"
               class="bg-[#ff4745] text-white font-semibold px-4 py-2 rounded shadow hover:bg-red-700 transition"
               on:click={() => {
                  showUploadExcelModal.set(true);
               }}>Upload Update</button
            >
         </div>
         <!-- Hamburger Button (Mobile) -->
         <button
            class="md:hidden flex items-center justify-center p-2 rounded focus:outline-none"
            aria-label="Open menu"
            on:click={() => showMobileMenu.set(true)}
         >
            <svg
               class="h-6 w-6 text-gray-900"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg"
            >
               <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
               />
            </svg>
         </button>
      </div>
   </div>
   <!-- Mobile Menu Overlay -->
   {#if $showMobileMenu}
      <button
         type="button"
         class="fixed inset-0 z-30 bg-black/40 md:hidden cursor-pointer"
         aria-label="Tutup menu navigasi"
         tabindex="0"
         on:click={() => showMobileMenu.set(false)}
         on:keydown={(e) => {
            if (e.key === "Enter" || e.key === " ") showMobileMenu.set(false);
         }}
         style="background: transparent; border: none; padding: 0; margin: 0;"
         in:fade={{ duration: 250 }}
         out:fade={{ duration: 200 }}
      ></button>
      <div
         class="fixed top-0 left-0 right-0 z-40 bg-white shadow-md md:hidden"
         in:slide={{ duration: 250 }}
         out:slide={{ duration: 250 }}
      >
         <!-- Close Button absolute at top-right -->
         <button
            class="absolute top-3 right-4 p-2 z-50"
            aria-label="Close menu"
            on:click={() => showMobileMenu.set(false)}
         >
            <svg
               class="h-6 w-6 text-gray-900"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg"
            >
               <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
               />
            </svg>
         </button>
         <div class="flex flex-col items-center gap-4 py-8 pt-10 relative">
            <button
               class="w-11/12 px-4 py-3 rounded-md font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none text-lg"
               on:click={() => {
                  activeTab.set("store");
                  showMobileMenu.set(false);
               }}
               class:font-bold={$activeTab === "store"}>Store</button
            >
            <button
               class="w-11/12 px-4 py-3 rounded-md font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none text-lg"
               on:click={() => {
                  activeTab.set("promo");
                  showMobileMenu.set(false);
               }}
               class:font-bold={$activeTab === "promo"}>Promo</button
            >
            <button
               type="button"
               class="w-11/12 bg-[#ff4745] text-white font-semibold px-4 py-3 rounded shadow hover:bg-red-700 transition text-lg"
               on:click={() => {
                  showUploadExcelModal.set(true);
                  showMobileMenu.set(false);
               }}>Upload Update</button
            >
         </div>
      </div>
   {/if}
</nav>
<main>
   <div
      class="max-w-5xl py-4 px-2 sm:px-4 lg:px-8 bg-gray-100 rounded-2xl min-h-[calc(100vh-8rem)] my-4 relative mx-auto w-full"
      style="box-sizing:border-box;"
   >
      {#if $isReloadingData}
         <div
            class="absolute inset-0 flex items-center justify-center bg-white/70 z-50"
         >
            <div class="flex flex-col items-center gap-2">
               <svg
                  class="animate-spin h-8 w-8 text-[#ff4745]"
                  xmlns="http://www.w3.org/2000/svg"
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
               <span class="text-[#ff4745] font-semibold"
                  >Memuat data terbaru...</span
               >
            </div>
         </div>
      {/if}
      {#if $activeTab === "store"}
         <AdminStoreTab />
      {:else if $activeTab === "promo"}
         <AdminPromoTab />
      {/if}
   </div>
</main>

{#if $showUploadExcelModal}
   <UploadExcelModal
      isOpen={$showUploadExcelModal}
      onClose={() => {
         showUploadExcelModal.set(false);
      }}
      onUpload={(file: File, mode: string) => {
         uploadedFile.set(file);
         uploadMode.set(mode);
         showUploadExcelModal.set(false);
         showDashboardUploadModal.set(true);
      }}
   />
{/if}

{#if $showDashboardUploadModal}
   <AdminDashboardUploadModal
      onClose={() => {
         showDashboardUploadModal.set(false);
         uploadedFile.set(null);
      }}
      uploadedFile={$uploadedFile}
      uploadMode={$uploadMode}
   />
{/if}
