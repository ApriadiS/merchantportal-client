import { supabase } from "./supabaseClient";
import type { PromoObject, StoreObject, PromoType } from "../types/type";
import { promos, stores, isLoading } from "../admin/adminDashboardStore";
import {
  isSaving,
  isProcessingUpload,
  uploadResult,
  uploadMode,
} from "../admin/adminDashboardModal";

export async function fetchData() {
  isLoading.set(true);
  try {
    const { data: tableStatus, error: rpcError } = await supabase.rpc(
      "check_data_promo_and_store",
    );
    if (rpcError || !tableStatus || tableStatus.length === 0) {
      stores.set([]);
      promos.set([]);
      isLoading.set(false);
      return;
    }
    const { total_stores, total_promos } = tableStatus[0];
    if (total_stores > 0) {
      const { data: storesData, error: storesError } = await supabase
        .from("store")
        .select("*");
      stores.set(storesError ? [] : storesData || []);
    } else {
      stores.set([]);
    }
    if (total_promos > 0) {
      const { data: promosData, error: promosError } = await supabase
        .from("promo")
        .select("*");
      promos.set(promosError ? [] : promosData || []);
    } else {
      promos.set([]);
    }
  } catch (err) {
    stores.set([]);
    promos.set([]);
  } finally {
    isLoading.set(false);
  }
}

export async function handleSaveData() {
  isSaving.set(true);
  let $uploadResult: any = undefined;
  let $uploadMode: string = "";
  uploadResult.subscribe((val: any) => {
    $uploadResult = val;
  })();
  uploadMode.subscribe((val: string) => {
    $uploadMode = val;
  })();
  let dataToSave: StoreObject[] | PromoObject[] = [];
  if ($uploadMode === "store" && $uploadResult && $uploadResult.valid) {
    dataToSave = $uploadResult.valid.map((o: any) => ({
      name: o["Nama Toko"] ?? "",
      company: o["Perusahaan"] ?? "",
      address: o["Alamat"] ?? "",
      route: o["Route"] ?? "",
      id: "",
    }));
    await supabase.from("store").insert(dataToSave);
  } else if ($uploadMode === "promo" && $uploadResult && $uploadResult.valid) {
    dataToSave = $uploadResult.valid.map((o: any) => ({
      titlePromo: o["Judul Promo"] ?? "",
      minTransactionPromo: parseInt(o["Minimal Transaksi"] ?? "0"),
      tenorPromo: parseInt(o["Tenor"] ?? "0"),
      subsidiPromo: parseFloat(o["Subsidi"] ?? "0"),
      adminPromo: parseFloat(o["Admin"] ?? "0"),
      adminPromoType: (o["Admin Type"] as PromoType) ?? "PERCENT",
      interestRate: parseFloat(o["Bunga"] ?? "0"),
      voucherCode: o["Voucher"] ?? "",
      startDatePromo: o["Tanggal Mulai"] ?? "",
      endDatePromo: o["Tanggal Selesai"] ?? "",
      freeInstallment: parseInt(o["Free Cicilan"] ?? "0"),
      isActive: true,
      storeIds: [],
      idPromo: "",
    }));
    await supabase.from("promo").insert(dataToSave);
  } else if ($uploadMode === "store_promo" && $uploadResult) {
    const storeData = ($uploadResult.storeValid ?? []).map((o: any) => ({
      name: o["Nama Toko"] ?? "",
      company: o["Perusahaan"] ?? "",
      address: o["Alamat"] ?? "",
      route: o["Route"] ?? "",
      id: "",
    }));
    const promoData = ($uploadResult.promoValid ?? []).map((o: any) => ({
      titlePromo: o["Judul Promo"] ?? "",
      minTransactionPromo: parseInt(o["Minimal Transaksi"] ?? "0"),
      tenorPromo: parseInt(o["Tenor"] ?? "0"),
      subsidiPromo: parseFloat(o["Subsidi"] ?? "0"),
      adminPromo: parseFloat(o["Admin"] ?? "0"),
      adminPromoType: (o["Admin Type"] as PromoType) ?? "PERCENT",
      interestRate: parseFloat(o["Bunga"] ?? "0"),
      voucherCode: o["Voucher"] ?? "",
      startDatePromo: o["Tanggal Mulai"] ?? "",
      endDatePromo: o["Tanggal Selesai"] ?? "",
      freeInstallment: parseInt(o["Free Cicilan"] ?? "0"),
      isActive: true,
      storeIds: [],
      idPromo: "",
    }));
    await supabase.from("store").insert(storeData);
    await supabase.from("promo").insert(promoData);
  }
  isSaving.set(false);
  uploadResult.set(null);
  uploadMode.set("");
  await fetchData();
}

export async function handleUploadExcel(file: File, mode: string) {
  isProcessingUpload.set(true);
  uploadResult.set(null);
  uploadMode.set(mode);
  const text = await file.text();
  const rows: string[] = text
    .split(/\r?\n/)
    .filter((r: string) => r.trim() !== "");
  const headers: string[] = rows[0].split(",");
  const normalizedHeaders: string[] = headers.map((h: string) =>
    h.toLowerCase().replace(/\s+/g, ""),
  );
  let expectedHeaders: string[] = [];
  if (mode === "store") {
    expectedHeaders = ["namatoko", "perusahaan", "alamat", "route"];
  } else if (mode === "promo") {
    expectedHeaders = [
      "judulpromo",
      "minimaltransaksi",
      "tenor",
      "subsidi",
      "admin",
      "admintype",
      "bunga",
      "voucher",
      "tanggalmulai",
      "tanggalselesai",
      "freecicilan",
    ];
  } else if (mode === "store_promo") {
    expectedHeaders = [
      "namatoko",
      "perusahaan",
      "alamat",
      "route",
      "judulpromo",
      "minimaltransaksi",
      "tenor",
      "subsidi",
      "admin",
      "admintype",
      "bunga",
      "voucher",
      "tanggalmulai",
      "tanggalselesai",
      "freecicilan",
    ];
  }
  const isHeaderValid: boolean = expectedHeaders.every(
    (h: string, i: number) => normalizedHeaders[i] === h,
  );
  if (!isHeaderValid) {
    isProcessingUpload.set(false);
    uploadResult.set({
      error:
        "Format header file tidak sesuai template. Silakan gunakan file template yang disediakan.",
      valid: [],
    });
    return;
  }
  const dataRows: string[][] = rows.slice(1).map((r: string) => r.split(","));
  let dupe: Record<string, string>[] = [];
  let valid: Record<string, string>[] = [];
  let $stores: StoreObject[] = [];
  let $promos: PromoObject[] = [];
  stores.subscribe((val: StoreObject[]) => ($stores = val))();
  promos.subscribe((val: PromoObject[]) => ($promos = val))();
  const storeNames: string[] = ($stores ?? []).map((s: StoreObject) => s.name);
  const storeRoutes: string[] = ($stores ?? []).map(
    (s: StoreObject) => s.route,
  );
  const promoTitles: string[] = ($promos ?? []).map(
    (p: PromoObject) => p.titlePromo,
  );
  const promoVouchers: string[] = ($promos ?? []).map(
    (p: PromoObject) => p.voucherCode,
  );
  for (const row of dataRows) {
    let obj: Record<string, string> = {};
    headers.forEach((h: string, i: number) => (obj[h] = row[i]));
    let isDupe = false;
    if (mode === "store") {
      if (
        storeNames.includes(obj["namatoko"]) ||
        storeRoutes.includes(obj["route"])
      )
        isDupe = true;
    } else if (mode === "promo") {
      if (
        promoTitles.includes(obj["judulpromo"]) ||
        promoVouchers.includes(obj["voucher"])
      )
        isDupe = true;
    } else if (mode === "store_promo") {
      if (
        storeNames.includes(obj["namatoko"]) ||
        storeRoutes.includes(obj["route"])
      )
        isDupe = true;
      if (
        promoTitles.includes(obj["judulpromo"]) ||
        promoVouchers.includes(obj["voucher"])
      )
        isDupe = true;
    }
    if (isDupe) dupe.push(obj);
    else valid.push(obj);
  }
  setTimeout(() => {
    isProcessingUpload.set(false);
    if (mode === "promo") {
      const showKeys = [
        "titlePromo",
        "tenorPromo",
        "minTransactionPromo",
        "freeInstallment",
        "voucherCode",
      ];
      uploadResult.set({
        dupe: dupe.map((o) =>
          Object.fromEntries(showKeys.map((k) => [k, o[k]])),
        ),
        valid: valid.map((o) =>
          Object.fromEntries(showKeys.map((k) => [k, o[k]])),
        ),
      });
    } else if (mode === "store_promo") {
      const storeKeys = ["name", "route", "isActive"];
      const promoKeys = [
        "titlePromo",
        "tenorPromo",
        "minTransactionPromo",
        "freeInstallment",
        "voucherCode",
      ];
      const storeValid = valid
        .filter((o) => o.name && o.route)
        .map((o) => Object.fromEntries(storeKeys.map((k) => [k, o[k]])));
      const storeDupe = dupe
        .filter((o) => o.name && o.route)
        .map((o) => Object.fromEntries(storeKeys.map((k) => [k, o[k]])));
      const promoValid = valid
        .filter((o) => o.titlePromo && o.voucherCode)
        .map((o) => Object.fromEntries(promoKeys.map((k) => [k, o[k]])));
      const promoDupe = dupe
        .filter((o) => o.titlePromo && o.voucherCode)
        .map((o) => Object.fromEntries(promoKeys.map((k) => [k, o[k]])));
      uploadResult.set({
        valid: [],
        storeValid,
        storeDupe,
        promoValid,
        promoDupe,
      });
    } else {
      uploadResult.set({ dupe, valid });
    }
  }, 1200);
}
