<script lang="ts">
import { log } from '../../lib/logger';
log('PromoForm loaded');
  import Input from '../admin/Input.svelte';
  import type { PromoObject, StoreObject } from '../../lib/admin/type';
  export let promo: PromoObject;
  export let stores: StoreObject[] = [];
  export let minTransactionDisplay: string;
  export let adminPromoDisplay: string;
  export let onInputChange: (e: Event) => void;
  export let onCurrencyInputChange: (e: Event) => void;
  export let onSubmit: (e: Event) => void;
  export let onCancel: () => void;

  // Opsi admin type
  const adminTypes = [
    { value: 'PERCENT', label: '%' },
    { value: 'FIX', label: 'Rp' }
  ];
</script>

<form on:submit={onSubmit} class="space-y-5">
  <Input label="Nama Promo" value={promo.titlePromo} id="titlePromo" onInput={onInputChange} customClass="" />
  <Input label="Kode Voucher" value={promo.voucherCode} id="voucherCode" onInput={onInputChange} customClass="" />
  <Input label="Minimal Transaksi" value={minTransactionDisplay} id="minTransactionPromo" onInput={onCurrencyInputChange} customClass="text-left" placeholder="Rp 0" />
  <Input label="Tenor (bulan)" value={String(promo.tenorPromo)} id="tenorPromo" onInput={onInputChange} customClass="" placeholder="cth: 6" />
  <div>
    <label for="storeIds" class="block text-sm font-medium text-gray-700 mb-3">Kaitkan dengan Toko</label>
    <div class="space-y-2 rounded-md border border-gray-300 p-4 max-h-40 overflow-y-auto">
      {#if stores.length === 0}
        <p class="text-sm text-gray-500">Buat toko terlebih dahulu untuk menautkan promo.</p>
      {:else}
        {#each stores as store}
          <label class="flex items-center space-x-3 cursor-pointer" for={`store-${store.id}`}> 
            <input id={`store-${store.id}`} type="checkbox" value={store.id} checked={promo.storeIds.includes(store.id)} on:change={() => {
              const currentStoreIds = promo.storeIds || [];
              if (currentStoreIds.includes(store.id)) {
                promo.storeIds = currentStoreIds.filter((id: string) => id !== store.id);
              } else {
                promo.storeIds = [...currentStoreIds, store.id];
              }
            }} class="h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500" />
            <span class="text-gray-800">{store.name}</span>
          </label>
        {/each}
      {/if}
    </div>
  </div>
  <div class="border-t pt-6">
    <h3 class="font-semibold text-gray-700 mb-4">Gratis Cicilan</h3>
    <div class="flex gap-3 flex-wrap">
      <label class="flex items-center space-x-2 cursor-pointer text-gray-700">
        <input type="radio" id="freeInstallment" name="freeInstallment" value={0} checked={promo.freeInstallment === 0} on:change={onInputChange} class="form-radio text-red-500 focus:ring-red-500" />
        <span>Tanpa Gratis Cicilan</span>
      </label>
      <label class="flex items-center space-x-2 cursor-pointer text-gray-700">
        <input type="radio" id="freeInstallment" name="freeInstallment" value={1} checked={promo.freeInstallment === 1} on:change={onInputChange} class="form-radio text-red-500 focus:ring-red-500" />
        <span>Gratis 1x Cicilan</span>
      </label>
      <label class="flex items-center space-x-2 cursor-pointer text-gray-700">
        <input type="radio" id="freeInstallment" name="freeInstallment" value={2} checked={promo.freeInstallment === 2} on:change={onInputChange} class="form-radio text-red-500 focus:ring-red-500" />
        <span>Gratis 2x Cicilan</span>
      </label>
    </div>
  </div>
  <div class="border-t pt-6">
    <h3 class="font-semibold text-gray-700 mb-4">Keuangan</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
  <Input label="Suku Bunga per Bulan (%)" type="number" value={String(promo.interestRate)} id="interestRate" onInput={onInputChange} placeholder="Kosongkan untuk default (2.6%)" customClass="text-left" />
      <div>
        <label for="adminPromo" class="block text-sm font-medium text-gray-700 mb-2">Biaya Admin</label>
        <div class="flex items-center">
          <select id="adminPromoType" value={promo.adminPromoType} on:change={onInputChange} class="h-[38px] rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-sm text-red-700 focus:ring-red-500 focus:border-red-500 px-3">
            {#each adminTypes as type}
              <option value={type.value}>{type.label}</option>
            {/each}
          </select>
          <input type="text" id="adminPromo" value={adminPromoDisplay} on:input={onInputChange} placeholder={promo.adminPromoType === 'FIX' ? 'cth: 15.000' : 'cth: 1.5'} class="w-full px-4 py-2 rounded-r-md border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 text-left" required />
        </div>
      </div>
  <Input label="Subsidi (%)" type="number" value={String(promo.subsidiPromo)} id="subsidiPromo" onInput={onInputChange} placeholder="cth: 5 atau 0 jika tidak ada" customClass="text-left" />
    </div>
  </div>
  <div class="border-t pt-6">
    <h3 class="font-semibold text-gray-700 mb-4">Periode Promo</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
      <Input label="Tanggal Mulai" type="date" value={promo.startDatePromo} id="startDatePromo" onInput={onInputChange} />
      <Input label="Tanggal Selesai" type="date" value={promo.endDatePromo} id="endDatePromo" onInput={onInputChange} />
    </div>
  </div>
  <div class="flex gap-3 pt-4 justify-end">
    <button type="submit" class="px-4 py-2 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600 transition text-sm">Simpan</button>
    <button type="button" class="px-4 py-2 rounded-md bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition text-sm" on:click={onCancel}>Batal</button>
  </div>
</form>
