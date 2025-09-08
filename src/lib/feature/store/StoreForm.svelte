<script lang="ts">
  import Input from "./Input.svelte";
  import type { StoreObject } from "../../core/types/type";
  export let store: StoreObject;
  export let onInputChange: (e: Event) => void;
  export let onSubmit: (e: Event) => void;
  export let onCancel: () => void;
</script>

<form on:submit={onSubmit} class="space-y-5">
  <Input
    label="Nama Toko"
    value={store.name}
    id="name"
    onInput={onInputChange}
    customClass=""
  />
  <Input
    label="Nama Perusahaan"
    value={store.company}
    id="company"
    onInput={onInputChange}
    customClass=""
  />
  <Input
    label="Alamat Toko"
    value={store.address}
    id="address"
    onInput={onInputChange}
    customClass=""
  />
  <Input
    label="Route"
    value={store.route}
    id="route"
    onInput={onInputChange}
    placeholder="cth: nama-toko-unik"
    customClass=""
  />
  <div class="flex gap-3 pt-2 justify-end">
    <button
      type="submit"
      class="px-4 py-2 rounded-md bg-[#ff4745] text-white font-semibold hover:bg-red-600 transition text-sm"
      >Simpan</button
    >
    <button
      type="button"
      class="px-4 py-2 rounded-md bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition text-sm"
      on:click={onCancel}>Batal</button
    >
  </div>
</form>
