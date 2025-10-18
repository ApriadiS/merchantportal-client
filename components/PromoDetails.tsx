import { PromoTenor } from "@/types";

interface PromoDetailsProps {
   selectedTenor: PromoTenor;
   n: number;
   formatRupiahLocal: (amount: number) => string;
}

export default function PromoDetails({
   selectedTenor,
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
               <span>Tenor:</span>
               <strong>{selectedTenor.tenor} bulan</strong>
            </div>
            <div className="flex justify-between text-sm">
               <span>Admin:</span>
               <strong>Rp {selectedTenor.admin.toLocaleString("id-ID")}</strong>
            </div>
            <div className="flex justify-between text-sm">
               <span>Bunga:</span>
               <strong>{selectedTenor.subsidi}%</strong>
            </div>
            {selectedTenor.voucher_code && (
               <div className="flex justify-between text-sm">
                  <span>Kode Voucher:</span>
                  <strong>{selectedTenor.voucher_code}</strong>
               </div>
            )}
            {selectedTenor.discount > 0 && (
               <div className="flex justify-between text-sm">
                  <span>Diskon:</span>
                  <strong>Rp {selectedTenor.discount.toLocaleString("id-ID")}</strong>
               </div>
            )}
            {selectedTenor.max_discount > 0 && (
               <div className="flex justify-between text-sm">
                  <span>Maks Diskon:</span>
                  <strong>Rp {selectedTenor.max_discount.toLocaleString("id-ID")}</strong>
               </div>
            )}
         </div>

         {selectedTenor.subsidi > 0 && (
            <div className="pt-3 mt-3 border-t border-gray-200">
               <h4 className="mb-2 text-sm font-semibold text-blue-600">
                  Informasi Partner
               </h4>
               <div className="flex justify-between text-sm">
                  <span>Partner Payout:</span>
                  <strong className="text-blue-600">
                     {formatRupiahLocal(
                        n - Math.round(n * (selectedTenor.subsidi / 100))
                     )}
                  </strong>
               </div>
               <div className="flex justify-between text-sm text-gray-600">
                  <span>Subsidi:</span>
                  <strong>
                     -{selectedTenor.subsidi}% (
                     {formatRupiahLocal(
                        Math.round(n * (selectedTenor.subsidi / 100))
                     )}
                     )
                  </strong>
               </div>
            </div>
         )}
      </div>
   );
}
