"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { StoreResponse, PromoResponse } from "@/utils/interface";
import { getAllPromoStores } from "@/services/api/promo_store";
import { getAllPromos } from "@/services/api/promos";

interface Props {
   open: boolean;
   onClose: () => void;
   store: StoreResponse | null;
   onEdit?: (s: StoreResponse) => void;
   onLinkPromos?: (s: StoreResponse) => void;
}

export default function StoreViewModal({ open, onClose, store, onEdit, onLinkPromos }: Props) {
   const [promos, setPromos] = useState<PromoResponse[]>([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      if (!open || !store) return;

      const fetchPromos = async () => {
         setLoading(true);
         try {
            const promoStores = await getAllPromoStores({ store_id: String(store.id) });
            const allPromos = await getAllPromos();
            console.log('Store promoStores:', promoStores);
            const promoIds = promoStores.map((ps) => String(ps.promo_id));
            const filtered = allPromos.filter((p) => promoIds.includes(String(p.id_promo)));
            console.log('Filtered promos:', filtered);
            setPromos(filtered);
         } catch (err) {
            console.error("Error fetching promos:", err);
         } finally {
            setLoading(false);
         }
      };

      fetchPromos();
   }, [open, store]);

   if (!open || !store) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
         <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
         <div className="relative z-50 w-[640px] max-w-full mx-5">
            <Card className="bg-card">
               <CardHeader>
                  <CardTitle>{store.name}</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="mb-6">
                     <h5 className="text-sm font-medium mb-3">Store Details</h5>
                     <dl className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                           <dt className="text-xs text-muted-foreground">Company</dt>
                           <dd className="font-medium">{store.company}</dd>
                        </div>
                        <div>
                           <dt className="text-xs text-muted-foreground">Type</dt>
                           <dd className="font-medium">{store.store_type}</dd>
                        </div>
                        <div className="col-span-2">
                           <dt className="text-xs text-muted-foreground">Route</dt>
                           <dd className="font-medium">{store.route || "-"}</dd>
                        </div>
                        <div className="col-span-2">
                           <dt className="text-xs text-muted-foreground">Address</dt>
                           <dd className="font-medium">{store.address}</dd>
                        </div>
                     </dl>
                  </div>

                  <div>
                     <div className="flex justify-between items-center mb-3">
                        <h5 className="text-sm font-medium">
                           Active Promos ({promos.length})
                        </h5>
                        <Button
                           type="button"
                           variant="outline"
                           size="sm"
                           onClick={() => store && onLinkPromos?.(store)}
                        >
                           Link Promos
                        </Button>
                     </div>
                     {loading ? (
                        <div className="text-sm text-muted-foreground">Loading...</div>
                     ) : promos.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                           No promos assigned to this store.
                        </div>
                     ) : (
                        <ul className="grid grid-cols-1 gap-2 text-sm">
                           {promos.map((p) => (
                              <li key={p.id_promo} className="p-2 bg-muted/10 rounded">
                                 <div className="font-medium">{p.title_promo}</div>
                                 <div className="text-xs text-muted-foreground">
                                    {p.start_date_promo} — {p.end_date_promo}
                                 </div>
                              </li>
                           ))}
                        </ul>
                     )}
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                     <Button type="button" variant="outline" onClick={onClose}>
                        Close
                     </Button>
                     <Button type="button" variant="outline" onClick={() => onEdit?.(store)}>
                        Edit
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
