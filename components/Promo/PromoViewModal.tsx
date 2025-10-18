"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { PromoResponse, StoreResponse } from "@/utils/interface";
import type { PromoTenor } from "@/types";
import { formatCurrency, formatPercent, formatAdmin } from "@/utils/format";
import { getAllPromoTenors } from "@/services/api/promo_tenor";
import { getAllPromoStores } from "@/services/api/promo_store";
import { getAllStores } from "@/services/api/stores";
import TenorManagementModal from "./TenorManagementModal";
import StoreLinkingModal from "./StoreLinkingModal";

interface Props {
   open: boolean;
   onClose: () => void;
   promo: PromoResponse | null;
   onEdit?: (p: PromoResponse) => void;
}

export default function PromoViewModal({
   open,
   onClose,
   promo,
   onEdit,
}: Props) {
   const [tenors, setTenors] = useState<PromoTenor[]>([]);
   const [stores, setStores] = useState<StoreResponse[]>([]);
   const [loading, setLoading] = useState(false);
   const [showTenorModal, setShowTenorModal] = useState(false);
   const [showStoreLinkModal, setShowStoreLinkModal] = useState(false);

   useEffect(() => {
      if (!open || !promo) return;

      const fetchData = async () => {
         setLoading(true);
         try {
            const tenorData = await getAllPromoTenors({ promo_id: String(promo.id_promo) });
            const promoStoreData = await getAllPromoStores({ promo_id: String(promo.id_promo) });
            const allStores = await getAllStores();

            setTenors(tenorData);

            const storeIds = promoStoreData.map((ps) => String(ps.store_id));
            const filteredStores = allStores.filter((s) =>
               storeIds.includes(String(s.id))
            );
            setStores(filteredStores as unknown as StoreResponse[]);
         } catch (err) {
            console.error("Error fetching promo details:", err);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, [open, promo]);

   if (!open || !promo) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
         <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={onClose}
         />
         <div className="relative z-50 w-[640px] max-w-full mx-5">
            <Card className="bg-card">
               <CardHeader>
                  <div>
                     <CardTitle>{promo.title_promo}</CardTitle>
                  </div>
               </CardHeader>
               <CardContent>
                  <div className="mb-6">
                     <h5 className="text-sm font-medium mb-3">Promo Details</h5>
                     <dl className="grid grid-cols-2 gap-4 text-sm">
                        <div className="col-span-2">
                           <dt className="text-xs text-muted-foreground">
                              Periode
                           </dt>
                           <dd className="font-medium">
                              {promo.start_date_promo} — {promo.end_date_promo}
                           </dd>
                        </div>
                        <div>
                           <dt className="text-xs text-muted-foreground">
                              Active
                           </dt>
                           <dd className="font-medium">
                              {promo.is_active ? "Yes" : "No"}
                           </dd>
                        </div>
                     </dl>
                  </div>

                  <div className="mb-6">
                     <h5 className="text-sm font-medium mb-3">Tenors</h5>
                     {loading ? (
                        <div className="text-sm text-muted-foreground">
                           Loading tenors...
                        </div>
                     ) : tenors.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                           No tenors found.
                        </div>
                     ) : (
                        <div className="grid grid-cols-1 gap-2">
                           {tenors.map((t) => (
                              <div
                                 key={String(t.id)}
                                 className="p-3 bg-muted/10 rounded text-sm"
                              >
                                 <div className="font-medium">
                                    {String(t.tenor)} bulan - {String(t.voucher_code)}
                                 </div>
                                 <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                                    <div>
                                       <span className="text-muted-foreground">Min: </span>
                                       {formatCurrency(Number(t.min_transaction))}
                                    </div>
                                    <div>
                                       <span className="text-muted-foreground">Subsidi: </span>
                                       {formatPercent(Number(t.subsidi), 2)}
                                    </div>
                                    <div>
                                       <span className="text-muted-foreground">Admin: </span>
                                       {formatAdmin(Number(t.admin), promo.admin_promo_type)}
                                    </div>
                                    <div>
                                       <span className="text-muted-foreground">Discount: </span>
                                       {promo.discount_type === "PERCENT" 
                                          ? `${Number(t.discount)}%`
                                          : formatCurrency(Number(t.discount))}
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>

                  <div>
                     <div className="flex justify-between items-center mb-3">
                        <h5 className="text-sm font-medium">
                           Active in Stores ({stores.length})
                        </h5>
                        <Button
                           type="button"
                           variant="outline"
                           size="sm"
                           onClick={() => setShowStoreLinkModal(true)}
                        >
                           Link Stores
                        </Button>
                     </div>
                     {loading ? (
                        <div className="text-sm text-muted-foreground">
                           Loading stores...
                        </div>
                     ) : stores.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                           This promo is not assigned to any store.
                        </div>
                     ) : (
                        <ul className="grid grid-cols-1 gap-2 text-sm">
                           {stores.map((s) => (
                              <li
                                 key={s.id}
                                 className="p-2 bg-muted/10 rounded"
                              >
                                 <div className="font-medium">{s.name}</div>
                                 <div className="text-xs text-muted-foreground">
                                    {s.company} — {s.route || "-"}
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
                     <Button type="button" variant="outline" onClick={() => onEdit?.(promo)}>
                        Edit Info
                     </Button>
                     <Button type="button" onClick={() => setShowTenorModal(true)}>
                        Manage Tenors
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </div>
         <TenorManagementModal
            open={showTenorModal}
            onClose={() => {
               setShowTenorModal(false);
               if (promo) {
                  getAllPromoTenors({ promo_id: String(promo.id_promo) }).then((data) => setTenors(data));
               }
            }}
            promoId={promo.id_promo}
            promoTitle={promo.title_promo}
         />
         <StoreLinkingModal
            open={showStoreLinkModal}
            onClose={() => {
               setShowStoreLinkModal(false);
               if (promo) {
                  const fetchStores = async () => {
                     const promoStoreData = await getAllPromoStores({ promo_id: String(promo.id_promo) });
                     const allStores = await getAllStores();
                     const storeIds = promoStoreData.map((ps) => String(ps.store_id));
                     const filteredStores = allStores.filter((s) => storeIds.includes(String(s.id)));
                     setStores(filteredStores as unknown as StoreResponse[]);
                  };
                  fetchStores();
               }
            }}
            promoId={String(promo.id_promo)}
            promoTitle={promo.title_promo}
         />
      </div>
   );
}
