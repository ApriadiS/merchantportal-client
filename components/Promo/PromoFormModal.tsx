"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { PromoRequest, PromoResponse } from "@/utils/interface";
import type { StoreResponse } from "@/utils/interface";
import { createPromo, updatePromo } from "@services/database/client/promos";
import {
   getPromoStoresByStoreId,
   addPromoToStore,
   removePromoFromStore,
   getPromoStoresByPromoId,
} from "@services/database/client/promo_store";
import { getAllStores, getStoresByIds } from "@services/database/client/stores";
import { useToast } from "@components/hooks/useToast";
import { Input } from "@/components/ui/input";
import useCurrency from "@hooks/useCurrency";
import { formatPercent } from "@/utils/format";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
   open: boolean;
   onClose: () => void;
   onCreated?: (p: PromoResponse) => void;
   onUpdated?: (p: PromoResponse) => void;
   initial?: PromoResponse | null;
}

export default function PromoFormModal({
   open,
   onClose,
   onCreated,
   onUpdated,
   initial = null,
}: Props) {
   const [title, setTitle] = useState("");
   const [voucher, setVoucher] = useState("");
   // currency-aware states
   const [minNormal, , minCurrency, setMin] = useCurrency(0);
   // use string state for radio-group values for easier binding
   const [tenor, setTenor] = useState<string>(String(1));
   // subsidi is a percentage (e.g. 5 means 5%)
   const [subsidiPercent, setSubsidiPercent] = useState<number | "">(0);
   // admin can be FIX (currency) or PERCENT (percentage) -> store as numeric value
   const [adminValue, setAdminValue] = useState<number | "">(0);
   // align adminType values with DB (uses uppercase 'FIX' / 'PERCENT')
   const [adminType, setAdminType] = useState<string>("FIX");
   const [interest, setInterest] = useState<number | "">(0);
   const [startDate, setStartDate] = useState<string>(
      new Date().toISOString().slice(0, 10)
   );
   const [endDate, setEndDate] = useState<string>(
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10)
   );
   const [freeInstallment, setFreeInstallment] = useState<number | "">(0);
   const [isActive, setIsActive] = useState<boolean>(true);
   const [loading, setLoading] = useState(false);
   const { push } = useToast();
   const [errors, setErrors] = useState<Record<string, string>>({});

   // store mapping state (used when editing)
   const [assignedMappings, setAssignedMappings] = useState<
      { id: number; store: StoreResponse }[]
   >([]);
   const [allStores, setAllStores] = useState<StoreResponse[]>([]);
   const [mappingLoading, setMappingLoading] = useState(false);
   const [mappingError, setMappingError] = useState<string | null>(null);
   const [selectedStoreToAdd, setSelectedStoreToAdd] = useState<string>("");

   // use server actions directly instead of Refine mutations

   useEffect(() => {
      if (initial) {
         setTitle(initial.title_promo || "");
         setVoucher(initial.voucher_code || "");
         setMin(initial.min_transaction_promo ?? 0);
         setTenor(String(initial.tenor_promo ?? 1));
         setSubsidiPercent(initial.subsidi_promo ?? 0);
         setAdminValue(initial.admin_promo ?? 0);
         // preserve the DB value (likely 'FIX' or 'PERCENT') so radio selection matches
         setAdminType(String(initial.admin_promo_type ?? "FIX"));
         setInterest(initial.interest_rate ?? 0);
         setStartDate(
            initial.start_date_promo ?? new Date().toISOString().slice(0, 10)
         );
         setEndDate(
            initial.end_date_promo ??
               new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
                  .toISOString()
                  .slice(0, 10)
         );
         setFreeInstallment(initial.free_installment ?? 0);
         setIsActive(initial.is_active ?? true);
      } else {
         setTitle("");
         setVoucher("");
         setMin(0);
         setTenor(String(6));
         setSubsidiPercent(0);
         setAdminValue(0);
         setAdminType("FIX");
         setInterest(0);
         setStartDate(new Date().toISOString().slice(0, 10));
         setEndDate(
            new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
               .toISOString()
               .slice(0, 10)
         );
         setFreeInstallment(0);
         setIsActive(true);
      }
   }, [initial, open, setMin]);

   // load mappings and stores when editing an existing promo
   useEffect(() => {
      let mounted = true;
      async function loadMappings() {
         if (!open || !initial || !initial.id_promo) return;
         setMappingLoading(true);
         setMappingError(null);
         try {
            const maps = await getPromoStoresByPromoId(initial.id_promo);
            const storeIds = maps
               .map((m) => m.store_id)
               .filter(Boolean) as number[];

            let assigned: { id: number; store: StoreResponse }[] = [];
            if (storeIds.length > 0) {
               const sRows = await getStoresByIds(storeIds);
               assigned = maps
                  .map((m) => ({
                     id: m.id,
                     store: sRows.find((s) => s.id === m.store_id)!,
                  }))
                  .filter((x) => x.store !== undefined);
            }

            const all = await getAllStores();

            if (mounted) {
               setAssignedMappings(assigned);
               setAllStores(all);
            }
         } catch (err) {
            console.error("PromoFormModal: failed to load mappings", err);
            if (mounted)
               setMappingError(
                  err instanceof Error ? err.message : String(err)
               );
         } finally {
            if (mounted) setMappingLoading(false);
         }
      }
      loadMappings();
      return () => {
         mounted = false;
      };
   }, [open, initial]);

   // Tambah: load allStores saat tambah promo (initial null)
   useEffect(() => {
      let mounted = true;
      async function loadAllStores() {
         if (!open || initial) return;
         try {
            const all = await getAllStores();
            if (mounted) setAllStores(all);
         } catch {
            // optional: handle error
         }
      }
      loadAllStores();
      return () => {
         mounted = false;
      };
   }, [open, initial]);
   const isEditing = Boolean(initial && initial.id_promo);

   // helper to parse user-typed currency/number strings into integer (no decimals)
   const parseCurrencyInput = (s: string) => {
      const digits = String(s).replace(/[^0-9-]/g, "");
      if (!digits) return 0;
      try {
         return Math.trunc(parseInt(digits, 10) || 0);
      } catch {
         return 0;
      }
   };

   const availableStoresToAdd = allStores.filter(
      (s) => !assignedMappings.some((m) => m.store.id === s.id)
   );

   const addStoreToPromo = async (storeId: number) => {
      setMappingLoading(true);
      try {
         if (!initial || !initial.id_promo) {
            // Mode tambah: hanya update assignedMappings lokal
            const sRow = allStores.find((s) => s.id === storeId);
            if (!sRow) return;
            setAssignedMappings((prev) => [
               ...prev,
               { id: Date.now(), store: sRow }, // id dummy
            ]);
            setSelectedStoreToAdd("");
            push({
               type: "success",
               message: "Store berhasil ditambahkan (draft)",
            });
            return;
         }
         // Mode edit: tetap gunakan logic lama
         // ensure no conflicting promo title exists for this store
         const existingMaps = await getPromoStoresByStoreId(storeId);
         const existingPromoIds = existingMaps.map((r) => r.promo_id);
         if (existingPromoIds.length > 0) {
            const { getPromoById } = await import(
               "@services/database/client/promos"
            );
            const promos = await Promise.all(
               existingPromoIds.map((id) => getPromoById(id))
            );
            const conflicting = promos.find(
               (pr) =>
                  (pr?.title_promo || "") === (title || initial.title_promo)
            );
            if (conflicting) {
               push({
                  type: "error",
                  message: "Store sudah memiliki promo dengan judul yang sama",
               });
               return;
            }
         }
         const ins = await addPromoToStore({
            promo_id: initial.id_promo,
            store_id: storeId,
         });
         const [sRow] = await getStoresByIds([storeId]);
         setAssignedMappings((prev) => [
            ...prev,
            { id: ins.id, store: sRow as StoreResponse },
         ]);
         setSelectedStoreToAdd("");
         push({
            type: "success",
            message: "Promo berhasil ditambahkan ke store",
         });
      } catch (err) {
         console.error("Failed to add promo to store", err);
         push({
            type: "error",
            message: "Gagal menambahkan promo ke store",
         });
      } finally {
         setMappingLoading(false);
      }
   };

   const removeMapping = async (mappingId: number) => {
      setMappingLoading(true);
      try {
         await removePromoFromStore(mappingId);
         setAssignedMappings((prev) => prev.filter((m) => m.id !== mappingId));
         push({ type: "success", message: "Promo dihapus dari store" });
      } catch (err) {
         console.error("Failed to remove promo mapping", err);
         push({
            type: "error",
            message: "Gagal menghapus mapping promo-store",
         });
      } finally {
         setMappingLoading(false);
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
         const errs: Record<string, string> = {};
         if (!title || title.trim().length < 3)
            errs.title = "Title minimal 3 karakter";
         if (minNormal < 0) errs.minTx = "Min transaction tidak boleh negatif";
         setErrors(errs);
         if (Object.keys(errs).length > 0) return;

         const payload: PromoRequest = {
            title_promo: title,
            min_transaction_promo: Number(minNormal) || 0,
            tenor_promo: Number(tenor) || initial?.tenor_promo || 1,
            admin_promo: Number(adminValue) || initial?.admin_promo || 0,
            admin_promo_type: adminType || initial?.admin_promo_type || "FIX",
            interest_rate: Number(interest) || initial?.interest_rate || 0,
            voucher_code: voucher,
            start_date_promo: startDate,
            end_date_promo: endDate,
            subsidi_promo:
               Number(subsidiPercent) || initial?.subsidi_promo || 0,
            free_installment:
               Number(freeInstallment) || initial?.free_installment || 0,
            is_active: isActive,
         };

         if (isEditing && initial) {
            await updatePromo(initial.id_promo as number, payload);
            onUpdated?.({
               ...(initial as PromoResponse),
               ...payload,
            } as PromoResponse);
            push({
               type: "success",
               message: "Promo berhasil diperbarui",
            });
         } else {
            // Buat promo baru
            const created = await createPromo(payload);
            // Jika ada assignedMappings, tambahkan relasi ke promo_store
            if (created && assignedMappings.length > 0) {
               for (const m of assignedMappings) {
                  try {
                     await addPromoToStore({
                        promo_id: created.id_promo,
                        store_id: m.store.id,
                     });
                  } catch {
                     // Optional: tampilkan error toast jika gagal satu store
                  }
               }
            }
            onCreated?.(created as PromoResponse);
            push({ type: "success", message: "Promo berhasil dibuat" });
         }

         onClose();
      } catch (err) {
         console.error(err);
         push({ type: "error", message: "Gagal menyimpan promo" });
      } finally {
         setLoading(false);
      }
   };
   // Don't render anything when modal is closed to avoid it showing on page load
   if (!open) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden py-8">
         <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={onClose}
         />
         <form
            onSubmit={handleSubmit}
            className="relative z-50 bg-white rounded-t-lg p-6 w-full max-w-md md:rounded-md md:w-[550px] shadow-lg max-h-[85vh] overflow-y-auto overflow-x-hidden mx-4"
            style={{ WebkitOverflowScrolling: "touch" }}
         >
            <h3 className="text-lg font-semibold mb-4">
               {isEditing ? "Edit Promo" : "Tambah Promo"}
            </h3>
            <div className="flex flex-col gap-2 min-w-0">
               <Label className="text-sm">Title</Label>
               <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
               />
               {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
               )}

               <Label className="text-sm">Voucher Code</Label>
               <Input
                  value={voucher}
                  onChange={(e) => setVoucher(e.target.value)}
               />

               <Label className="text-sm">Min Transaction</Label>
               <Input
                  type="text"
                  value={minCurrency}
                  onChange={(e) => setMin(parseCurrencyInput(e.target.value))}
               />
               {errors.minTx && (
                  <p className="text-sm text-red-500">{errors.minTx}</p>
               )}

               <Label className="text-sm">Tenor (bulan)</Label>
               <RadioGroup
                  value={tenor}
                  onValueChange={(v) => setTenor(String(v))}
                  aria-label="Tenor (bulan)"
               >
                  <div className="flex gap-3 mt-2">
                     <Label className="inline-flex items-center gap-2">
                        <RadioGroupItem value="6" />
                        <span className="text-sm font-normal">6 Bulan</span>
                     </Label>
                     <Label className="inline-flex items-center gap-2">
                        <RadioGroupItem value="9" />
                        <span className="text-sm font-normal">9 Bulan</span>
                     </Label>
                     <Label className="inline-flex items-center gap-2">
                        <RadioGroupItem value="12" />
                        <span className="text-sm font-normal">12 Bulan</span>
                     </Label>
                  </div>
               </RadioGroup>

               <Label className="text-sm">Subsidi (%)</Label>
               <div className="flex items-center gap-2">
                  <Input type="text" defaultValue={subsidiPercent} />
                  <Label className="text-xl font-medium">%</Label>
               </div>

               <Label className="text-sm">Admin</Label>
               <Input
                  type="text"
                  value={
                     adminType.toLowerCase() === "percent"
                        ? formatPercent(Number(adminValue ?? 0), 2)
                        : // currency
                          "Rp " +
                          (Number(adminValue ?? 0) || 0).toLocaleString("id-ID")
                  }
                  onChange={(e) =>
                     setAdminValue(parseCurrencyInput(e.target.value))
                  }
               />

               <Label className="text-sm">Tipe Admin</Label>
               <RadioGroup
                  value={adminType}
                  onValueChange={(v) => setAdminType(String(v).toUpperCase())}
                  aria-label="Tipe Admin"
               >
                  <div className="flex gap-3 mt-2">
                     <Label className="inline-flex items-center gap-2">
                        <RadioGroupItem value="FIX" />
                        <span className="text-sm font-normal">FIX</span>
                     </Label>
                     <Label className="inline-flex items-center gap-2">
                        <RadioGroupItem value="PERCENT" />
                        <span className="text-sm font-normal">PERCENT</span>
                     </Label>
                  </div>
               </RadioGroup>

               <Label className="text-sm">Interest Rate (%)</Label>
               <Input
                  type="number"
                  step="0.01"
                  value={interest as number}
                  onChange={(e) => setInterest(Number(e.target.value))}
               />

               <Label className="text-sm">Free Installment</Label>
               <RadioGroup
                  value={String(freeInstallment)}
                  onValueChange={(v) => setFreeInstallment(Number(v))}
                  className="flex flex-row gap-4 mt-1"
               >
                  <div className="flex items-center space-x-2">
                     <RadioGroupItem value="0" id="free-0" />
                     <Label htmlFor="free-0" className="text-sm">
                        Tanpa Gratis
                     </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                     <RadioGroupItem value="1" id="free-1" />
                     <Label htmlFor="free-1" className="text-sm">
                        Gratis 1x
                     </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                     <RadioGroupItem value="2" id="free-2" />
                     <Label htmlFor="free-2" className="text-sm">
                        Gratis 2x
                     </Label>
                  </div>
               </RadioGroup>

               <Label className="text-sm">Start Date</Label>
               <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
               />

               <Label className="text-sm">End Date</Label>
               <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
               />

               <div className="flex items-center gap-2">
                  <Checkbox
                     id="promo-active"
                     checked={isActive}
                     onCheckedChange={(v) => setIsActive(Boolean(v))}
                  />
                  <Label htmlFor="promo-active" className="text-sm">
                     Active
                  </Label>
               </div>

               {/* Assigned stores / mapping management */}
               <div className="mt-3">
                  <h4 className="text-sm font-medium">Assigned Stores</h4>
                  {mappingLoading && (
                     <p className="text-sm">Loading stores...</p>
                  )}
                  {mappingError && (
                     <p className="text-sm text-red-500">{mappingError}</p>
                  )}

                  {assignedMappings.length === 0 && !mappingLoading ? (
                     <p className="text-sm text-muted-foreground">
                        Tidak ada store yang ditugaskan
                     </p>
                  ) : (
                     <ul className="mt-2 space-y-2">
                        {assignedMappings.map((m) => (
                           <li
                              key={m.id}
                              className="flex items-center justify-between"
                           >
                              <div className="min-w-0">
                                 <div className="font-medium truncate">
                                    {m.store.name}
                                 </div>
                                 <div className="text-xs text-muted-foreground truncate">
                                    {m.store.company}
                                 </div>
                              </div>
                              <div>
                                 <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeMapping(m.id)}
                                    disabled={mappingLoading}
                                 >
                                    Remove
                                 </Button>
                              </div>
                           </li>
                        ))}
                     </ul>
                  )}

                  <div className="mt-3 flex gap-1 items-center">
                     <div className="flex-1 min-w-0">
                        <Select
                           value={selectedStoreToAdd}
                           onValueChange={(v) => setSelectedStoreToAdd(v)}
                        >
                           <SelectTrigger className="w-full">
                              <SelectValue placeholder="Pilih store..." />
                           </SelectTrigger>
                           <SelectContent>
                              {availableStoresToAdd.map((s) => (
                                 <SelectItem key={s.id} value={String(s.id)}>
                                    {s.name} — {s.company}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                     <div className="flex-shrink-0">
                        <Button
                           type="button"
                           onClick={() =>
                              selectedStoreToAdd !== "" &&
                              addStoreToPromo(Number(selectedStoreToAdd))
                           }
                           disabled={
                              mappingLoading || selectedStoreToAdd === ""
                           }
                        >
                           Tambah
                        </Button>
                     </div>
                  </div>
               </div>

               <div className="mt-4 flex justify-center gap-2">
                  <Button variant="outline" type="button" onClick={onClose}>
                     Batal
                  </Button>
                  <Button
                     type="submit"
                     disabled={loading}
                     onClick={handleSubmit}
                  >
                     {loading
                        ? "Menyimpan..."
                        : isEditing
                        ? "Perbarui"
                        : "Simpan"}
                  </Button>
               </div>
            </div>
         </form>
      </div>
   );
}
