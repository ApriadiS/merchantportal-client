<script lang="ts">
  import Card from './Card.svelte';
  import type { StoreObject } from '../../lib/admin/type';
  export let store: StoreObject;
  export let selected: boolean;
  export let onEdit: (store: StoreObject) => void;
  export let onDelete: (id: string) => void;
  export let onSelect: (id: string) => void;
</script>

<Card customClass="mb-4">
  <div class="flex justify-between items-center">
    <div class="flex items-center gap-3">
      <input type="checkbox" checked={selected} on:change={() => onSelect(store.id)} class="h-4 w-4 rounded border-gray-300" />
      <div>
        <div class="font-bold text-base">{store.name}</div>
        <div class="text-sm text-gray-500">{store.company}</div>
        <div class="text-sm text-gray-500 mt-2">{store.address}</div>
        <div class="mt-2 text-sm font-semibold text-[#ff4745]">/{store.route}</div>
      </div>
    </div>
    <div class="flex gap-2">
      <button type="button" class="px-3 py-1 rounded bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 transition" aria-label="Edit Toko" on:click={() => onEdit(store)}>Edit</button>
      <button type="button" class="px-3 py-1 rounded bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 transition" aria-label="Hapus Toko" on:click={() => onDelete(store.id)}>Hapus</button>
    </div>
  </div>
</Card>
