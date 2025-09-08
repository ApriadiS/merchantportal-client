<script lang="ts">
  import { onMount } from "svelte";
  import Papa from "papaparse";
  import { supabase } from "../../core/api/supabaseClient";
  import { isReloadingData } from "../../core/api/dashboardReload";
  import CollapsMenu from "./CollapsMenu.svelte";

  // LOGGING: Modal lifecycle
  console.log("[AdminDashboardUploadModal] Modal script loaded");

  export let onClose: () => void;
  export let uploadedFile: File | null;
  export let uploadMode: string;

  let parsedData: any[] = [];
  let parseError: string = "";
  let formatError: string = "";
  let showFormatModal = false;
  let isParsing = false;
  let validStore: any[] = [];
  let duplicateStore: any[] = [];
  let validPromo: any[] = [];
  let duplicatePromo: any[] = [];
  let isCheckingDuplicate = false;

  let isSaving = false;
  let saveError: string = "";
  let saveSuccess: string = "";

  onMount(async () => {
    console.log("[AdminDashboardUploadModal] onMount called", {
      uploadedFile,
      uploadMode,
    });
    if (uploadedFile) {
      console.log(
        "[AdminDashboardUploadModal] Mulai parsing file",
        uploadedFile.name,
      );
      isParsing = true;
      Papa.parse(uploadedFile, {
        header: true,
        skipEmptyLines: true,
        complete: async (results: Papa.ParseResult<any>) => {
          console.log("[AdminDashboardUploadModal] Parsing selesai", {
            results,
          });
          // Ambil kolom dari meta.fields
          const csvFieldsRaw = results.meta?.fields ?? [];
          const csvFields = csvFieldsRaw.map((f) =>
            f.toLowerCase().replace(/\s+/g, ""),
          );
          let templateFieldsRaw: string[] = [];
          let templateFields: string[] = [];
          if (uploadMode === "store") {
            templateFieldsRaw = ["Nama Toko", "Perusahaan", "Alamat", "Route"];
            templateFields = templateFieldsRaw.map((f) =>
              f.toLowerCase().replace(/\s+/g, ""),
            );
          } else if (uploadMode === "promo") {
            templateFieldsRaw = [
              "Judul Promo",
              "Minimal Transaksi",
              "Tenor",
              "Subsidi",
              "Admin",
              "Admin Type",
              "Bunga",
              "Voucher",
              "Tanggal Mulai",
              "Tanggal Selesai",
              "Free Cicilan",
            ];
            templateFields = templateFieldsRaw.map((f) =>
              f.toLowerCase().replace(/\s+/g, ""),
            );
          } else if (uploadMode === "store_promo") {
            templateFieldsRaw = [
              "Nama Toko",
              "Perusahaan",
              "Alamat",
              "Route",
              "Judul Promo",
              "Minimal Transaksi",
              "Tenor",
              "Subsidi",
              "Admin",
              "Admin Type",
              "Bunga",
              "Voucher",
              "Tanggal Mulai",
              "Tanggal Selesai",
              "Free Cicilan",
            ];
            templateFields = templateFieldsRaw.map((f) =>
              f.toLowerCase().replace(/\s+/g, ""),
            );
          }
          // Bandingkan jumlah dan nama kolom
          const isFormatValid =
            csvFields.length === templateFields.length &&
            csvFields.every((f, i) => f === templateFields[i]);
          if (!isFormatValid) {
            formatError = `Format kolom tidak sesuai template.\nKolom file: ${csvFieldsRaw.join(", ")}\nKolom template: ${templateFieldsRaw.join(", ")}`;
            showFormatModal = true;
            isParsing = false;
            return;
          }
          parsedData = results.data;
          parseError = "";
          isParsing = false;
          console.log(
            "[AdminDashboardUploadModal] Data hasil parsing",
            parsedData,
          );
          await checkDuplicate(parsedData);
        },
        error: (err: Error) => {
          console.error("[AdminDashboardUploadModal] ERROR parsing file", err);
          parseError = err.message;
          parsedData = [];
          isParsing = false;
        },
      });
    } else {
      console.warn(
        "[AdminDashboardUploadModal] Tidak ada file untuk diparsing",
      );
    }
  });

  async function checkDuplicate(data: any[]) {
    isCheckingDuplicate = true;
    validStore = [];
    duplicateStore = [];
    validPromo = [];
    duplicatePromo = [];

    // LOGGING: Data hasil parsing sebelum validasi
    console.log("[checkDuplicate] Data hasil parsing:", data);
    console.log("[checkDuplicate] uploadMode:", uploadMode);

    if (uploadMode === "store" || uploadMode === "store_promo") {
      const { data: stores, error: storeErr } = await supabase
        .from("store")
        .select("name,route");
      console.log("[checkDuplicate] stores from DB:", stores);
      if (storeErr) {
        parseError = "Gagal mengambil data store dari database";
        isCheckingDuplicate = false;
        return;
      }
      // Jika database store kosong, semua data dianggap valid
      if (!stores || stores.length === 0) {
        for (const row of data) {
          console.log("[checkDuplicate] DB kosong, row dianggap valid:", row);
          const namaToko =
            row["Nama Toko"] ?? row["name"] ?? row["nama_toko"] ?? "";
          const perusahaan =
            row["Perusahaan"] ?? row["company"] ?? row["Company"] ?? "";
          const alamat =
            row["Alamat"] ?? row["address"] ?? row["Address"] ?? "";
          const route = row["Route"] ?? row["route"] ?? "";
          const validObj = {
            "Nama Toko": namaToko,
            Route: route,
            Company: perusahaan,
            Address: alamat,
          };
          validStore.push(validObj);
          console.log("[checkDuplicate] validStore (added):", validObj);
        }
      } else {
        const storeRoutes = new Set(stores.map((s: any) => s.route));
        const storeNames = new Set(stores.map((s: any) => s.name));
        for (const row of data) {
          console.log("[checkDuplicate] Row store:", row);
          const namaToko =
            row["Nama Toko"] ?? row["name"] ?? row["nama_toko"] ?? "";
          const perusahaan =
            row["Perusahaan"] ?? row["company"] ?? row["Company"] ?? "";
          const alamat =
            row["Alamat"] ?? row["address"] ?? row["Address"] ?? "";
          const route = row["Route"] ?? row["route"] ?? "";
          if (
            (route && storeRoutes.has(route)) ||
            (namaToko && storeNames.has(namaToko))
          ) {
            const dupObj = {
              "Nama Toko": namaToko,
              Route: route,
              Company: perusahaan,
              Address: alamat,
            };
            duplicateStore.push(dupObj);
            console.log("[checkDuplicate] duplicateStore (added):", dupObj);
          } else {
            const validObj = {
              "Nama Toko": namaToko,
              Route: route,
              Company: perusahaan,
              Address: alamat,
            };
            validStore.push(validObj);
            console.log("[checkDuplicate] validStore (added):", validObj);
          }
        }
      }
    }

    if (uploadMode === "promo" || uploadMode === "store_promo") {
      const { data: promos, error: promoErr } = await supabase
        .from("promo")
        .select("title_promo,voucher_code");
      if (promoErr) {
        parseError = "Gagal mengambil data promo dari database";
        isCheckingDuplicate = false;
        return;
      }
      const promoTitles = new Set(promos.map((p: any) => p.title_promo));
      const promoVouchers = new Set(promos.map((p: any) => p.voucher_code));
      for (const row of data) {
        // LOGGING: Row yang sedang diproses
        console.log("[checkDuplicate] Row promo:", row);
        const judulPromo =
          row["Judul Promo"] ?? row["title_promo"] ?? row["judul_promo"] ?? "";
        const tenor = row["Tenor"] ?? row["tenor"] ?? "";
        const voucher =
          row["Voucher"] ?? row["voucher_code"] ?? row["voucher"] ?? "";
        const tanggalSelesai =
          row["Tanggal Selesai"] ??
          row["end_date_promo"] ??
          row["tanggal_selesai"] ??
          "";
        if (
          (judulPromo && promoTitles.has(judulPromo)) ||
          (voucher && promoVouchers.has(voucher))
        ) {
          duplicatePromo.push({
            "Judul Promo": judulPromo,
            Tenor: tenor,
            Voucher: voucher,
            "Tanggal Selesai": tanggalSelesai,
          });
        } else {
          validPromo.push({
            "Judul Promo": judulPromo,
            Tenor: tenor,
            Voucher: voucher,
            "Tanggal Selesai": tanggalSelesai,
          });
        }
      }
    }
    // LOGGING: Data hasil validasi
    console.log("[checkDuplicate] validStore:", validStore);
    console.log("[checkDuplicate] duplicateStore:", duplicateStore);
    console.log("[checkDuplicate] validPromo:", validPromo);
    console.log("[checkDuplicate] duplicatePromo:", duplicatePromo);
    isCheckingDuplicate = false;
  }
  // Fungsi simpan data valid ke Supabase
  async function saveValidData() {
    isSaving = true;
    saveError = "";
    saveSuccess = "";
    try {
      if (uploadMode === "store") {
        // Simpan store
        const inserts = validStore.map((row) => ({
          name: row["Nama Toko"] ?? "",
          company: row["Company"] ?? "",
          address: row["Address"] ?? "",
          route: row["Route"] ?? "",
        }));
        const { error } = await supabase.from("store").insert(inserts);
        if (error) throw error;
        saveSuccess = `Berhasil menyimpan ${inserts.length} data store.`;
      } else if (uploadMode === "promo") {
        // Simpan promo
        const inserts = validPromo.map((row) => ({
          title_promo: row["Judul Promo"] ?? "",
          min_transaction_promo: parseInt(row["Minimal Transaksi"] ?? "0"),
          tenor_promo: parseInt(row["Tenor"] ?? "0"),
          subsidi_promo: parseFloat(row["Subsidi"] ?? "0"),
          admin_promo: parseFloat(row["Admin"] ?? "0"),
          admin_promo_type: row["Admin Type"] ?? "",
          interest_rate: parseFloat(row["Bunga"] ?? "0"),
          voucher_code: row["Voucher"] ?? "",
          start_date_promo: row["Tanggal Mulai"] ?? "",
          end_date_promo: row["Tanggal Selesai"] ?? "",
          free_installment: parseInt(row["Free Cicilan"] ?? "0"),
          is_active: true,
        }));
        const { error } = await supabase.from("promo").insert(inserts);
        if (error) throw error;
        saveSuccess = `Berhasil menyimpan ${inserts.length} data promo.`;
      } else if (uploadMode === "store_promo") {
        // Simpan store dan promo
        // 1. Simpan store
        const storeInserts = validStore.map((row) => ({
          name: row["Nama Toko"] ?? "",
          company: row["Company"] ?? "",
          address: row["Address"] ?? "",
          route: row["Route"] ?? "",
        }));
        const { data: storeRes, error: storeErr } = await supabase
          .from("store")
          .insert(storeInserts)
          .select();
        if (storeErr) throw storeErr;
        // 2. Simpan promo
        const promoInserts = validPromo.map((row) => ({
          title_promo: row["Judul Promo"] ?? "",
          min_transaction_promo: parseInt(row["Minimal Transaksi"] ?? "0"),
          tenor_promo: parseInt(row["Tenor"] ?? "0"),
          subsidi_promo: parseFloat(row["Subsidi"] ?? "0"),
          admin_promo: parseFloat(row["Admin"] ?? "0"),
          admin_promo_type: row["Admin Type"] ?? "",
          interest_rate: parseFloat(row["Bunga"] ?? "0"),
          voucher_code: row["Voucher"] ?? "",
          start_date_promo: row["Tanggal Mulai"] ?? "",
          end_date_promo: row["Tanggal Selesai"] ?? "",
          free_installment: parseInt(row["Free Cicilan"] ?? "0"),
          is_active: true,
        }));
        const { data: promoRes, error: promoErr } = await supabase
          .from("promo")
          .insert(promoInserts)
          .select();
        if (promoErr) throw promoErr;
        // 3. Simpan relasi promo_store
        // Asosiasikan store dan promo berdasarkan urutan
        if (storeRes && promoRes) {
          const promoStoreInserts = storeRes.map((store, idx) => ({
            promo_id: promoRes[idx]?.id_promo,
            store_id: store.id,
          }));
          const { error: relErr } = await supabase
            .from("promo_store")
            .insert(promoStoreInserts);
          if (relErr) throw relErr;
        }
        saveSuccess = `Berhasil menyimpan ${storeInserts.length} data store dan ${promoInserts.length} data promo.`;
      }
      // Trigger reload data dashboard
      isReloadingData.set(true);
      // Melakukan refresh halaman
      onClose();
    } catch (err: any) {
      saveError = err.message ?? "Gagal menyimpan data.";
    }
    isSaving = false;
  }
</script>

{#if uploadedFile}
  {#if showFormatModal}
    <div
      class="fixed inset-0 z-60 flex items-center justify-center bg-black/40"
    >
      <div
        class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md flex flex-col items-center"
      >
        <h4 class="text-lg font-bold text-red-700 mb-2">Format Salah</h4>
        <div class="text-sm text-gray-700 whitespace-pre-line mb-4">
          {formatError}
        </div>
        <button
          class="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition text-sm"
          on:click={() => (showFormatModal = false)}>Tutup</button
        >
      </div>
    </div>
  {:else}
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
    >
      <div
        class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl flex flex-col"
      >
        <h3 class="text-xl font-bold text-gray-800 mb-4">Validasi Data</h3>
        <div class="mb-2 text-sm text-gray-600">File: {uploadedFile?.name}</div>
        <div class="mb-2 text-sm text-gray-600">Mode Upload: {uploadMode}</div>
        {#if isParsing || isCheckingDuplicate}
          <div class="text-[#ff4745] font-semibold mb-4">Memproses file...</div>
        {:else if parseError}
          <div class="text-red-600 font-bold mb-4">{parseError}</div>
        {:else}
          <div class="mb-4 text-green-700 font-semibold">
            Data berhasil diparsing: {parsedData.length} baris
          </div>
          <!-- Collaps UI -->
          {#if uploadMode === "store"}
            <CollapsMenu
              title="Data Store Valid"
              data={validStore}
              type="store"
            />
            <CollapsMenu
              title="Data Store Duplicate"
              data={duplicateStore}
              type="store"
            />
          {:else if uploadMode === "promo"}
            <CollapsMenu
              title="Data Promo Valid"
              data={validPromo}
              type="promo"
            />
            <CollapsMenu
              title="Data Promo Duplicate"
              data={duplicatePromo}
              type="promo"
            />
          {:else if uploadMode === "store_promo"}
            <CollapsMenu
              title="Data Store Valid"
              data={validStore}
              type="store"
            />
            <CollapsMenu
              title="Data Store Duplicate"
              data={duplicateStore}
              type="store"
            />
            <CollapsMenu
              title="Data Promo Valid"
              data={validPromo}
              type="promo"
            />
            <CollapsMenu
              title="Data Promo Duplicate"
              data={duplicatePromo}
              type="promo"
            />
          {/if}
        {/if}
        <div class="flex flex-col gap-2 mt-6">
          {#if saveError}
            <div class="text-red-600 font-bold">{saveError}</div>
          {/if}
          {#if saveSuccess}
            <div class="text-green-600 font-bold">{saveSuccess}</div>
          {/if}
          <div class="flex justify-end gap-2">
            <button
              class="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-sm"
              on:click={saveValidData}
              disabled={isSaving}
            >
              {isSaving ? "Menyimpan..." : "Simpan Data Valid"}
            </button>
            <button
              class="px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition text-sm"
              on:click={onClose}
              disabled={isSaving}>Tutup</button
            >
          </div>
        </div>
      </div>
    </div>
  {/if}
{/if}
