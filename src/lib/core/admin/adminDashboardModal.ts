import { writable } from "svelte/store";

export const isUploadModalOpen = writable(false);
export const isProcessingUpload = writable(false);
export const isSaving = writable(false);
export const uploadResult = writable<any>(null);
export const uploadMode = writable<string>("");

export function handleCloseUploadModal() {
  isUploadModalOpen.set(false);
  isProcessingUpload.set(false);
  isSaving.set(false);
  uploadResult.set(null);
  uploadMode.set("");
}
