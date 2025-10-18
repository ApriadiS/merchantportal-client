import { PromoTenor } from "@/types";
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
   activeTenor: PromoTenor | null;
   activePromo: PromoResponse | null | undefined;
   formatRupiahLocal: (amount: number) => string;
   onCopyVoucher: () => void;
}

export default function InstallmentDetails({
   expanded,
   results,
   n,
   activeTenor,
   activePromo,
   formatRupiahLocal,
   onCopyVoucher,
}: InstallmentDetailsProps) {
   const hasDiscount = Boolean(activeTenor && activeTenor.discount > 0);

   const adminFee =
      activeTenor && activePromo
         ? activePromo.admin_promo_type === "PERCENT"
            ? Math.ceil((n * activeTenor.admin) / 100)
            : activeTenor.admin
         : 0;

   const discountAmount =
      activeTenor && activePromo && hasDiscount
         ? (() => {
              const disc =
                 activePromo.discount_type === "PERCENT"
                    ? Math.ceil((n * activeTenor.discount) / 100)
                    : activeTenor.discount;
              return Math.min(disc, activeTenor.max_discount);
           })()
         : 0;

   return (
      <div className="p-3 mt-3 text-black bg-white rounded-lg">
         <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600">Rincian</h3>
            {activeTenor && activeTenor.free_installment > 0 ? (
               <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>Tenor:</span>
                  <span className="line-through">{expanded} bulan</span>
                  <span className="font-semibold text-red-500">
                     {expanded - activeTenor.free_installment} bulan
                  </span>
               </div>
            ) : (
               <span className="text-xs text-gray-500">
                  Tenor: {expanded} bulan
               </span>
            )}
         </div>

         <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
               <span>Harga Produk:</span>
               <strong>{formatRupiahLocal(n)}</strong>
            </div>

            {adminFee > 0 && (
               <div className="flex justify-between text-xs">
                  <span>Biaya Admin:</span>
                  <strong>+{formatRupiahLocal(adminFee)}</strong>
               </div>
            )}

            {discountAmount > 0 && (
               <div className="flex justify-between text-xs text-green-600">
                  <span>Discount:</span>
                  <strong>-{formatRupiahLocal(discountAmount)}</strong>
               </div>
            )}

            <div className="flex justify-between pt-1.5 text-xs font-semibold border-t border-gray-300">
               <span>Pokok Akhir:</span>
               <strong>
                  {formatRupiahLocal(n + adminFee - discountAmount)}
               </strong>
            </div>

            <div className="flex justify-between text-xs">
               <span>Total Biaya Bunga:</span>
               <strong>
                  {results[expanded]?.totalInterest
                     ? formatRupiahLocal(results[expanded].totalInterest)
                     : "Rp 0"}
               </strong>
            </div>

            <div className="flex justify-between pt-1.5 text-xs font-semibold border-t border-black">
               <span>Total Pembayaran:</span>
               <strong className="text-red-500">
                  {results[expanded]?.totalPayment
                     ? formatRupiahLocal(results[expanded].totalPayment)
                     : "Rp 0"}
               </strong>
            </div>

            {activeTenor && activeTenor.free_installment > 0 && (
               <div className="p-2.5 mt-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-xs leading-relaxed text-yellow-800">
                     <div className="mb-1 font-bold">⚠️ Perhatian:</div>
                     <div className="font-medium">
                        Gratis cicilan hanya diberikan jika pembayaran tepat
                        waktu. Keterlambatan akan mengembalikan tenor ke{" "}
                        {expanded} bulan dan promo hangus.
                     </div>
                  </div>
               </div>
            )}

            {activeTenor?.voucher_code && (
               <div className="pt-2 mt-2 border-t border-gray-300">
                  <label className="block mb-1.5 text-xs font-medium text-gray-600">
                     Kode Voucher:
                  </label>
                  <div className="flex gap-2">
                     <input
                        type="text"
                        value={activeTenor.voucher_code}
                        disabled
                        className="flex-1 px-3 py-2.5 text-sm font-mono text-gray-700 bg-gray-100 border-0 rounded-lg"
                        readOnly
                     />
                     <button
                        type="button"
                        onClick={onCopyVoucher}
                        className="px-4 py-2.5 text-sm font-medium text-white bg-blue-500 rounded-lg active:scale-95 transition-transform"
                     >
                        Copy
                     </button>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
