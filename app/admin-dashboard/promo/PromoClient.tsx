"use client";
import React, { useState } from "react";
import Loading from "@components/shared/Loading";
import ModalDelete from "@components/shared/ModalDelete";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PromoFormModal from "@components/Promo/PromoFormModal";
import PromoViewModal from "@components/Promo/PromoViewModal";


import { useToast } from "@/hooks/useToast-old";
import type { PromoResponse } from "@/utils/interface";
import { usePromoList } from "@/hooks/usePromoList";
import { usePromoFilters } from "@/hooks/usePromoFilters";
import { deletePromo } from "@services/api/promos";

type PromoWithCount = PromoResponse & { storeCount?: number };

export default function PromoClient() {
   const { promos, loading: promosLoading, addPromo, updatePromo, removePromo } = usePromoList();
   const { q, setQ, filtered: finalFiltered } = usePromoFilters(promos);
   const [deleteTarget, setDeleteTarget] = useState<PromoWithCount | null>(
      null
   );
   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
   const [isCreateOpen, setIsCreateOpen] = useState(false);
   const [editingPromo, setEditingPromo] = useState<PromoResponse | null>(null);
   const [viewPromo, setViewPromo] = useState<PromoResponse | null>(null);

   const { push } = useToast();

   const handleDelete = async (voucher?: string) => {
      if (!voucher) return;
      try {
         await deletePromo(voucher);
         removePromo(voucher);
         setIsDeleteOpen(false);
         setDeleteTarget(null);
         push({ type: "success", message: "Promo berhasil dihapus" });
      } catch (err) {
         console.error("deletePromo failed", err);
         push({ type: "error", message: "Gagal menghapus promo" });
      }
   };

   if (promosLoading) return <Loading label="Memuat promo..." speed={1.4} />;

   return (
      <>
         <Card className="overflow-x-auto">
            <CardHeader className="flex flex-col gap-4 pb-0 sm:flex-row sm:items-center sm:justify-between">
               <div className="flex flex-col items-start gap-2 mb-4 sm:items-center sm:flex-row">
                  <div className="flex-1 min-w-0">
                     <Input
                        className="w-full"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search title or voucher"
                     />
                  </div>
                  {/* Filter UI commented out per request. To restore, replace this
                      comment with the original Popover+Select JSX. */}
                  <Button onClick={() => setIsCreateOpen(true)}>
                     Tambah Promo
                  </Button>
               </div>
            </CardHeader>

            <CardContent>
               {finalFiltered.length === 0 ? (
                  <div className="p-6 text-sm text-center text-gray-500">
                     No promos found.
                  </div>
               ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                     {finalFiltered.map((p) => (
                        <div
                           key={p.id_promo}
                           className="p-4 transition rounded-md shadow-sm hover:shadow-md"
                        >
                           <div className="flex items-start justify-between gap-4">
                              <div className="flex flex-col gap-1">
                                 <h4 className="text-base font-semibold">
                                    {p.title_promo}
                                 </h4>
                                 <div className="text-xs text-muted-foreground">
                                    {p.start_date_promo} — {p.end_date_promo}
                                 </div>
                              </div>
                              <div className="text-xs text-right">
                                 <div className="text-muted-foreground">
                                    {(p as PromoWithCount).storeCount || 0} stores
                                 </div>
                              </div>
                           </div>

                           <div className="flex justify-end gap-2 mt-3">
                              <Button
                                 variant="ghost"
                                 onClick={() => {
                                    setEditingPromo(p);
                                    setIsCreateOpen(false);
                                 }}
                              >
                                 Edit
                              </Button>
                              <Button onClick={() => setViewPromo(p)}>
                                 View
                              </Button>
                              <Button
                                 variant="destructive"
                                 onClick={() => {
                                    setDeleteTarget(p);
                                    setIsDeleteOpen(true);
                                 }}
                              >
                                 Delete
                              </Button>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </CardContent>
         </Card>
         <PromoFormModal
            open={isCreateOpen || Boolean(editingPromo)}
            initial={editingPromo}
            onClose={() => {
               setIsCreateOpen(false);
               setEditingPromo(null);
            }}
            onCreated={(promo) => {
               addPromo(promo);
               push({ type: "success", message: "Promo berhasil ditambahkan" });
            }}
            onUpdated={(promo) => {
               updatePromo(promo);
               push({ type: "success", message: "Promo berhasil diperbarui" });
            }}
         />
         <PromoViewModal
            open={Boolean(viewPromo)}
            promo={viewPromo}
            onClose={() => setViewPromo(null)}
            onEdit={(p) => {
               setViewPromo(null);
               setEditingPromo(p);
            }}
         />
         {isDeleteOpen && deleteTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
               <div
                  className="absolute inset-0 bg-black opacity-60"
                  onClick={() => setIsDeleteOpen(false)}
               />
               <div className="relative z-50">
                  <ModalDelete
                     title={`Hapus promo: ${deleteTarget.title_promo}`}
                     onClose={() => {
                        setIsDeleteOpen(false);
                        setDeleteTarget(null);
                     }}
                     inline
                     buttons={[
                        {
                           label: "Hapus",
                           bgColor: "bg-red-500",
                           textColor: "text-white",
                           bgColorHover: "bg-red-600",
                           textColorHover: "text-white",
                           onclick: () =>
                              handleDelete(deleteTarget.voucher_code),
                        },
                        {
                           label: "Batal",
                           bgColor: "bg-gray-300",
                           textColor: "text-black",
                           bgColorHover: "bg-gray-400",
                           textColorHover: "text-black",
                           onclick: () => {
                              setIsDeleteOpen(false);
                              setDeleteTarget(null);
                           },
                        },
                     ]}
                  />
               </div>
            </div>
         )}
      </>
   );
}
