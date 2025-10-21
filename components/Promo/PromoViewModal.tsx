"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/components/ui/accordion";
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
            const tenorData = await getAllPromoTenors({
               promo_id: String(promo.id_promo),
            });
            const promoStoreData = await getAllPromoStores({
               promo_id: String(promo.id_promo),
            });
            const allStores = await getAllStores();

            tenorData.sort((a, b) => a.tenor - b.tenor);
            setTenors(tenorData);

            const storeIds = promoStoreData.map((ps) => String(ps.store_id));
            const filteredStores = allStores.filter((s) =>
               storeIds.includes(String(s.id))
            );
            filteredStores.sort((a, b) => a.name.localeCompare(b.name));
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
         <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={onClose}
         />
         <div className="relative z-50 w-full max-w-[640px] max-h-[90vh] overflow-y-auto rounded-lg">
            <Card className="bg-card rounded-lg">
               <CardHeader>
                  <div>
                     <CardTitle>{promo.title_promo}</CardTitle>
                  </div>
               </CardHeader>
               <CardContent>
                  <Accordion
                     type="single"
                     collapsible
                     defaultValue="details"
                     className="w-full"
                  >
                     <AccordionItem value="details">
                        <AccordionTrigger className="text-sm font-medium border-0">
                           Promo Details
                        </AccordionTrigger>
                        <AccordionContent>
                           <dl className="grid grid-cols-2 gap-4 text-sm">
                              <div className="col-span-2">
                                 <dt className="text-xs text-muted-foreground">Title</dt>
                                 <dd className="font-medium">{promo.title_promo}</dd>
                              </div>
                              <div className="col-span-2">
                                 <dt className="text-xs text-muted-foreground">Voucher Code</dt>
                                 <dd className="font-medium">{promo.voucher_code}</dd>
                              </div>
                              <div className="col-span-2">
                                 <dt className="text-xs text-muted-foreground">Min Transaction</dt>
                                 <dd className="font-medium">{formatCurrency(promo.min_transaction_promo)}</dd>
                              </div>
                              <div>
                                 <dt className="text-xs text-muted-foreground">Tenor</dt>
                                 <dd className="font-medium">{promo.tenor_promo} bulan</dd>
                              </div>
                              <div>
                                 <dt className="text-xs text-muted-foreground">Subsidi</dt>
                                 <dd className="font-medium">{formatPercent(promo.subsidi_promo, 2)}</dd>
                              </div>
                              <div>
                                 <dt className="text-xs text-muted-foreground">Admin</dt>
                                 <dd className="font-medium">{formatAdmin(promo.admin_promo, promo.admin_promo_type)}</dd>
                              </div>
                              <div>
                                 <dt className="text-xs text-muted-foreground">Interest Rate</dt>
                                 <dd className="font-medium">{promo.interest_rate}%</dd>
                              </div>
                              <div>
                                 <dt className="text-xs text-muted-foreground">Free Installment</dt>
                                 <dd className="font-medium">{promo.free_installment}</dd>
                              </div>
                              {promo.discount !== undefined && (
                                 <div>
                                    <dt className="text-xs text-muted-foreground">Discount</dt>
                                    <dd className="font-medium">
                                       {promo.discount_type === "PERCENT" ? `${promo.discount}%` : formatCurrency(promo.discount)}
                                    </dd>
                                 </div>
                              )}
                              {promo.max_discount !== undefined && (
                                 <div>
                                    <dt className="text-xs text-muted-foreground">Max Discount</dt>
                                    <dd className="font-medium">{formatCurrency(promo.max_discount)}</dd>
                                 </div>
                              )}
                              <div className="col-span-2">
                                 <dt className="text-xs text-muted-foreground">Periode</dt>
                                 <dd className="font-medium">
                                    {promo.start_date_promo} — {promo.end_date_promo}
                                 </dd>
                              </div>
                              <div>
                                 <dt className="text-xs text-muted-foreground">Active</dt>
                                 <dd className="font-medium">
                                    {promo.is_active ? "Yes" : "No"}
                                 </dd>
                              </div>
                              <div>
                                 <dt className="text-xs text-muted-foreground">Admin Type</dt>
                                 <dd className="font-medium">{promo.admin_promo_type}</dd>
                              </div>
                              <div>
                                 <dt className="text-xs text-muted-foreground">Discount Type</dt>
                                 <dd className="font-medium">{promo.discount_type}</dd>
                              </div>
                           </dl>
                        </AccordionContent>
                     </AccordionItem>

                     <AccordionItem value="tenors">
                        <AccordionTrigger className="text-sm font-medium border-0">
                           Tenors ({tenors.length})
                        </AccordionTrigger>
                        <AccordionContent>
                           {loading ? (
                              <div className="text-sm text-muted-foreground">
                                 Loading tenors...
                              </div>
                           ) : tenors.length === 0 ? (
                              <div className="text-sm text-muted-foreground">
                                 No tenors found.
                              </div>
                           ) : (
                              <div className="grid grid-cols-1 gap-2 max-h-[250px] overflow-y-auto">
                                 {tenors.map((t) => (
                                    <div
                                       key={String(t.id)}
                                       className="p-3 text-sm rounded bg-muted/10"
                                    >
                                       <div className="font-medium">
                                          {String(t.tenor)} bulan -{" "}
                                          {String(t.voucher_code)}
                                       </div>
                                       <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                                          <div>
                                             <span className="text-muted-foreground">
                                                Min:{" "}
                                             </span>
                                             {formatCurrency(
                                                Number(t.min_transaction)
                                             )}
                                          </div>
                                          <div>
                                             <span className="text-muted-foreground">
                                                Subsidi:{" "}
                                             </span>
                                             {formatPercent(
                                                Number(t.subsidi),
                                                2
                                             )}
                                          </div>
                                          <div>
                                             <span className="text-muted-foreground">
                                                Admin:{" "}
                                             </span>
                                             {formatAdmin(
                                                Number(t.admin),
                                                promo.admin_promo_type
                                             )}
                                          </div>
                                          <div>
                                             <span className="text-muted-foreground">
                                                Discount:{" "}
                                             </span>
                                             {promo.discount_type === "PERCENT"
                                                ? `${Number(t.discount)}%`
                                                : formatCurrency(
                                                     Number(t.discount)
                                                  )}
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </AccordionContent>
                     </AccordionItem>

                     <AccordionItem value="stores">
                        <AccordionTrigger className="text-sm font-medium border-0">
                           Active in Stores ({stores.length})
                        </AccordionTrigger>
                        <AccordionContent>
                           <div className="mb-3">
                              <Button
                                 type="button"
                                 variant="outline"
                                 size="sm"
                                 onClick={() => setShowStoreLinkModal(true)}
                                 className="w-full"
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
                              <ul className="grid grid-cols-1 gap-2 text-sm max-h-[250px] overflow-y-auto">
                                 {stores.map((s) => (
                                    <li
                                       key={s.id}
                                       className="p-2 rounded bg-muted/10"
                                    >
                                       <div className="font-medium">
                                          {s.name}
                                       </div>
                                       <div className="text-xs text-muted-foreground">
                                          {s.company} — {s.route || "-"}
                                       </div>
                                    </li>
                                 ))}
                              </ul>
                           )}
                        </AccordionContent>
                     </AccordionItem>
                  </Accordion>

                  <div className="flex justify-center gap-2 mt-4 sm:justify-center">
                     <Button type="button" variant="outline" onClick={onClose}>
                        Close
                     </Button>
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => onEdit?.(promo)}
                     >
                        Edit Info
                     </Button>
                     <Button
                        type="button"
                        onClick={() => setShowTenorModal(true)}
                     >
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
                  getAllPromoTenors({ promo_id: String(promo.id_promo) })
                     .then((data) => {
                        data.sort((a, b) => a.tenor - b.tenor);
                        setTenors(data);
                     })
                     .catch((err) => {
                        console.error("Error refreshing tenors:", err);
                     });
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
                     const promoStoreData = await getAllPromoStores({
                        promo_id: String(promo.id_promo),
                     });
                     const allStores = await getAllStores();
                     const storeIds = promoStoreData.map((ps) =>
                        String(ps.store_id)
                     );
                     const filteredStores = allStores.filter((s) =>
                        storeIds.includes(String(s.id))
                     );
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
