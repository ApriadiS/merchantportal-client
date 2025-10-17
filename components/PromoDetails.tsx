import { PromoResponse } from "@/utils/interface";

interface PromoDetailsProps {
   selectedPromo: PromoResponse;
   n: number;
   formatRupiahLocal: (amount: number) => string;
}

export default function PromoDetails({
   selectedPromo,
   n,
   formatRupiahLocal,
}: PromoDetailsProps) {


   return (
      <div className="p-4 mt-4 text-black bg-white rounded-md">
         <h3 className="mb-2 font-semibold text-red-500">
            Detail Promo Terpilih
         </h3>
         <div className="space-y-2">
            <div className="flex justify-between text-sm">
               <span>Judul Promo:</span>
               <strong>{selectedPromo.title_promo}</strong>
            </div>
            <div className="flex justify-between text-sm">
               <span>Tenor:</span>
               <strong>{selectedPromo.tenor_promo} bulan</strong>
            </div>
            <div className="flex justify-between text-sm">
               <span>Admin:</span>
               <strong>
                  {selectedPromo.admin_promo_type === "PERCENT"
                     ? `${selectedPromo.admin_promo}%`
                     : `Rp ${selectedPromo.admin_promo.toLocaleString(
                          "id-ID"
                       )}`}
               </strong>
            </div>
            <div className="flex justify-between text-sm">
               <span>Bunga:</span>
               <strong>{selectedPromo.interest_rate}%</strong>
            </div>
            <div className="flex justify-between text-sm">
               <span>Kode Voucher:</span>
               <strong>{selectedPromo.voucher_code || "-"}</strong>
            </div>
            {selectedPromo.discount != null && selectedPromo.discount > 0 && (
               <div className="flex justify-between text-sm">
                  <span>Diskon:</span>
                  <strong>
                     {selectedPromo.discount_type === "PERCENT"
                        ? `${selectedPromo.discount}%`
                        : `Rp ${selectedPromo.discount.toLocaleString(
                             "id-ID"
                          )}`}
                  </strong>
               </div>
            )}
            {selectedPromo.max_discount != null &&
               selectedPromo.max_discount > 0 &&
               selectedPromo.discount_type === "PERCENT" && (
                  <div className="flex justify-between text-sm">
                     <span>Maks Diskon:</span>
                     <strong>
                        Rp {selectedPromo.max_discount.toLocaleString("id-ID")}
                     </strong>
                  </div>
               )}
         </div>

         {/* Partner Payout Information */}
         {selectedPromo.subsidi_promo > 0 && (
            <div className="pt-3 mt-3 border-t border-gray-200">
               <h4 className="mb-2 text-sm font-semibold text-blue-600">
                  Informasi Partner
               </h4>
               <div className="flex justify-between text-sm">
                  <span>Partner Payout:</span>
                  <strong className="text-blue-600">
                     {formatRupiahLocal(
                        n - Math.round(n * (selectedPromo.subsidi_promo / 100))
                     )}
                  </strong>
               </div>
               <div className="flex justify-between text-sm text-gray-600">
                  <span>Subsidi:</span>
                  <strong>
                     -{selectedPromo.subsidi_promo}% (
                     {formatRupiahLocal(
                        Math.round(n * (selectedPromo.subsidi_promo / 100))
                     )}
                     )
                  </strong>
               </div>
            </div>
         )}
      </div>
   );
}
