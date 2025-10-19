"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAllPromos } from "@/services/api/promos";
import { getAllPromoStores, createPromoStore, deletePromoStore } from "@/services/api/promo_store";
import { getAllPromoTenors } from "@/services/api/promo_tenor";
import type { PromoResponse } from "@/utils/interface";
import type { PromoStore, PromoTenor } from "@/types";
import TenorSelectionModal from "./TenorSelectionModal";
import { useToast } from "@/hooks/useToast-old";

interface Props {
   open: boolean;
   onClose: () => void;
   storeId: string;
   storeName: string;
}

export default function PromoLinkingModal({ open, onClose, storeId, storeName }: Props) {
   const [promos, setPromos] = useState<PromoResponse[]>([]);
   const [linkedPromoIds, setLinkedPromoIds] = useState<Set<string>>(new Set());
   const [promoStoreMap, setPromoStoreMap] = useState<Map<string, PromoStore>>(new Map());
   const [tenorsMap, setTenorsMap] = useState<Map<string, PromoTenor[]>>(new Map());
   const [loading, setLoading] = useState(false);
   const [tenorSelectionPromo, setTenorSelectionPromo] = useState<PromoResponse | null>(null);
   const { push: pushToast } = useToast();

   useEffect(() => {
      if (open) {
         fetchData();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [open, storeId]);

   const fetchData = async () => {
      setLoading(true);
      try {
         const [allPromos, promoStores] = await Promise.all([
            getAllPromos(),
            getAllPromoStores({ store_id: storeId }),
         ]);
         allPromos.sort((a, b) => a.title_promo.localeCompare(b.title_promo));
         setPromos(allPromos);
         
         const psMap = new Map<string, PromoStore>();
         promoStores.forEach(ps => psMap.set(String(ps.promo_id), ps));
         setPromoStoreMap(psMap);
         setLinkedPromoIds(new Set(promoStores.map((ps) => String(ps.promo_id))));

         // Fetch tenors for all promos
         const allTenors = await getAllPromoTenors();
         const tMap = new Map<string, PromoTenor[]>();
         allTenors.forEach(tenor => {
            const pid = String(tenor.promo_id);
            if (!tMap.has(pid)) tMap.set(pid, []);
            tMap.get(pid)!.push(tenor);
         });
         tMap.forEach(tenors => tenors.sort((a, b) => a.tenor - b.tenor));
         setTenorsMap(tMap);
      } catch (err) {
         console.error("Error fetching data:", err);
      } finally {
         setLoading(false);
      }
   };

   const handleToggle = async (promoId: string) => {
      const isCurrentlyLinked = linkedPromoIds.has(promoId);
      try {
         if (isCurrentlyLinked) {
            await deletePromoStore(promoId, storeId);
            const prevState = new Set(linkedPromoIds);
            const prevMap = new Map(promoStoreMap);
            setLinkedPromoIds((prev) => {
               const next = new Set(prev);
               next.delete(promoId);
               return next;
            });
            setPromoStoreMap((prev) => {
               const next = new Map(prev);
               next.delete(promoId);
               return next;
            });
            pushToast({
               type: "success",
               message: "Promo unlinked",
               action: {
                  label: "Undo",
                  onClick: async () => {
                     try {
                        await createPromoStore({ promo_id: promoId, store_id: storeId });
                        setLinkedPromoIds(prevState);
                        setPromoStoreMap(prevMap);
                        pushToast({ type: "success", message: "Restored" });
                     } catch (err) {
                        console.error("Undo failed:", err);
                        pushToast({ type: "error", message: "Undo failed" });
                     }
                  },
               },
            });
         } else {
            const allTenors = tenorsMap.get(promoId) || [];
            const availableTenors = allTenors.filter(t => t.is_available);
            const tenor_ids = availableTenors.length === 1 ? [availableTenors[0].id] : undefined;
            
            const newPs = await createPromoStore({ promo_id: promoId, store_id: storeId, tenor_ids });
            setLinkedPromoIds((prev) => new Set(prev).add(promoId));
            setPromoStoreMap((prev) => new Map(prev).set(promoId, newPs));
            pushToast({ type: "success", message: availableTenors.length === 1 ? "Promo linked with tenor auto-activated" : "Promo linked" });
         }
      } catch (err) {
         console.error("Error toggling promo:", err);
         pushToast({ type: "error", message: "Failed to toggle promo" });
      }
   };

   if (!open) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
         <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
         <div className="relative z-50 w-[700px] max-w-full mx-5 max-h-[90vh] overflow-y-auto">
            <Card className="bg-card">
               <CardHeader>
                  <CardTitle>Link Promos - {storeName}</CardTitle>
               </CardHeader>
               <CardContent>
                  {loading ? (
                     <div className="text-sm text-muted-foreground">Loading...</div>
                  ) : promos.length === 0 ? (
                     <div className="text-sm text-muted-foreground">No promos found.</div>
                  ) : (
                     <div className="grid grid-cols-1 gap-2 max-h-[500px] overflow-y-auto">
                        {promos.map((promo) => {
                           const promoId = String(promo.id_promo);
                           const isLinked = linkedPromoIds.has(promoId);
                           const promoStore = promoStoreMap.get(promoId);
                           const allTenors = tenorsMap.get(promoId) || [];
                           const availableTenors = allTenors.filter(t => t.is_available);
                           const activeTenorIds = promoStore?.tenor_ids || [];
                           const hasActiveTenors = activeTenorIds.length > 0;
                           const showWarning = isLinked && !hasActiveTenors;
                           
                           return (
                              <div
                                 key={promo.id_promo}
                                 className={`p-3 rounded border flex items-center gap-2 ${
                                    isLinked ? "bg-green-50 border-green-300" : "bg-muted/10"
                                 }`}
                              >
                                 {showWarning && <span className="text-yellow-600 text-lg">⚠️</span>}
                                 <div className="flex-1">
                                    <div className="font-medium">{promo.title_promo}</div>
                                    <div className="text-xs text-muted-foreground">
                                       {promo.start_date_promo} — {promo.end_date_promo}
                                    </div>
                                    {isLinked && availableTenors.length > 0 && (
                                       <div className="text-xs text-blue-600 mt-1">
                                          Available: {availableTenors.map(t => `${t.tenor}m`).join(", ")}
                                       </div>
                                    )}
                                 </div>
                                 <div className="flex gap-2">
                                    {isLinked && (
                                       <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setTenorSelectionPromo(promo)}
                                       >
                                          Tenors
                                       </Button>
                                    )}
                                    <Button
                                       type="button"
                                       variant={isLinked ? "destructive" : "default"}
                                       size="sm"
                                       onClick={() => handleToggle(promoId)}
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
         {tenorSelectionPromo && (
            <TenorSelectionModal
               open={Boolean(tenorSelectionPromo)}
               onClose={() => setTenorSelectionPromo(null)}
               promoId={String(tenorSelectionPromo.id_promo)}
               storeId={storeId}
               promoTitle={tenorSelectionPromo.title_promo}
               storeName={storeName}
               onSave={(updated) => {
                  setPromoStoreMap((prev) => new Map(prev).set(String(tenorSelectionPromo.id_promo), updated));
               }}
            />
         )}
      </div>
   );
}
