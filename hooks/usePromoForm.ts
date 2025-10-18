import { useState, useEffect } from "react";
import { PromoResponse, StoreResponse } from "@/utils/interface";
import { AdminPromoType } from "@/utils/types";
import { createPromo, updatePromo } from "@services/api/promos";
import {
   getPromoStoresByPromo,
   getPromoStoresByStore,
   createPromoStore,
   deletePromoStore,
} from "@services/api/promo_store";
import { getAllStores } from "@services/api/stores";
import { useToast } from "@/hooks/useToast-old";
import useCurrency from "@/hooks/useCurrency";

interface UsePromoFormProps {
   open: boolean;
   initial?: PromoResponse | null;
   onCreated?: (p: PromoResponse) => void;
   onUpdated?: (p: PromoResponse) => void;
   onClose: () => void;
}

export const usePromoForm = ({
   open,
   initial = null,
   onCreated,
   onUpdated,
   onClose,
}: UsePromoFormProps) => {
   const [title, setTitle] = useState("");
   const [voucher, setVoucher] = useState("");
   const [minNormal, , minCurrency, setMin] = useCurrency(0);
   const [tenor, setTenor] = useState<string>("6");
   const [subsidiPercent, setSubsidiPercent] = useState<number | "">(0);
   const [adminValue, setAdminValue] = useState<number | "">(0);
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
   const [discount, setDiscount] = useState<number | "">(0);
   const [discountType, setDiscountType] = useState<string>("FIX");
   const [maxDiscount, setMaxDiscount] = useState<number | "">(0);
   const [loading, setLoading] = useState(false);
   const [errors, setErrors] = useState<Record<string, string>>({});

   const [assignedMappings, setAssignedMappings] = useState<
      { id: number; store: StoreResponse }[]
   >([]);
   const [allStores, setAllStores] = useState<StoreResponse[]>([]);
   const [mappingLoading, setMappingLoading] = useState(false);
   const [mappingError, setMappingError] = useState<string | null>(null);
   const [selectedStoreToAdd, setSelectedStoreToAdd] = useState<string>("");

   const { push } = useToast();
   const isEditing = Boolean(initial && initial.id_promo);

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

   // Reset form when modal opens/closes or initial changes
   useEffect(() => {
      if (initial) {
         setTitle(initial.title_promo || "");
         setVoucher(initial.voucher_code || "");
         setMin(initial.min_transaction_promo ?? 0);
         setTenor(String(initial.tenor_promo ?? 6));
         setSubsidiPercent(initial.subsidi_promo ?? 0);
         setAdminValue(initial.admin_promo ?? 0);
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
         setDiscount(initial.discount ?? 0);
         setDiscountType(String(initial.discount_type ?? "FIX"));
         setMaxDiscount(initial.max_discount ?? 0);
      } else {
         setTitle("");
         setVoucher("");
         setMin(0);
         setTenor("6");
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
         setDiscount(0);
         setDiscountType("FIX");
         setMaxDiscount(0);
      }
   }, [initial, open, setMin]);

   // Load mappings and stores
   useEffect(() => {
      let mounted = true;
      async function loadMappings() {
         if (!open || !initial || !initial.id_promo) return;
         setMappingLoading(true);
         setMappingError(null);
         try {
            const maps = await getPromoStoresByPromo(String(initial.id_promo));
            const all = await getAllStores();

            const assigned = maps
               .map((m) => ({
                  id: Date.now() + Math.random(),
                  store: all.find((s) => s.id === m.store_id)!,
               }))
               .filter((x) => x.store !== undefined) as unknown as {
               id: number;
               store: StoreResponse;
            }[];

            if (mounted) {
               setAssignedMappings(assigned);
               setAllStores(all as unknown as StoreResponse[]);
            }
         } catch (err) {
            console.error("usePromoForm: failed to load mappings", err);
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

   // Load all stores for new promo
   useEffect(() => {
      let mounted = true;
      async function loadAllStores() {
         if (!open || initial) return;
         try {
            const all = await getAllStores();
            if (mounted) setAllStores(all as unknown as StoreResponse[]);
         } catch {
            // optional: handle error
         }
      }
      loadAllStores();
      return () => {
         mounted = false;
      };
   }, [open, initial]);

   const addStoreToPromo = async (storeId: number) => {
      setMappingLoading(true);
      try {
         if (!initial || !initial.id_promo) {
            const sRow = allStores.find((s) => s.id === storeId);
            if (!sRow) return;
            setAssignedMappings((prev) => [
               ...prev,
               { id: Date.now(), store: sRow },
            ]);
            setSelectedStoreToAdd("");
            push({
               type: "success",
               message: "Store berhasil ditambahkan (draft)",
            });
            return;
         }

         const existingMaps = await getPromoStoresByStore(String(storeId));
         if (existingMaps.length > 0) {
            push({
               type: "error",
               message: "Store sudah memiliki promo lain",
            });
            return;
         }

         await createPromoStore({
            promo_id: String(initial.id_promo),
            store_id: String(storeId),
         });

         const sRow = allStores.find((s) => s.id === storeId);
         setAssignedMappings((prev) => [
            ...prev,
            { id: Date.now(), store: sRow as StoreResponse },
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
      if (!initial || !initial.id_promo) return;

      setMappingLoading(true);
      try {
         const mapping = assignedMappings.find((m) => m.id === mappingId);
         if (!mapping) return;

         await deletePromoStore(
            String(initial.id_promo),
            String(mapping.store.id)
         );
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
      console.log("handleSubmit called, subsidiPercent:", subsidiPercent);
      setLoading(true);
      try {
         const errs: Record<string, string> = {};
         if (!title || title.trim().length < 3)
            errs.title = "Title minimal 3 karakter";
         if (minNormal < 0) errs.minTx = "Min transaction tidak boleh negatif";
         setErrors(errs);
         if (Object.keys(errs).length > 0) return;

         const payload: Record<string, unknown> = {
            title: title,
            min_transaction: Number(minNormal) || 0,
            tenor: Number(tenor) || initial?.tenor_promo || 6,
            admin_fee: adminValue === "" ? 0 : Number(adminValue),
            admin_fee_type: (adminType as AdminPromoType) || "FIX",
            interest_rate: interest === "" ? 0 : Number(interest),
            voucher_code: voucher,
            start_date: String(startDate),
            end_date: String(endDate),
            subsidi: subsidiPercent === "" ? 0 : Number(subsidiPercent),
            free_installment:
               freeInstallment === "" ? 0 : Number(freeInstallment),
            is_active: isActive,
            discount: discount === "" ? 0 : Number(discount),
            discount_type: discountType as "FIX" | "PERCENT",
            max_discount: maxDiscount === "" ? 0 : Number(maxDiscount),
         };

         if (isEditing && initial) {
            await updatePromo(initial.voucher_code, payload);
            onUpdated?.({
               ...(initial as PromoResponse),
               ...payload,
            } as PromoResponse);
            push({
               type: "success",
               message: "Promo berhasil diperbarui",
            });
         } else {
            const created = await createPromo(payload);
            if (created && assignedMappings.length > 0) {
               for (const m of assignedMappings) {
                  try {
                     await createPromoStore({
                        promo_id: String(
                           (created as unknown as Record<string, unknown>)
                              .id_promo
                        ),
                        store_id: String(m.store.id),
                     });
                  } catch {
                     // Optional: tampilkan error toast jika gagal satu store
                  }
               }
            }
            onCreated?.(created as unknown as PromoResponse);
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

   return {
      // Form state
      title,
      setTitle,
      voucher,
      setVoucher,
      minCurrency,
      setMin,
      tenor,
      setTenor,
      subsidiPercent,
      setSubsidiPercent,
      adminValue,
      setAdminValue,
      adminType,
      setAdminType,
      interest,
      setInterest,
      startDate,
      setStartDate,
      endDate,
      setEndDate,
      freeInstallment,
      setFreeInstallment,
      isActive,
      setIsActive,
      discount,
      setDiscount,
      discountType,
      setDiscountType,
      maxDiscount,
      setMaxDiscount,

      // UI state
      loading,
      errors,
      isEditing,

      // Store mapping state
      assignedMappings,
      allStores,
      mappingLoading,
      mappingError,
      selectedStoreToAdd,
      setSelectedStoreToAdd,
      availableStoresToAdd,

      // Actions
      parseCurrencyInput,
      addStoreToPromo,
      removeMapping,
      handleSubmit,
   };
};
