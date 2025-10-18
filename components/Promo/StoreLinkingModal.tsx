"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAllStores } from "@/services/api/stores";
import { getAllPromoStores, createPromoStore, deletePromoStore } from "@/services/api/promo_store";
import type { Store } from "@/types";
import TenorSelectionModal from "../Store/TenorSelectionModal";
import { useToast } from "@/hooks/useToast-old";

interface Props {
   open: boolean;
   onClose: () => void;
   promoId: string;
   promoTitle: string;
}

export default function StoreLinkingModal({ open, onClose, promoId, promoTitle }: Props) {
   const [stores, setStores] = useState<Store[]>([]);
   const [linkedStoreIds, setLinkedStoreIds] = useState<Set<string>>(new Set());
   const [loading, setLoading] = useState(false);
   const [storeTypeFilter, setStoreTypeFilter] = useState<string>("ALL");
   const [tenorSelectionStore, setTenorSelectionStore] = useState<Store | null>(null);
   const { push: pushToast } = useToast();

   useEffect(() => {
      if (open) {
         fetchData();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [open, promoId]);

   const fetchData = async () => {
      setLoading(true);
      try {
         const [allStores, promoStores] = await Promise.all([
            getAllStores(),
            getAllPromoStores({ promo_id: promoId }),
         ]);
         setStores(allStores);
         setLinkedStoreIds(new Set(promoStores.map((ps) => ps.store_id)));
      } catch (err) {
         console.error("Error fetching data:", err);
      } finally {
         setLoading(false);
      }
   };

   const handleToggle = async (storeId: string) => {
      const isCurrentlyLinked = linkedStoreIds.has(storeId);
      setLoading(true);
      try {
         if (isCurrentlyLinked) {
            await deletePromoStore(promoId, storeId);
            const prevState = new Set(linkedStoreIds);
            setLinkedStoreIds((prev) => {
               const next = new Set(prev);
               next.delete(storeId);
               return next;
            });
            pushToast({
               type: "success",
               message: "Store unlinked",
               action: {
                  label: "Undo",
                  onClick: async () => {
                     try {
                        await createPromoStore({ promo_id: promoId, store_id: storeId });
                        setLinkedStoreIds(prevState);
                        pushToast({ type: "success", message: "Restored" });
                     } catch (err) {
                        console.error("Undo failed:", err);
                        pushToast({ type: "error", message: "Undo failed" });
                     }
                  },
               },
            });
         } else {
            await createPromoStore({ promo_id: promoId, store_id: storeId });
            setLinkedStoreIds((prev) => new Set(prev).add(storeId));
            pushToast({ type: "success", message: "Store linked" });
         }
      } catch (err) {
         console.error("Error toggling store:", err);
         pushToast({ type: "error", message: "Failed to toggle store" });
      } finally {
         setLoading(false);
      }
   };

   if (!open) return null;

   const filteredStores = storeTypeFilter === "ALL" 
      ? stores 
      : stores.filter((s) => s.store_type === storeTypeFilter);

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
         <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
         <div className="relative z-50 w-[700px] max-w-full mx-5 max-h-[90vh] overflow-y-auto">
            <Card className="bg-card">
               <CardHeader>
                  <CardTitle>Link Stores - {promoTitle}</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="mb-4 flex gap-2">
                     <Button
                        type="button"
                        variant={storeTypeFilter === "ALL" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setStoreTypeFilter("ALL")}
                     >
                        All
                     </Button>
                     <Button
                        type="button"
                        variant={storeTypeFilter === "KA" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setStoreTypeFilter("KA")}
                     >
                        KA
                     </Button>
                     <Button
                        type="button"
                        variant={storeTypeFilter === "NKA" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setStoreTypeFilter("NKA")}
                     >
                        NKA
                     </Button>
                  </div>

                  {loading ? (
                     <div className="text-sm text-muted-foreground">Loading...</div>
                  ) : filteredStores.length === 0 ? (
                     <div className="text-sm text-muted-foreground">No stores found.</div>
                  ) : (
                     <div className="grid grid-cols-1 gap-2 max-h-[500px] overflow-y-auto">
                        {filteredStores.map((store) => {
                           const isLinked = linkedStoreIds.has(store.id);
                           return (
                              <div
                                 key={store.id}
                                 className={`p-3 rounded border flex justify-between items-center ${
                                    isLinked ? "bg-green-50 border-green-300" : "bg-muted/10"
                                 }`}
                              >
                                 <div className="flex-1">
                                    <div className="font-medium">{store.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                       {store.company} • {store.store_type}
                                    </div>
                                 </div>
                                 <div className="flex gap-2">
                                    {isLinked && (
                                       <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setTenorSelectionStore(store)}
                                       >
                                          Tenors
                                       </Button>
                                    )}
                                    <Button
                                       type="button"
                                       variant={isLinked ? "destructive" : "default"}
                                       size="sm"
                                       onClick={() => handleToggle(store.id)}
                                       disabled={loading}
                                    >
                                       {isLinked ? "Unlink" : "Link"}
                                    </Button>
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  )}

                  <div className="mt-4 flex justify-end">
                     <Button type="button" variant="outline" onClick={onClose}>
                        Close
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </div>
         {tenorSelectionStore && (
            <TenorSelectionModal
               open={Boolean(tenorSelectionStore)}
               onClose={() => setTenorSelectionStore(null)}
               promoId={promoId}
               storeId={tenorSelectionStore.id}
               promoTitle={promoTitle}
               storeName={tenorSelectionStore.name}
            />
         )}
      </div>
   );
}
