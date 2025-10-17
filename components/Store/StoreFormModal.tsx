"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { StoreRequest, StoreResponse } from "@/utils/interface";
import { createStore, updateStore } from "@services/database/stores";
import { useToast } from "@/hooks/useToast-old";

interface Props {
   open: boolean;
   onClose: () => void;
   onCreated?: (s: StoreResponse) => void;
   onUpdated?: (s: StoreResponse) => void;
   initial?: StoreResponse | null;
}

export default function StoreFormModal({
   open,
   onClose,
   onCreated,
   onUpdated,
   initial = null,
}: Props) {
   const [name, setName] = useState("");
   const [company, setCompany] = useState("");
   const [address, setAddress] = useState("");
   const [route, setRoute] = useState("");
   const [storeType, setStoreType] = useState("KA");
   const [loading, setLoading] = useState(false);
   const { push } = useToast();
   const [errors, setErrors] = useState<Record<string, string>>({});

   // Using supabase client directly instead of Refine mutations

   useEffect(() => {
      if (open) {
         setErrors({}); // Reset errors when modal opens
         if (initial) {
            setName(initial.name || "");
            setCompany(initial.company || "");
            setAddress(initial.address || "");
            setRoute(initial.route || "");
            setStoreType(initial.store_type || "KA");
         } else {
            setName("");
            setCompany("");
            setAddress("");
            setRoute("");
            setStoreType("KA");
         }
      }
   }, [initial, open]);

   if (!open) return null;

   const isEditing = Boolean(initial && initial.id);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
         const errs: Record<string, string> = {};
         if (!name || name.trim().length < 2)
            errs.name = "Name minimal 2 karakter";
         if (!company || company.trim().length < 1)
            errs.company = "Company tidak boleh kosong";
         if (!address || address.trim().length < 1)
            errs.address = "Address tidak boleh kosong";
         
         setErrors(errs);
         if (Object.keys(errs).length > 0) {
            setLoading(false);
            return;
         }

         const payload: StoreRequest = {
            name,
            company,
            address,
            route: route || "",
            store_type: storeType,
         };

         if (isEditing && initial) {
            const updatedStore = await updateStore(initial.id as number, payload);
            onUpdated?.(updatedStore);
            push({
               type: "success",
               message: "Store berhasil diperbarui",
            });
         } else {
            console.log("Creating store with payload:", payload);
            const created = await createStore(payload);
            // create mutation will update refine list; return created-like payload
            onCreated?.(created as StoreResponse);
            push({
               type: "success",
               message: "Store berhasil dibuat",
            });
         }

         onClose();
      } catch (err) {
         console.error(err);
         push({ type: "error", message: "Gagal menyimpan store" });
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-8">
         <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={onClose}
         />

         <form
            onSubmit={handleSubmit}
            className="relative z-50 bg-white rounded-t-lg md:rounded-lg p-4 md:p-6 w-full md:w-[550px] max-w-full shadow-lg max-h-[85vh] overflow-y-auto mx-4"
            style={{ WebkitOverflowScrolling: "touch" }}
         >
            <h3 className="text-base md:text-lg font-semibold mb-3">
               {isEditing ? "Edit Store" : "Tambah Store"}
            </h3>
            <div className="flex flex-col gap-3 text-sm">
               <label className="text-xs text-muted-foreground">Name</label>
               <Input value={name} onChange={(e) => setName(e.target.value)} />
               {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
               )}

               <label className="text-xs text-muted-foreground">Company</label>
               <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
               />
               {errors.company && (
                  <p className="text-xs text-red-500">{errors.company}</p>
               )}

               <label className="text-xs text-muted-foreground">Address</label>
               <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
               />
               {errors.address && (
                  <p className="text-xs text-red-500">{errors.address}</p>
               )}

               <label className="text-xs text-muted-foreground">Route</label>
               <Input
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
               />

               <label className="text-xs text-muted-foreground">Store Type</label>
               <select
                  value={storeType}
                  onChange={(e) => setStoreType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
               >
                  <option value="KA">KA</option>
                  <option value="NKA">NKA</option>
               </select>
            </div>

            <div className="mt-4 md:mt-6 flex justify-end gap-2">
               <Button variant="outline" asChild>
                  <button type="button" onClick={onClose}>
                     Batal
                  </button>
               </Button>
               <Button type="submit" disabled={loading}>
                  {loading ? "Menyimpan..." : isEditing ? "Perbarui" : "Simpan"}
               </Button>
            </div>
         </form>
      </div>
   );
}
