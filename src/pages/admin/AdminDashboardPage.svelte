<script lang="ts">

import { writable } from 'svelte/store';
import { isReloadingData } from '../../lib/admin/stores/dashboardReload';

const activeTab = writable<'store' | 'promo'>('store');
const showUploadExcelModal = writable(false);
const showDashboardUploadModal = writable(false);
const uploadedFile = writable<File | null>(null);
const uploadMode = writable<string>('store');

import { onMount } from 'svelte';
import { fetchData } from '../../lib/admin/api/adminDashboardApi';
import AdminStoreTab from '../../components/admin/AdminDashboardStoreTab.svelte';
import AdminPromoTab from '../../components/admin/AdminDashboardPromoTab.svelte';
import AdminDashboardUploadModal from '../../components/admin/AdminDashboardUploadModal.svelte';
import UploadExcelModal from '../../components/admin/UploadExcelModal.svelte';

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
   <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
	   <div class="flex items-center gap-4 justify-between	w-full">
		   <h1 class="text-2xl font-bold text-gray-900">Admin <span class="text-[#ff4745]">Dashboard</span></h1>
		   <div class="flex gap-2">
			   <button class="px-4 py-2 rounded-md font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none" on:click={() => activeTab.set('store')} class:font-bold={$activeTab === 'store'}>Store</button>
			   <button class="px-4 py-2 rounded-md font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none" on:click={() => activeTab.set('promo')} class:font-bold={$activeTab === 'promo'}>Promo</button>
			   <button type="button" class="bg-[#ff4745] text-white font-semibold px-4 py-2 rounded shadow hover:bg-red-700 transition" on:click={() => { showUploadExcelModal.set(true); }}>Upload Update</button>
		   </div>
	   </div>
   </div>
</nav>
<main>
   <div class="max-w-5xl mx-auto py-8 sm:px-6 lg:px-8 bg-gray-100 rounded-4xl min-h-[calc(100vh-10rem)] my-10 relative">
		{#if $isReloadingData}
			<div class="absolute inset-0 flex items-center justify-center bg-white/70 z-50">
				<div class="flex flex-col items-center gap-2">
					<svg class="animate-spin h-8 w-8 text-[#ff4745]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
					<span class="text-[#ff4745] font-semibold">Memuat data terbaru...</span>
				</div>
			</div>
		{/if}
		{#if $activeTab === 'store'}
			<AdminStoreTab />
		{:else if $activeTab === 'promo'}
			<AdminPromoTab />
		{/if}
   </div>
</main>

{#if $showUploadExcelModal}
   <UploadExcelModal
	   isOpen={$showUploadExcelModal}
	   onClose={() => { showUploadExcelModal.set(false); }}
	   onUpload={(file, mode) => {
		   uploadedFile.set(file);
		   uploadMode.set(mode);
		   showUploadExcelModal.set(false);
		   showDashboardUploadModal.set(true);
	   }}
   />
{/if}

{#if $showDashboardUploadModal}
   <AdminDashboardUploadModal
	   onClose={() => { showDashboardUploadModal.set(false); uploadedFile.set(null); }}
	   uploadedFile={$uploadedFile}
	   uploadMode={$uploadMode}
   />
{/if}



