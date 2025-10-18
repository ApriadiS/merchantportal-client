"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAllPromoTenors } from "@/services/api/promo_tenor";
import { getPromoStore, updatePromoStore } from "@/services/api/promo_store";
import type { PromoTenor } from "@/types";

interface Props {
   open: boolean;
   onClose: () => void;
   promoId: string;
   storeId: string;
   promoTitle: string;
   storeName: string;
}

export default function TenorSelectionModal({ open, onClose, promoId, storeId, promoTitle, storeName }: Props) {
   const [tenors, setTenors] = useState<PromoTenor[]>([]);
   const [selectedTenorIds, setSelectedTenorIds] = useState<Set<string>>(new Set());
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      if (open) {
         fetchData();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [open, promoId, storeId]);

   const fetchData = async () => {
      setLoading(true);
      try {
         const [tenorData, promoStore] = await Promise.all([
            getAllPromoTenors({ promo_id: promoId }),
            getPromoStore(promoId, storeId),
         ]);
         setTenors(tenorData);
         setSelectedTenorIds(new Set(promoStore.tenor_ids || []));
      } catch (err) {
         console.error("Error fetching data:", err);
      } finally {
         setLoading(false);
      }
   };

   const handleToggle = (tenorId: string) => {
      setSelectedTenorIds((prev) => {
         const next = new Set(prev);
         if (next.has(tenorId)) {
            next.delete(tenorId);
         } else {
            next.add(tenorId);
         }
         return next;
      });
   };

   const handleSave = async () => {
      setLoading(true);
      try {
         const updated = await updatePromoStore(promoId, storeId, {
            tenor_ids: Array.from(selectedTenorIds),
         });
         setSelectedTenorIds(new Set(updated.tenor_ids || []));
         onClose();
      } catch (err) {
         console.error("Error saving tenor selection:", err);
      } finally {
         setLoading(false);
      }
   };

   if (!open) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
         <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
         <div className="relative z-50 w-[600px] max-w-full mx-5 max-h-[90vh] overflow-y-auto">
            <Card className="bg-card">
               <CardHeader>
                  <CardTitle>Select Tenors</CardTitle>
                  <div className="text-sm text-muted-foreground">
                     {promoTitle} → {storeName}
                  </div>
               </CardHeader>
               <CardContent>
                  {loading ? (
                     <div className="text-sm text-muted-foreground">Loading...</div>
                  ) : tenors.length === 0 ? (
                     <div className="text-sm text-muted-foreground">No tenors available for this promo.</div>
                  ) : (
                     <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto">
                        {tenors.map((tenor) => {
                           const isSelected = selectedTenorIds.has(tenor.id);
                           return (
                              <label
                                 key={tenor.id}
                                 className={`p-3 rounded border cursor-pointer transition ${
                                    isSelected ? "bg-blue-50 border-blue-300" : "bg-muted/10 hover:bg-muted/20"
                                 }`}
                              >
                                 <div className="flex items-center gap-3">
                                    <input
                                       type="checkbox"
                                       checked={isSelected}
                                       onChange={() => handleToggle(tenor.id)}
                                       className="w-4 h-4"
                                    />
                                    <div className="flex-1">
                                       <div className="font-medium">
                                          {tenor.tenor} bulan - {tenor.voucher_code}
                                       </div>
                                       <div className="text-xs text-muted-foreground">
                                          Min: Rp {tenor.min_transaction.toLocaleString()} • Subsidi: {tenor.subsidi}%
                                       </div>
                                    </div>
                                 </div>
                              </label>
                           );
                        })}
                     </div>
                  )}

                  <div className="mt-4 flex justify-between items-center">
                     <div className="text-sm text-muted-foreground">
                        {selectedTenorIds.size} of {tenors.length} selected
                     </div>
                     <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                           Cancel
                        </Button>
                        <Button type="button" onClick={handleSave} disabled={loading}>
                           {loading ? "Saving..." : "Save"}
                        </Button>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
