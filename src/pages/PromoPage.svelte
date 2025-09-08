<script lang="ts">
   import { log } from "../lib/core/utils/logger";
   log("PromoPage loaded");
   // lib/components/shared/Button.svelte
   import Button from "../lib/components/shared/Button.svelte";
   import { onMount } from "svelte";
   import type { PromoObject, StoreObject } from "../lib/core/types/type";

   const TENORS = [6, 9, 12];
   const DEFAULT_INTEREST_RATE_PERCENT = 2.6;
   const MAX_PRICE = 30000000;

   function formatCurrency(value: number): string {
      if (isNaN(value)) return "Rp 0";
      const roundedValue = Math.ceil(value);
      return `Rp ${roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
   }

   function parsePrice(value: string): number {
      return Number(value.replace(/[^0-9]/g, ""));
   }

   interface CalculationDetails {
      productPrice: number;
      monthlyInstallment: number;
      interestFee: number;
      totalBill: number;
      tenor: number;
   }

   let price: string = "";
   let selectedPromoId: string = "REGULER";
   let results: { [key: number]: CalculationDetails | null } = {
      6: null,
      9: null,
      12: null,
   };
   let expandedTenor: number | null = null;
   let promos: PromoObject[] = [];
   let availablePromos: PromoObject[] = [];
   let store: StoreObject = {
      id: "",
      name: "Toko Contoh",
      company: "",
      address: "",
      route: "",
   };
   let error: string | null = null;
   let isLoading = false;

   function handlePriceChange(e: Event) {
      const rawValue = (e.target as HTMLInputElement).value;
      const numericValue = parsePrice(rawValue);
      if (numericValue > MAX_PRICE) {
         price = formatCurrency(MAX_PRICE).replace("Rp ", "");
         return;
      }
      if (isNaN(numericValue)) {
         price = "";
         return;
      }
      price = new Intl.NumberFormat("id-ID").format(numericValue);
   }

   function handleCalculate(e: Event) {
      e.preventDefault();
      expandedTenor = null;
      const numericPrice = parsePrice(price);
      if (numericPrice <= 0) {
         results = { 6: null, 9: null, 12: null };
         return;
      }
      const newResults: { [key: number]: CalculationDetails | null } = {};
      TENORS.forEach((tenor) => {
         const interestRate = DEFAULT_INTEREST_RATE_PERCENT / 100;
         const totalInterest = numericPrice * interestRate * tenor;
         const monthlyInstallment =
            numericPrice / tenor + numericPrice * interestRate;
         const totalBill = numericPrice + totalInterest;
         newResults[tenor] = {
            productPrice: numericPrice,
            monthlyInstallment,
            interestFee: totalInterest,
            totalBill,
            tenor,
         };
      });
      results = newResults;
   }

   function handleToggleDetails(tenor: number) {
      expandedTenor = expandedTenor === tenor ? null : tenor;
   }

   $: currentDetails = expandedTenor ? results[expandedTenor] : null;
</script>

<div class="min-h-screen font-sans flex items-center justify-center p-4">
   <main
      class="bg-white rounded-2xl shadow-xl p-4 sm:p-8 w-full max-w-lg mx-auto"
   >
      <header class="text-center">
         <img src="/akulaku.webp" alt="Akulaku Logo" class="h-12 mx-auto" />
         <h1 class="text-2xl font-bold text-[#ff4745] mt-4">
            Simulasi Cicilan - {store?.name}
         </h1>
         <p class="text-gray-500 text-sm mt-1">
            Hitung cicilan kredit barangmu dengan mudah
         </p>
      </header>
      <hr class="my-6 border-gray-100" />
      <form on:submit={handleCalculate} class="space-y-4">
         <div class="bg-[#fff1f1] p-4 rounded-xl space-y-3">
            <div>
               <label
                  for="price"
                  class="block text-sm font-medium text-gray-700 mb-2"
                  >Harga Barang</label
               >
               <div class="relative">
                  <span
                     class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"
                     >Rp</span
                  >
                  <input
                     id="price"
                     type="text"
                     bind:value={price}
                     on:input={handlePriceChange}
                     placeholder="0"
                     class="w-full pl-9 pr-4 py-3 text-left rounded-lg border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#ff4745] focus:border-[#ff4745] transition"
                     aria-label="Harga Barang"
                     required
                  />
               </div>
            </div>
         </div>
         <div class="pt-2">
            <Button type="submit" ariaLabel="Hitung Cicilan" onClick={undefined}
               >Hitung Cicilan</Button
            >
         </div>
         <div class="bg-[#fff1f1] p-4 rounded-xl">
            <h2 class="text-center font-semibold text-[#ff4745] mb-4">
               Hasil Simulasi Cicilan
            </h2>
            <div class="grid grid-cols-3 gap-2 sm:gap-4 text-center">
               {#each Object.keys(results).map(Number) as tenor (tenor)}
                  <div class="relative">
                     <div
                        class="bg-white/70 p-3 rounded-lg flex flex-col items-center justify-center min-h-[100px]"
                     >
                        <p class="text-sm text-gray-600 h-6">{tenor} Bulan</p>
                        <p
                           class="text-sm sm:text-base font-bold text-[#ff4745] my-1 whitespace-nowrap"
                        >
                           {typeof results[tenor as number]
                              ?.monthlyInstallment === "number"
                              ? formatCurrency(
                                   results[tenor as number]
                                      ?.monthlyInstallment ?? 0
                                )
                              : "-"}
                        </p>
                        <button
                           type="button"
                           on:click={() => handleToggleDetails(Number(tenor))}
                           disabled={!results[tenor as number]}
                           aria-label={`Tampilkan rincian untuk ${tenor} bulan`}
                           aria-expanded={expandedTenor === tenor}
                           class="disabled:opacity-25"
                        >
                           {#if expandedTenor === tenor}
                              <svg
                                 class="w-5 h-5 text-[#ff4745]"
                                 fill="none"
                                 stroke="currentColor"
                                 viewBox="0 0 24 24"
                                 ><path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M5 15l7-7 7 7"
                                 ></path></svg
                              >
                           {:else}
                              <svg
                                 class="w-5 h-5 text-gray-500"
                                 fill="none"
                                 stroke="currentColor"
                                 viewBox="0 0 24 24"
                                 ><path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 9l-7 7-7-7"
                                 ></path></svg
                              >
                           {/if}
                        </button>
                     </div>
                  </div>
               {/each}
            </div>

            {#if currentDetails}
               <div
                  class="mt-4 p-5 bg-gray-100 rounded-xl text-sm text-gray-700 font-medium transition-all duration-300 ease-in-out"
               >
                  <ul class="space-y-2">
                     <li class="flex justify-between items-center">
                        <span>Harga Produk:</span>
                        <span class="font-bold text-gray-900"
                           >{formatCurrency(currentDetails.productPrice)}</span
                        >
                     </li>
                     <li class="flex justify-between items-center">
                        <span>Biaya Bunga:</span>
                        <span class="font-bold text-gray-900"
                           >{formatCurrency(currentDetails.interestFee)}</span
                        >
                     </li>
                     <li
                        class="flex justify-between items-center text-base mt-2 pt-2 border-t border-gray-300"
                     >
                        <span class="font-bold">Total Pembayaran:</span>
                        <span class="font-bold text-[#ff4745]"
                           >{formatCurrency(currentDetails.totalBill)}</span
                        >
                     </li>
                  </ul>
                  <p class="text-xs text-gray-500 mt-3 text-left">
                     Tenor: {currentDetails.tenor} bulan
                  </p>
               </div>
            {/if}
         </div>
      </form>
      <footer class="mt-6 text-center">
         <p class="text-xs text-gray-400">Powered by Akulaku</p>
         <p class="text-xs text-gray-500 mt-3 px-4 leading-relaxed">
            <b>Catatan:</b> Simulasi ini hanya perkiraan. Hubungi kami untuk detail
            promo dan kode voucher yang berlaku.
         </p>
         <a
            href="https://wa.me/6285705887356"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-4 inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 px-6 rounded-full shadow-md hover:bg-[#128C7E] active:scale-95 transition-all duration-300"
         >
            <svg
               class="w-6 h-6"
               fill="currentColor"
               viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg"
               ><path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
               /></svg
            >
            <span>Hubungi via WhatsApp</span>
         </a>
      </footer>
   </main>
</div>
