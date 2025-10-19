"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import type { PromoResponse } from "@/utils/interface";

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
   const [title, setTitle] = React.useState("");
   const [startDate, setStartDate] = React.useState("");
   const [endDate, setEndDate] = React.useState("");
   const [interestRate, setInterestRate] = React.useState("2.6");
   const [adminPromoType, setAdminPromoType] = React.useState<
      "FIX" | "PERCENT"
   >("PERCENT");
   const [discountType, setDiscountType] = React.useState<"FIX" | "PERCENT">(
      "FIX"
   );
   const [isActive, setIsActive] = React.useState(true);
   const [loading, setLoading] = React.useState(false);
   const [errors, setErrors] = React.useState<Record<string, string>>({});

   const isEditing = Boolean(initial);

   React.useEffect(() => {
      if (open && initial) {
         setTitle(initial.title_promo || "");
         setStartDate(initial.start_date_promo || "");
         setEndDate(initial.end_date_promo || "");
         setInterestRate(String(initial.interest_rate || 2.6));
         setAdminPromoType(initial.admin_promo_type || "PERCENT");
         setDiscountType(initial.discount_type || "FIX");
         setIsActive(initial.is_active ?? true);
      } else if (open && !initial) {
         setTitle("");
         setStartDate("");
         setEndDate("");
         setInterestRate("2.6");
         setAdminPromoType("PERCENT");
         setDiscountType("FIX");
         setIsActive(true);
      }
   }, [open, initial]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});

      if (!title.trim()) {
         setErrors({ title: "Title is required" });
         return;
      }

      setLoading(true);
      try {
         const payload = {
            title_promo: title,
            start_date_promo: startDate,
            end_date_promo: endDate,
            interest_rate: parseFloat(interestRate),
            admin_promo_type: adminPromoType,
            discount_type: discountType,
            is_active: isActive,
         };

         if (isEditing && initial) {
            const { updatePromo } = await import("@/services/api/promos");
            const updated = await updatePromo(
               String(initial.id_promo),
               payload
            );
            onUpdated?.(updated);
         } else {
            const { createPromo } = await import("@/services/api/promos");
            const created = await createPromo(payload);
            onCreated?.(created);
         }
         onClose();
      } catch (err) {
         console.error("Error saving promo:", err);
         setErrors({ submit: "Failed to save promo" });
      } finally {
         setLoading(false);
      }
   };

   if (!open) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center py-8 overflow-x-hidden overflow-y-auto">
         <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={onClose}
         />
         <form
            onSubmit={handleSubmit}
            className="relative z-50 bg-white rounded-lg p-6 w-full max-w-md md:w-[550px] shadow-lg max-h-[85vh] overflow-y-auto overflow-x-hidden mx-4"
            style={{ WebkitOverflowScrolling: "touch" }}
         >
            <h3 className="mb-4 text-lg font-semibold">
               {isEditing ? "Edit Promo" : "Tambah Promo"}
            </h3>

            <div className="space-y-4">
               <div>
                  <label className="block mb-1 text-sm font-medium">
                     Title <span className="text-red-500">*</span>
                  </label>
                  <input
                     type="text"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     className="w-full px-3 py-2 border rounded-md"
                     placeholder="Promo title"
                  />
                  {errors.title && (
                     <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                  )}
               </div>

               <div>
                  <label className="block mb-1 text-sm font-medium">
                     Start Date
                  </label>
                  <input
                     type="date"
                     value={startDate}
                     onChange={(e) => setStartDate(e.target.value)}
                     className="w-full px-3 py-2 border rounded-md"
                  />
               </div>

               <div>
                  <label className="block mb-1 text-sm font-medium">
                     End Date
                  </label>
                  <input
                     type="date"
                     value={endDate}
                     onChange={(e) => setEndDate(e.target.value)}
                     className="w-full px-3 py-2 border rounded-md"
                  />
               </div>

               <div>
                  <label className="block mb-1 text-sm font-medium">
                     Interest Rate (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                     type="number"
                     step="0.1"
                     value={interestRate}
                     onChange={(e) => setInterestRate(e.target.value)}
                     className="w-full px-3 py-2 border rounded-md"
                     placeholder="2.6"
                  />
               </div>

               <div>
                  <label className="block mb-1 text-sm font-medium">
                     Admin Type
                  </label>
                  <select
                     value={adminPromoType}
                     onChange={(e) =>
                        setAdminPromoType(e.target.value as "FIX" | "PERCENT")
                     }
                     className="w-full px-3 py-2 border rounded-md"
                  >
                     <option value="FIX">FIX (Rupiah)</option>
                     <option value="PERCENT">PERCENT (%)</option>
                  </select>
               </div>

               <div>
                  <label className="block mb-1 text-sm font-medium">
                     Discount Type
                  </label>
                  <select
                     value={discountType}
                     onChange={(e) =>
                        setDiscountType(e.target.value as "FIX" | "PERCENT")
                     }
                     className="w-full px-3 py-2 border rounded-md"
                  >
                     <option value="FIX">FIX (Rupiah)</option>
                     <option value="PERCENT">PERCENT (%)</option>
                  </select>
               </div>

               <div className="flex items-center gap-2">
                  <input
                     type="checkbox"
                     id="isActive"
                     checked={isActive}
                     onChange={(e) => setIsActive(e.target.checked)}
                     className="w-4 h-4"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">
                     Active
                  </label>
               </div>

               {isEditing && (
                  <div className="p-3 text-sm text-blue-800 rounded-md bg-blue-50">
                     To add tenors, vouchers, and store mappings, click View
                     after saving.
                  </div>
               )}
            </div>

            <div className="flex justify-center gap-2 mt-4">
               <Button variant="outline" type="button" onClick={onClose}>
                  Batal
               </Button>
               <Button type="submit" disabled={loading}>
                  {loading ? "Menyimpan..." : isEditing ? "Perbarui" : "Simpan"}
               </Button>
            </div>
         </form>
      </div>
   );
}
