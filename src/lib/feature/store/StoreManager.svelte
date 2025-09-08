<script lang="ts">
   import StoreForm from "./StoreForm.svelte";
   import StoreCard from "./StoreCard.svelte";
   import Button from "../../components/shared/Button.svelte";
   import { supabase } from "../../core/api/supabaseClient";
   import { log } from "../../core/utils/logger";
   import { onMount } from "svelte";
   import type { StoreObject } from "../../core/types/type";

   export let stores: StoreObject[] = [];
   export let setStores: (stores: StoreObject[]) => void;

   // Batch selection state
   let selectedStores: string[] = [];
   let selectAll: boolean = false;

   function toggleSelectStore(id: string) {
      if (selectedStores.includes(id)) {
         selectedStores = selectedStores.filter((sid) => sid !== id);
      } else {
         selectedStores = [...selectedStores, id];
      }
   }

   function toggleSelectAll() {
      if (selectAll) {
         selectedStores = [];
         selectAll = false;
      } else {
         selectedStores = stores.map((s) => s.id);
         selectAll = true;
      }
   }

   function handleBatchDelete() {
      if (selectedStores.length === 0) return;
      if (confirm(`Hapus ${selectedStores.length} toko terpilih?`)) {
         setStores(stores.filter((s) => !selectedStores.includes(s.id)));
         selectedStores = [];
         selectAll = false;
      }
   }

   let editingStoreId: string | null = null;
   let isStoreFormVisible = false;
   let newStore: StoreObject = {
      id: "",
      name: "",
      company: "",
      address: "",
      route: "",
   };

   function resetStoreForm() {
      editingStoreId = null;
      newStore = { id: "", name: "", company: "", address: "", route: "" };
      isStoreFormVisible = false;
   }
   function handleEditStoreClick(store: StoreObject) {
      editingStoreId = store.id;
      newStore = { ...store };
      isStoreFormVisible = true;
      window.scrollTo(0, 0);
   }
   // Modal konfirmasi hapus
   let showDeleteModal = false;
   let deleteStoreId: string | null = null;
   let deleteStoreName: string = "";

   function handleDeleteStore(id: string) {
      const store = stores.find((s) => s.id === id);
      deleteStoreId = id;
      deleteStoreName = store?.name ?? "";
      showDeleteModal = true;
   }

   async function confirmDeleteStore() {
      if (deleteStoreId) {
         // Hapus di Supabase
         const { error } = await supabase
            .from("store")
            .delete()
            .eq("id", deleteStoreId);
         if (!error) {
            setStores(stores.filter((s) => s.id !== deleteStoreId));
            resetStoreForm();
         } else {
            alert("Gagal menghapus toko di server!");
         }
         showDeleteModal = false;
         deleteStoreId = null;
         deleteStoreName = "";
      }
   }

   function cancelDeleteStore() {
      showDeleteModal = false;
      deleteStoreId = null;
      deleteStoreName = "";
   }
   function handleStoreInputChange(e: Event) {
      const target = e.target as HTMLInputElement;
      const { id, value } = target;
      if (id === "route") {
         const slug = value
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
         newStore = { ...newStore, [id]: slug };
      } else {
         newStore = { ...newStore, [id]: value };
      }
   }
   function handleStoreFormSubmit(e: Event) {
      e.preventDefault();
      if (editingStoreId) {
         setStores(
            stores.map((s) =>
               s.id === editingStoreId ? { ...newStore, id: editingStoreId } : s
            )
         );
      } else {
         setStores([
            ...stores,
            { ...newStore, id: Math.random().toString(36).slice(2) },
         ]);
      }
      resetStoreForm();
   }
</script>

<div class="space-y-5">
   <div class="flex items-center justify-between mb-6 px-4 sm:px-0">
      <span class="text-lg font-semibold">Daftar Toko</span>
      <button
         type="button"
         aria-label="Tambah Toko"
         class="rounded-full bg-red-600 text-white p-2 shadow hover:bg-red-700 transition"
         on:click={() => (isStoreFormVisible = true)}
      >
         <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            ><path
               stroke-linecap="round"
               stroke-linejoin="round"
               stroke-width="2"
               d="M12 4v16m8-8H4"
            /></svg
         >
      </button>
   </div>

   {#if isStoreFormVisible}
      <div
         class="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      >
         <div
            class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative"
         >
            <button
               class="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
               aria-label="Tutup"
               on:click={resetStoreForm}
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  ><path
                     stroke-linecap="round"
                     stroke-linejoin="round"
                     stroke-width="2"
                     d="M6 18L18 6M6 6l12 12"
                  /></svg
               >
            </button>
            <h3 class="text-xl font-bold text-gray-800 mb-6">
               {editingStoreId ? "Edit Toko" : "Buat Toko Baru"}
            </h3>
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
      {#if showDeleteModal}
         <div
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
         >
            <div
               class="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative max-h-[90vh] m-4 flex flex-col border border-gray-100"
            >
               <button
                  class="absolute top-4 right-4 text-gray-400 hover:text-[#ff4745] transition"
                  aria-label="Tutup"
                  on:click={cancelDeleteStore}
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     class="h-6 w-6"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                     ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                     /></svg
                  >
               </button>
               <div class="p-6 flex flex-col items-center text-center">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     class="h-12 w-12 text-[#ff4745] mb-2"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                     ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                     /></svg
                  >
                  <h3 class="text-xl font-bold text-gray-800 mb-2">
                     Hapus Toko?
                  </h3>
                  <p class="text-gray-600 mb-4">
                     Toko <span class="font-semibold text-[#ff4745]"
                        >{deleteStoreName}</span
                     > akan dihapus secara permanen.
                  </p>
                  <div class="flex gap-3 pt-2 justify-center w-full">
                     <button
                        type="button"
                        class="px-6 py-2 rounded-lg bg-[#ff4745] text-white font-bold hover:bg-red-600 transition text-base shadow w-1/2"
                        on:click={confirmDeleteStore}>Hapus</button
                     >
                     <button
                        type="button"
                        class="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition text-base shadow w-1/2"
                        on:click={cancelDeleteStore}>Batal</button
                     >
                  </div>
               </div>
            </div>
         </div>
      {/if}
      <div class="flex items-center gap-2 mb-4">
         {#if selectedStores.length > 0}
            <input
               type="checkbox"
               id="selectAllStore"
               checked={selectAll}
               on:change={toggleSelectAll}
               class="h-4 w-4 rounded border-gray-300"
            />
            <label for="selectAllStore" class="text-sm">Pilih Semua</label>
            <button
               type="button"
               class="px-3 py-1 rounded bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition"
               on:click={handleBatchDelete}>Hapus Terpilih</button
            >
         {/if}
      </div>
      {#each stores as store}
         <StoreCard
            {store}
            selected={selectedStores.includes(store.id)}
            onEdit={handleEditStoreClick}
            onDelete={handleDeleteStore}
            onSelect={toggleSelectStore}
         />
      {/each}
   </div>
</div>
