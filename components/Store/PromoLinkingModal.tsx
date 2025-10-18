"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAllPromos } from "@/services/api/promos";
import { getAllPromoStores, createPromoStore, deletePromoStore } from "@/services/api/promo_store";
import type { PromoResponse } from "@/utils/interface";
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
         setPromos(allPromos);
         console.log('PromoStores:', promoStores);
         console.log('Linked IDs:', promoStores.map((ps) => ps.promo_id));
         setLinkedPromoIds(new Set(promoStores.map((ps) => String(ps.promo_id))));
      } catch (err) {
         console.error("Error fetching data:", err);
      } finally {
         setLoading(false);
      }
   };

   const handleToggle = async (promoId: string) => {
      if (loading) return;
      const isCurrentlyLinked = linkedPromoIds.has(promoId);
      setLoading(true);
      try {
         if (isCurrentlyLinked) {
            await deletePromoStore(promoId, storeId);
            const prevState = new Set(linkedPromoIds);
            setLinkedPromoIds((prev) => {
               const next = new Set(prev);
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
            setLinkedPromoIds((prev) => new Set(prev).add(promoId));
            pushToast({ type: "success", message: "Promo linked" });
         }
      } catch (err) {
         console.error("Error toggling promo:", err);
         pushToast({ type: "error", message: "Failed to toggle promo" });
      } finally {
         setLoading(false);
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
                           const isLinked = linkedPromoIds.has(String(promo.id_promo));
                           return (
                              <div
                                 key={promo.id_promo}
                                 className={`p-3 rounded border flex justify-between items-center ${
                                    isLinked ? "bg-green-50 border-green-300" : "bg-muted/10"
                                 }`}
                              >
                                 <div className="flex-1">
                                    <div className="font-medium">{promo.title_promo}</div>
                                    <div className="text-xs text-muted-foreground">
                                       {promo.start_date_promo} — {promo.end_date_promo}
                                    </div>
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
                                       onClick={() => handleToggle(String(promo.id_promo))}
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
         {tenorSelectionPromo && (
            <TenorSelectionModal
               open={Boolean(tenorSelectionPromo)}
               onClose={() => setTenorSelectionPromo(null)}
               promoId={String(tenorSelectionPromo.id_promo)}
               storeId={storeId}
               promoTitle={tenorSelectionPromo.title_promo}
               storeName={storeName}
            />
         )}
      </div>
   );
}
