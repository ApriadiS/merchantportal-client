import { PromoResponse } from "@/utils/interface";

type Result = {
   monthly: number;
   totalInterest: number;
   totalPayment: number;
};

interface InstallmentDetailsProps {
   expanded: number;
   results: Record<number, Result>;
   n: number;
   selectedPromo: PromoResponse | null;
   formatRupiahLocal: (amount: number) => string;
}

export default function InstallmentDetails({
   expanded,
   results,
   n,
   selectedPromo,
   formatRupiahLocal,
}: InstallmentDetailsProps) {
   const hasDiscount = Boolean(
      selectedPromo &&
         selectedPromo.discount != null &&
         expanded === selectedPromo.tenor_promo
   );

   console.log("expanded: ");
   console.log(expanded);
   console.log("results:");
   console.log(results);
   console.log("results[expanded]?:");
   console.log(results[expanded]);
   console.log(
      "results[expanded]?.totalInterest: " + results[expanded]?.totalInterest
   );

   return (
      <div className="p-4 mt-4 text-black bg-white rounded-md">
         <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600">Rincian</h3>

            {selectedPromo &&
            expanded === selectedPromo.tenor_promo &&
            selectedPromo.free_installment > 0 ? (
               <>
                  <div className="flex flex-row gap-1">
                     <span className="text-xs text-gray-500 line-through">
                        {expanded} Bulan
                     </span>
                     <span className="ml-1 text-xs text-gray-500">
                        {expanded - selectedPromo.free_installment} Bulan
                     </span>
                  </div>
               </>
            ) : (
               <span className="text-xs text-gray-500">
                  Tenor: {expanded} bulan
               </span>
            )}
         </div>

         <div className="space-y-2">
            <div className="flex justify-between text-sm">
               <span>Harga Produk:</span>
               <strong>{formatRupiahLocal(n)}</strong>
            </div>

            {/* Admin fee */}
            {selectedPromo &&
               expanded === selectedPromo.tenor_promo &&
               selectedPromo.admin_promo > 0 && (
                  <div className="flex justify-between text-sm">
                     <span>Biaya Admin:</span>
                     <strong>
                        +
                        {selectedPromo.admin_promo_type === "PERCENT"
                           ? `${
                                selectedPromo.admin_promo
                             }% (${formatRupiahLocal(
                                Math.round(
                                   n * (selectedPromo.admin_promo / 100)
                                )
                             )})`
                           : formatRupiahLocal(selectedPromo.admin_promo)}
                     </strong>
                  </div>
               )}

            {/* Discount */}
            {hasDiscount && selectedPromo && (
               <div className="flex justify-between text-sm text-green-600">
                  <span>Discount:</span>
                  <strong>
                     -
                     {selectedPromo.discount_type === "PERCENT"
                        ? `${selectedPromo.discount}% (${formatRupiahLocal(
                             Math.min(
                                Math.round(
                                   n * ((selectedPromo.discount || 0) / 100)
                                ),
                                selectedPromo.max_discount || Infinity
                             )
                          )})`
                        : formatRupiahLocal(selectedPromo.discount || 0)}
                  </strong>
               </div>
            )}

            <div className="flex justify-between pt-2 text-sm font-semibold border-t border-gray-300">
               <span>Pokok Akhir:</span>
               <strong>
                  {formatRupiahLocal(
                     selectedPromo && expanded === selectedPromo.tenor_promo
                        ? n +
                             (selectedPromo.admin_promo_type === "PERCENT"
                                ? Math.round(
                                     n * (selectedPromo.admin_promo / 100)
                                  )
                                : selectedPromo.admin_promo) -
                             (selectedPromo.discount
                                ? selectedPromo.discount_type === "PERCENT"
                                   ? Math.min(
                                        Math.round(
                                           n *
                                              ((selectedPromo.discount || 0) /
                                                 100)
                                        ),
                                        selectedPromo.max_discount || Infinity
                                     )
                                   : selectedPromo.discount || 0
                                : 0)
                        : n
                  )}
               </strong>
            </div>

            <div className="flex justify-between text-sm">
               <span>Total Biaya Bunga:</span>
               <strong>
                  {results[expanded]?.totalInterest
                     ? formatRupiahLocal(results[expanded].totalInterest)
                     : "Rp 0"}
               </strong>
            </div>

            <div className="flex justify-between pt-2 text-sm font-semibold border-t border-black">
               <span>Total Pembayaran:</span>
               <strong className="text-red-500">
                  {results[expanded]?.totalPayment
                     ? formatRupiahLocal(results[expanded].totalPayment)
                     : "Rp 0"}
               </strong>
            </div>
         </div>
      </div>
   );
}
