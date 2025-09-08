<script lang="ts">
  import Papa from "papaparse";
  export let isOpen: boolean;
  export let onClose: () => void;
  export let onUpload: (file: File, mode: string) => void;
  let selectedFile: File | null = null;
  let uploadError = "";
  let uploadSuccess = "";
  let uploadMode: string = "store";
  let isParsing = false;
  let parseError = "";
  let parsedData: any[] = [];

  const uploadOptions = [
    { value: "store", label: "Store" },
    { value: "promo", label: "Promo" },
    { value: "store_promo", label: "Store and Promo" },
  ];

  function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      selectedFile = target.files[0];
      uploadError = "";
      uploadSuccess = "";
    }
  }

  function handleUploadSubmit(e: Event) {
    e.preventDefault();
    uploadError = "";
    uploadSuccess = "";
    parseError = "";
    parsedData = [];
    if (!selectedFile) {
      uploadError = "Pilih file Excel terlebih dahulu.";
      return;
    }
    isParsing = true;
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<any>) => {
        parsedData = results.data;
        isParsing = false;
        if (parsedData.length === 0) {
          parseError = "File kosong atau format tidak sesuai.";
          return;
        }
        // Jika parsing sukses, lanjut ke modal validasi
        if (selectedFile) {
          onUpload(selectedFile, uploadMode);
          selectedFile = null;
        }
      },
      error: (err: Error) => {
        parseError = err.message;
        isParsing = false;
      },
    });
  }
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative max-h-[90vh] m-4 flex flex-col border border-gray-100"
    >
      <button
        class="absolute top-4 right-4 text-gray-400 hover:text-[#ff4745] transition"
        aria-label="Tutup"
        on:click={() => {
          onClose();
          selectedFile = null;
          uploadError = "";
          uploadSuccess = "";
        }}
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
      <div class="overflow-y-auto p-8 flex-1">
        <h3 class="text-2xl font-bold text-[#ff4745] mb-6 text-center">
          Upload Update Excel
        </h3>
        <form on:submit={handleUploadSubmit} class="space-y-6">
          <div class="flex justify-end mb-2">
            {#if uploadMode === "store"}
              <a
                href="/template_store.csv"
                download
                class="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition text-sm shadow"
                >Download Template Store</a
              >
            {:else if uploadMode === "promo"}
              <a
                href="/template_promo.csv"
                download
                class="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition text-sm shadow"
                >Download Template Promo</a
              >
            {:else if uploadMode === "store_promo"}
              <a
                href="/template_store_promo.csv"
                download
                class="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition text-sm shadow"
                >Download Template Store & Promo</a
              >
            {/if}
          </div>
          <div>
            <label
              for="excelFile"
              class="block text-base font-semibold text-gray-700 mb-2"
              >Pilih file CSV (.csv)</label
            >
            <input
              id="excelFile"
              type="file"
              accept=".csv"
              on:change={handleFileChange}
              class="block w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#ff4745] focus:border-[#ff4745] bg-gray-50"
            />
          </div>
          <div>
            <label
              for="uploadMode"
              class="block text-base font-semibold text-gray-700 mb-2"
              >Opsi Upload</label
            >
            <select
              id="uploadMode"
              bind:value={uploadMode}
              class="block w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#ff4745] focus:border-[#ff4745] bg-gray-50"
            >
              {#each uploadOptions as opt}
                <option value={opt.value}>{opt.label}</option>
              {/each}
            </select>
          </div>
          {#if uploadError}
            <div class="text-red-600 text-sm text-center">{uploadError}</div>
          {/if}
          {#if isParsing}
            <div class="text-[#ff4745] text-sm text-center">
              Memproses file...
            </div>
          {/if}
          {#if parseError}
            <div class="text-red-600 text-sm text-center">{parseError}</div>
          {/if}
          <div class="flex gap-3 pt-4 justify-end">
            <button
              type="submit"
              class="px-6 py-2 rounded-lg bg-[#ff4745] text-white font-bold hover:bg-red-600 transition text-base shadow"
              >Upload</button
            >
            <button
              type="button"
              class="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition text-base shadow"
              on:click={() => {
                onClose();
                selectedFile = null;
                uploadError = "";
                uploadSuccess = "";
              }}>Batal</button
            >
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
