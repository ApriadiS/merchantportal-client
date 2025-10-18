"use client";
import { useState } from "react";
import type { StoreResponse } from "@/utils/interface";
import Loading from "@components/shared/Loading";
import ModalDelete from "@components/shared/ModalDelete";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast-old";
import { deleteStore } from "@services/api/stores";
import { Input } from "@/components/ui/input";
import StoreFormModal from "@components/Store/StoreFormModal";
import StoreViewModal from "@components/Store/StoreViewModal";
import PromoLinkingModal from "@components/Store/PromoLinkingModal";
import { useStoreList } from "@/hooks/useStoreList";
import { useStoreFilters } from "@/hooks/useStoreFilters";
import Toast from "@components/shared/Toast";

export default function StoreClient() {
   const { stores, loading: isLoading, removeStore } = useStoreList();
   const { q, setQ, filtered: finalFiltered } = useStoreFilters(stores);
   const [deleteTarget, setDeleteTarget] = useState<StoreResponse | null>(null);
   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
   const [isCreateOpen, setIsCreateOpen] = useState(false);
   const [editingStore, setEditingStore] = useState<StoreResponse | null>(null);
   const [viewingStore, setViewingStore] = useState<StoreResponse | null>(null);
   const [linkingStore, setLinkingStore] = useState<StoreResponse | null>(null);
   const { push: pushToast, toasts } = useToast();

   const handleDelete = async (route?: string) => {
      if (!route) return;
      try {
         await deleteStore(route);
         removeStore(route);
         setIsDeleteOpen(false);
         setDeleteTarget(null);
         pushToast({ type: "success", message: "Store berhasil dihapus" });
      } catch (err) {
         console.error("deleteStore failed", err);
         pushToast({ type: "error", message: "Gagal menghapus store" });
      }
   };

   if (isLoading) return <Loading label="Memuat data..." speed={1.4} />;

   return (
      <>
         {toasts.map((toast) => (
            <Toast
               key={toast.id}
               message={toast.message}
               type={toast.type}
               action={toast.action}
            />
         ))}
         <Card className="overflow-x-auto">
            <CardHeader className="flex flex-col gap-4 pb-0 sm:flex-row sm:items-center sm:justify-between">
               <div className="flex flex-col items-start gap-2 mb-4 sm:items-center sm:flex-row">
                  <div className="flex-1 min-w-0">
                     <div className="relative">
                        <Input
                           className="w-full pr-10"
                           value={q}
                           onChange={(e) => setQ(e.target.value)}
                           placeholder="Search name, company or route"
                        />
                        {q && q.length > 0 && (
                           <button
                              type="button"
                              aria-label="Clear search"
                              className="absolute text-xs -translate-y-1/2 right-2 top-1/2 text-muted-foreground hover:text-foreground"
                              onClick={() => setQ("")}
                           >
                              ×
                           </button>
                        )}
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Button onClick={() => setIsCreateOpen(true)}>
                        Tambah Store
                     </Button>
                  </div>
               </div>
            </CardHeader>

            <CardContent>
               {finalFiltered.length === 0 ? (
                  <div className="p-6 text-sm text-center text-gray-500">
                     No stores found.
                  </div>
               ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                     {finalFiltered.map((s) => (
                        <div
                           key={s.id}
                           className="p-4 transition rounded-md shadow-sm hover:shadow-md"
                        >
                           <div className="flex items-start justify-between gap-4">
                              <div>
                                 <h4 className="text-sm font-semibold">
                                    {s.name} - ({s.store_type})
                                 </h4>
                                 <p className="text-xs text-muted-foreground">
                                    {s.company}
                                 </p>
                              </div>
                              <div className="text-xs text-right">
                                 <div className="text-muted-foreground">
                                    Route
                                 </div>
                                 <div className="font-medium">
                                    {s.route || "-"}
                                 </div>
                              </div>
                           </div>

                           <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                              <div>
                                 <div className="text-muted-foreground">
                                    Company
                                 </div>
                                 <div className="font-medium">{s.company}</div>
                              </div>
                              <div>
                                 <div className="text-muted-foreground">
                                    Route
                                 </div>
                                 <div className="font-medium">
                                    {s.route || "-"}
                                 </div>
                              </div>
                           </div>

                           <div className="flex justify-end gap-2 mt-4">
                              <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => setViewingStore(s)}
                              >
                                 View
                              </Button>
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={() => setEditingStore(s)}
                              >
                                 Edit
                              </Button>
                              <Button
                                 variant="destructive"
                                 size="sm"
                                 onClick={() => {
                                    setDeleteTarget(s);
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
         {isDeleteOpen && deleteTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
               <div
                  className="absolute inset-0 bg-black opacity-60"
                  onClick={() => setIsDeleteOpen(false)}
               />
               <div className="relative z-50">
                  <ModalDelete
                     title={`Hapus store: ${deleteTarget.name}`}
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
                           onclick: () => handleDelete(deleteTarget.route),
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
         <StoreFormModal
            open={isCreateOpen || Boolean(editingStore)}
            initial={editingStore}
            onClose={() => {
               setIsCreateOpen(false);
               setEditingStore(null);
            }}
            onCreated={() => window.location.reload()}
            onUpdated={() => window.location.reload()}
         />
         <StoreViewModal
            open={Boolean(viewingStore)}
            store={viewingStore}
            onClose={() => setViewingStore(null)}
            onEdit={(s) => {
               setViewingStore(null);
               setEditingStore(s);
            }}
            onLinkPromos={(s) => {
               setViewingStore(null);
               setLinkingStore(s);
            }}
         />
         <PromoLinkingModal
            open={Boolean(linkingStore)}
            storeId={String(linkingStore?.id || "")}
            storeName={linkingStore?.name || ""}
            onClose={() => setLinkingStore(null)}
         />
      </>
   );
}
