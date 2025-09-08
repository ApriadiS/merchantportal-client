import type { PromoObject, StoreObject } from "../type";
import {
   saveUploadedData,
   handleUploadExcel as uploadExcelHandler,
} from "./UploadHandler";
import type { UploadResult } from "./UploadHandler";
import { promos, stores } from "../stores/adminDashboardStore";
import {
   isProcessingUpload,
   isSaving,
   uploadResult,
   uploadMode,
   handleCloseUploadModal,
} from "../stores/adminDashboardModal";

export async function handleSaveData() {
   isSaving.set(true);
   let $uploadResult: UploadResult | null = null;
   let $uploadMode: string = "";
   uploadResult.subscribe((val) => {
      $uploadResult = val;
   })();
   uploadMode.subscribe((val) => {
      $uploadMode = val;
   })();
   if ($uploadResult !== null && $uploadMode !== "") {
      await saveUploadedData($uploadResult, $uploadMode);
   }
   isSaving.set(false);
   handleCloseUploadModal();
   // fetchData harus diimport jika digunakan, atau panggil dari store
}

export async function handleUploadExcelModal(file: File, mode: string) {
   isProcessingUpload.set(true);
   uploadResult.set(null);
   uploadMode.set(mode);
   let $stores: StoreObject[] = [];
   let $promos: PromoObject[] = [];
   stores.subscribe((val) => {
      $stores = val;
   })();
   promos.subscribe((val) => {
      $promos = val;
   })();
   const result = await uploadExcelHandler(file, mode, $stores, $promos);
   uploadResult.set(result);
   isProcessingUpload.set(false);
}
