<script lang="ts">
  import { log } from "../../core/utils/logger";
  log("PromoManager loaded");

  import PromoForm from "./PromoForm.svelte";
  import PromoCard from "./PromoCard.svelte";
  import Button from "../shared/Button.svelte";
  import { supabase } from "../../core/api/supabaseClient";
  // ...existing code...
  import type { PromoObject, StoreObject } from "../../core/types/type";

  export let promos: PromoObject[] = [];
  export let setPromos: (promos: PromoObject[]) => void;
  export let stores: StoreObject[] = [];

  // Batch selection state
  let selectedPromos: string[] = [];
  let selectAll: boolean = false;

  function toggleSelectPromo(id: string) {
    if (selectedPromos.includes(id)) {
      selectedPromos = selectedPromos.filter((pid) => pid !== id);
    } else {
      selectedPromos = [...selectedPromos, id];
    }
  }

  function toggleSelectAll() {
    if (selectAll) {
      selectedPromos = [];
      selectAll = false;
    } else {
      selectedPromos = promos.map((p) => p.idPromo);
      selectAll = true;
    }
  }

  function handleBatchDelete() {
    if (selectedPromos.length === 0) return;
    if (confirm(`Hapus ${selectedPromos.length} promo terpilih?`)) {
      setPromos(promos.filter((p) => !selectedPromos.includes(p.idPromo)));
      selectedPromos = [];
      selectAll = false;
    }
  }

  let editingPromoId: string | null = null;
  let isPromoFormVisible = false;
  let newPromo: Partial<PromoObject> = {
    titlePromo: "",
    minTransactionPromo: 0,
    tenorPromo: 0,
    subsidiPromo: 0,
    adminPromo: 0,
    adminPromoType: "PERCENT",
    interestRate: 2.6,
    voucherCode: "",
    isActive: true,
    startDatePromo: "",
    endDatePromo: "",
    storeIds: [],
    freeInstallment: 0,
  };
  let minTransactionDisplay = "";
  let adminPromoDisplay = "";

  function resetPromoForm() {
    editingPromoId = null;
    newPromo = {
      titlePromo: "",
      minTransactionPromo: 0,
      tenorPromo: 0,
      subsidiPromo: 0,
      adminPromo: 0,
      adminPromoType: "PERCENT",
      interestRate: 2.6,
      voucherCode: "",
      isActive: true,
      startDatePromo: "",
      endDatePromo: "",
      storeIds: [],
      freeInstallment: 0,
    };
    minTransactionDisplay = "";
    adminPromoDisplay = "";
    isPromoFormVisible = false;
  }
  function handleEditPromoClick(promo: PromoObject) {
    editingPromoId = promo.idPromo;
    newPromo = { ...promo };
    minTransactionDisplay = formatCurrencyInput(promo.minTransactionPromo);
    adminPromoDisplay =
      promo.adminPromoType === "FIX"
        ? formatCurrencyInput(promo.adminPromo)
        : String(promo.adminPromo);
    isPromoFormVisible = true;
    window.scrollTo(0, 0);
  }
  // Modal konfirmasi hapus
  let showDeleteModal = false;
  let deletePromoId: string | null = null;
  let deletePromoTitle: string = "";

  function handleDeletePromo(id: string) {
    const promo = promos.find((p) => p.idPromo === id);
    deletePromoId = id;
    deletePromoTitle = promo?.titlePromo ?? "";
    showDeleteModal = true;
  }

  async function confirmDeletePromo() {
    if (deletePromoId) {
      // Hapus di Supabase
      const { error } = await supabase
        .from("promo")
        .delete()
        .eq("idPromo", deletePromoId);
      if (!error) {
        setPromos(promos.filter((p) => p.idPromo !== deletePromoId));
        resetPromoForm();
      } else {
        alert("Gagal menghapus promo di server!");
      }
      showDeleteModal = false;
      deletePromoId = null;
      deletePromoTitle = "";
    }
  }

  function cancelDeletePromo() {
    showDeleteModal = false;
    deletePromoId = null;
    deletePromoTitle = "";
  }
  function handlePromoInputChange(e: Event) {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { id, value, type } = target;
    if (id === "adminPromoType") {
      newPromo = { ...newPromo, adminPromoType: value as "PERCENT" | "FIX" };
      adminPromoDisplay = "";
      return;
    }
    if (id === "adminPromo") {
      let numericValue;
      if (newPromo.adminPromoType === "FIX") {
        numericValue = parseCurrencyInput(value);
        adminPromoDisplay = formatCurrencyInput(value);
      } else {
        numericValue = parseFloat(value) || 0;
        adminPromoDisplay = value;
      }
      newPromo = { ...newPromo, adminPromo: numericValue };
      return;
    }
    if (id === "freeInstallment") {
      newPromo = { ...newPromo, freeInstallment: Number(value) };
      return;
    }
    const isNumberField = [
      "tenorPromo",
      "subsidiPromo",
      "interestRate",
    ].includes(id);
    newPromo = {
      ...newPromo,
      [id]: isNumberField ? (value === "" ? "" : parseFloat(value)) : value,
    };
  }
  function handlePromoCurrencyInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const { id, value } = target;
    const formatted = formatCurrencyInput(value);
    const numeric = parseCurrencyInput(value);
    if (id === "minTransactionPromo") {
      minTransactionDisplay = formatted;
      newPromo = { ...newPromo, [id]: numeric };
    }
  }
  function handlePromoFormSubmit(e: Event) {
    e.preventDefault();
    if (editingPromoId) {
      setPromos(
        promos.map((p) =>
          p.idPromo === editingPromoId
            ? ({ ...newPromo, idPromo: editingPromoId } as PromoObject)
            : p,
        ),
      );
    } else {
      setPromos([...promos, newPromo as PromoObject]);
    }
    resetPromoForm();
  }
  function formatCurrencyInput(value: string | number): string {
    const strValue = String(value).replace(/[^0-9]/g, "");
    if (strValue === "") return "";
    const num = Number(strValue);
    return `Rp ${new Intl.NumberFormat("id-ID").format(num)}`;
  }
  function parseCurrencyInput(value: string): number {
    return Number(String(value).replace(/[^0-9]/g, ""));
  }
</script>

<div class="space-y-5">
  <div class="flex items-center justify-between mb-6 px-4 sm:px-0">
    <span class="text-lg font-semibold">Daftar Promo</span>
    <button
      type="button"
      aria-label="Tambah Promo"
      class="rounded-full bg-red-600 text-white p-2 shadow hover:bg-red-700 transition"
      on:click={() => (isPromoFormVisible = true)}
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

  {#if isPromoFormVisible}
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
    >
      <div
        class="bg-white rounded-xl shadow-2xl w-full max-w-lg relative max-h-[90vh] m-4 flex flex-col"
      >
        <button
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          aria-label="Tutup"
          on:click={resetPromoForm}
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
        <div class="overflow-y-auto p-6 sm:p-8 flex-1">
          <h3 class="text-xl font-bold text-gray-800 mb-6">
            {editingPromoId ? "Edit Promo" : "Buat Promo Baru"}
          </h3>
          <PromoForm
            promo={{
              idPromo: newPromo.idPromo ?? "",
              titlePromo: newPromo.titlePromo ?? "",
              minTransactionPromo: newPromo.minTransactionPromo ?? 0,
              tenorPromo: newPromo.tenorPromo ?? 0,
              subsidiPromo: newPromo.subsidiPromo ?? 0,
              adminPromo: newPromo.adminPromo ?? 0,
              adminPromoType: newPromo.adminPromoType ?? "PERCENT",
              interestRate: newPromo.interestRate ?? 2.6,
              voucherCode: newPromo.voucherCode ?? "",
              isActive: newPromo.isActive ?? true,
              startDatePromo: newPromo.startDatePromo ?? "",
              endDatePromo: newPromo.endDatePromo ?? "",
              storeIds: newPromo.storeIds ?? [],
              freeInstallment: newPromo.freeInstallment ?? 0,
            }}
            {stores}
            {minTransactionDisplay}
            {adminPromoDisplay}
            onInputChange={handlePromoInputChange}
            onCurrencyInputChange={handlePromoCurrencyInputChange}
            onSubmit={handlePromoFormSubmit}
            onCancel={resetPromoForm}
          />
        </div>
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
            on:click={cancelDeletePromo}
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
            <h3 class="text-xl font-bold text-gray-800 mb-2">Hapus Promo?</h3>
            <p class="text-gray-600 mb-4">
              Promo <span class="font-semibold text-[#ff4745]"
                >{deletePromoTitle}</span
              > akan dihapus secara permanen.
            </p>
            <div class="flex gap-3 pt-2 justify-center w-full">
              <button
                type="button"
                class="px-6 py-2 rounded-lg bg-[#ff4745] text-white font-bold hover:bg-red-600 transition text-base shadow w-1/2"
                on:click={confirmDeletePromo}>Hapus</button
              >
              <button
                type="button"
                class="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition text-base shadow w-1/2"
                on:click={cancelDeletePromo}>Batal</button
              >
            </div>
          </div>
        </div>
      </div>
    {/if}
    <div class="flex items-center gap-2 mb-4">
      {#if selectedPromos.length > 0}
        <input
          type="checkbox"
          id="selectAllPromo"
          checked={selectAll}
          on:change={toggleSelectAll}
          class="h-4 w-4 rounded border-gray-300"
        />
        <label for="selectAllPromo" class="text-sm">Pilih Semua</label>
        <button
          type="button"
          class="px-3 py-1 rounded bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition"
          on:click={handleBatchDelete}>Hapus Terpilih</button
        >
      {/if}
    </div>
    {#each promos as promo}
      <PromoCard
        {promo}
        {stores}
        selected={selectedPromos.includes(promo.idPromo)}
        onEdit={handleEditPromoClick}
        onDelete={handleDeletePromo}
        onToggleActive={(promoObj) => {
          promoObj.isActive = !promoObj.isActive;
          setPromos(
            promos.map((p) =>
              p.idPromo === promoObj.idPromo ? { ...promoObj } : p,
            ),
          );
        }}
        onSelect={toggleSelectPromo}
      />
    {/each}
  </div>
</div>
