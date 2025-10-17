"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { PromoResponse } from "@/utils/interface";
import type { StoreResponse } from "@/utils/interface";
import { formatCurrency, formatPercent, formatAdmin } from "@/utils/format";

interface Props {
   open: boolean;
   onClose: () => void;
   promo: PromoResponse | null;
   onEdit?: (p: PromoResponse) => void;
   // stores are provided by the parent when opening the modal to avoid
   // fetching inside the modal (UX: show list immediately on open)
   stores?: StoreResponse[];
   storesLoading?: boolean;
   storesError?: string | null;
}

export default function PromoViewModal({
   open,
   onClose,
   promo,
   onEdit,
   stores = [],
   storesLoading = false,
   storesError = null,
}: Props) {
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
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                     <div>
                        <dt className="text-xs text-muted-foreground">
                           Voucher
                        </dt>
                        <dd className="font-medium">
                           {promo.voucher_code || "-"}
                        </dd>
                     </div>
                     <div>
                        <dt className="text-xs text-muted-foreground">
                           Min Transaction
                        </dt>
                        <dd className="font-medium">
                           {formatCurrency(promo.min_transaction_promo)}
                        </dd>
                     </div>
                     <div>
                        <dt className="text-xs text-muted-foreground">Tenor</dt>
                        <dd className="font-medium">
                           {promo.tenor_promo} bulan
                        </dd>
                     </div>
                     <div>
                        <dt className="text-xs text-muted-foreground">
                           Subsidi
                        </dt>
                        <dd className="font-medium">
                           {formatPercent(promo.subsidi_promo, 2)}
                        </dd>
                     </div>
                     <div>
                        <dt className="text-xs text-muted-foreground">Admin</dt>
                        <dd className="font-medium">
                           {formatAdmin(
                              promo.admin_promo,
                              promo.admin_promo_type
                           )}
                        </dd>
                     </div>
                     <div>
                        <dt className="text-xs text-muted-foreground">
                           Interest
                        </dt>
                        <dd className="font-medium">
                           {formatPercent(promo.interest_rate, 2)}
                        </dd>
                     </div>
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
                           Free Installment
                        </dt>
                        <dd className="font-medium">
                           {promo.free_installment}
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

                  <div className="mt-6">
                     <h5 className="text-sm font-medium mb-2">
                        Active in Stores
                     </h5>
                     {storesLoading ? (
                        <div className="text-sm text-muted-foreground">
                           Loading stores...
                        </div>
                     ) : storesError ? (
                        <div className="text-sm text-destructive">
                           Error loading stores: {storesError}
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
                     <Button variant="outline" onClick={onClose}>
                        Close
                     </Button>
                     <Button onClick={() => onEdit?.(promo)}>Edit</Button>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
