<script lang="ts">

import StoreForm from './StoreForm.svelte';
import StoreCard from './StoreCard.svelte';
import Button from './Button.svelte';
import { supabase } from '../../lib/admin/supabaseClient';
import { log } from '../../lib/admin/logger';
import { onMount } from 'svelte';
import type { StoreObject } from '../../lib/admin/type';


export let stores: StoreObject[] = [];
export let setStores: (stores: StoreObject[]) => void;

// Batch selection state
let selectedStores: string[] = [];
let selectAll: boolean = false;

function toggleSelectStore(id: string) {
  if (selectedStores.includes(id)) {
    selectedStores = selectedStores.filter(sid => sid !== id);
  } else {
    selectedStores = [...selectedStores, id];
  }
}

function toggleSelectAll() {
  if (selectAll) {
    selectedStores = [];
    selectAll = false;
  } else {
    selectedStores = stores.map(s => s.id);
    selectAll = true;
  }
}

function handleBatchDelete() {
  if (selectedStores.length === 0) return;
  if (confirm(`Hapus ${selectedStores.length} toko terpilih?`)) {
    setStores(stores.filter(s => !selectedStores.includes(s.id)));
    selectedStores = [];
    selectAll = false;
  }
}

let editingStoreId: string | null = null;
let isStoreFormVisible = false;
let newStore: StoreObject = { id: '', name: '', company: '', address: '', route: '' };

function resetStoreForm() {
  editingStoreId = null;
  newStore = { id: '', name: '', company: '', address: '', route: '' };
  isStoreFormVisible = false;
}
function handleEditStoreClick(store: StoreObject) {
  editingStoreId = store.id;
  newStore = { ...store };
  isStoreFormVisible = true;
  window.scrollTo(0, 0);
}
function handleDeleteStore(id: string) {
  if (confirm('Apakah Anda yakin ingin menghapus toko ini?')) {
    setStores(stores.filter((s) => s.id !== id));
    resetStoreForm();
  }
}
function handleStoreInputChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const { id, value } = target;
  if (id === 'route') {
    const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    newStore = { ...newStore, [id]: slug };
  } else {
    newStore = { ...newStore, [id]: value };
  }
}
function handleStoreFormSubmit(e: Event) {
  e.preventDefault();
  if (editingStoreId) {
    setStores(stores.map(s => s.id === editingStoreId ? { ...newStore, id: editingStoreId } : s));
  } else {
    setStores([...stores, { ...newStore, id: Math.random().toString(36).slice(2) }]);
  }
  resetStoreForm();
}
</script>


<div class="space-y-5">
  <div class="flex items-center justify-between mb-6 px-4 sm:px-0">
    <span class="text-lg font-semibold">Daftar Toko</span>
    <button type="button" aria-label="Tambah Toko" class="rounded-full bg-red-600 text-white p-2 shadow hover:bg-red-700 transition" on:click={() => isStoreFormVisible = true}>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
    </button>
  </div>

  {#if isStoreFormVisible}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative">
        <button class="absolute top-3 right-3 text-gray-400 hover:text-gray-700" aria-label="Tutup" on:click={resetStoreForm}>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h3 class="text-xl font-bold text-gray-800 mb-6">{editingStoreId ? 'Edit Toko' : 'Buat Toko Baru'}</h3>
        <StoreForm
          store={newStore}
          onInputChange={handleStoreInputChange}
          onSubmit={handleStoreFormSubmit}
          onCancel={resetStoreForm}
        />
      </div>
    </div>
  {/if}

  <div class="mt-8">
    <div class="flex items-center gap-2 mb-4">
      {#if selectedStores.length > 0}
        <input type="checkbox" id="selectAllStore" checked={selectAll} on:change={toggleSelectAll} class="h-4 w-4 rounded border-gray-300" />
        <label for="selectAllStore" class="text-sm">Pilih Semua</label>
        <button type="button" class="px-3 py-1 rounded bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition" on:click={handleBatchDelete}>Hapus Terpilih</button>
      {/if}
    </div>
    {#each stores as store}
      <StoreCard
        store={store}
        selected={selectedStores.includes(store.id)}
        onEdit={handleEditStoreClick}
        onDelete={handleDeleteStore}
        onSelect={toggleSelectStore}
      />
    {/each}
  </div>
</div>
