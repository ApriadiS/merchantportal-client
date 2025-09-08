// Modul logika upload dan validasi data
import { supabase } from "../supabaseClient";
import type { PromoObject, StoreObject, PromoType } from "../type";

export type UploadResult = {
   valid: Record<string, string>[];
   dupe?: Record<string, string>[];
   error?: string;
   storeValid?: Record<string, string>[];
   storeDupe?: Record<string, string>[];
   promoValid?: Record<string, string>[];
   promoDupe?: Record<string, string>[];
};

export async function handleUploadExcel(
   file: File,
   mode: string,
   stores: StoreObject[],
   promos: PromoObject[]
): Promise<UploadResult> {
   const text = await file.text();
   const rows = text.split(/\r?\n/).filter((r) => r.trim() !== "");
   const headers = rows[0].split(",");
   const normalizedHeaders = headers.map((h) =>
      h.toLowerCase().replace(/\s+/g, "")
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
   const isHeaderValid = expectedHeaders.every(
      (h, i) => normalizedHeaders[i] === h
   );
   if (!isHeaderValid) {
      return {
         error: "Format header file tidak sesuai template. Silakan gunakan file template yang disediakan.",
         valid: [],
      };
   }
   const dataRows = rows.slice(1).map((r) => r.split(","));
   let dupe: Record<string, string>[] = [];
   let valid: Record<string, string>[] = [];
   const storeNames = stores.map((s) => s.name);
   const storeRoutes = stores.map((s) => s.route);
   const promoTitles = promos.map((p) => p.titlePromo);
   const promoVouchers = promos.map((p) => p.voucherCode);
   for (const row of dataRows) {
      let obj: Record<string, string> = {};
      headers.forEach((h, i) => (obj[h] = row[i]));
      let isDupe = false;
      if (mode === "store") {
         if (storeNames.includes(obj.name) || storeRoutes.includes(obj.route))
            isDupe = true;
      } else if (mode === "promo") {
         if (
            promoTitles.includes(obj.titlePromo) ||
            promoVouchers.includes(obj.voucherCode)
         )
            isDupe = true;
      } else if (mode === "store_promo") {
         if (storeNames.includes(obj.name) || storeRoutes.includes(obj.route))
            isDupe = true;
         if (
            promoTitles.includes(obj.titlePromo) ||
            promoVouchers.includes(obj.voucherCode)
         )
            isDupe = true;
      }
      if (isDupe) dupe.push(obj);
      else valid.push(obj);
   }
   if (mode === "promo") {
      const showKeys = [
         "titlePromo",
         "tenorPromo",
         "minTransactionPromo",
         "freeInstallment",
         "voucherCode",
      ];
      return {
         dupe: dupe.map((o) =>
            Object.fromEntries(showKeys.map((k) => [k, o[k]]))
         ),
         valid: valid.map((o) =>
            Object.fromEntries(showKeys.map((k) => [k, o[k]]))
         ),
      };
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
      return {
         valid: [],
         storeValid,
         storeDupe,
         promoValid,
         promoDupe,
      };
   } else {
      return { dupe, valid };
   }
}

export async function saveUploadedData(
   uploadResult: UploadResult,
   uploadMode: string
) {
   let dataToSave: StoreObject[] | PromoObject[] = [];
   if (uploadMode === "store" && uploadResult && uploadResult.valid) {
      dataToSave = uploadResult.valid.map((o) => ({
         name: o["Nama Toko"] ?? "",
         company: o["Perusahaan"] ?? "",
         address: o["Alamat"] ?? "",
         route: o["Route"] ?? "",
         id: "",
      }));
      await supabase.from("store").insert(dataToSave);
   } else if (uploadMode === "promo" && uploadResult && uploadResult.valid) {
      dataToSave = uploadResult.valid.map((o) => ({
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
   } else if (uploadMode === "store_promo" && uploadResult) {
      const storeData = (uploadResult.storeValid ?? []).map((o) => ({
         name: o["Nama Toko"] ?? "",
         company: o["Perusahaan"] ?? "",
         address: o["Alamat"] ?? "",
         route: o["Route"] ?? "",
         id: "",
      }));
      const promoData = (uploadResult.promoValid ?? []).map((o) => ({
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
}
