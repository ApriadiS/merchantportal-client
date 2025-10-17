import { memo } from "react";
import { PromoResponse, StoreResponse } from "@/utils/interface";

interface PromoSelectorProps {
   store: StoreResponse | null;
   availablePromos: PromoResponse[];
   promos: PromoResponse[];
   n: number;
   selectedPromoId: number | null;
   selectedPromo: PromoResponse | null;
   formatShortAmount: (amount: number) => string;
   onPromoChange: (id: number | null) => void;
   onCopyVoucher: () => void;
}

function PromoSelector({
   store,
   availablePromos,
   promos,
   n,
   selectedPromoId,
   selectedPromo,
   formatShortAmount,
   onPromoChange,
   onCopyVoucher
}: PromoSelectorProps) {
   if (!store) return null;

   return (
      <div className="p-4 bg-red-100 rounded-xl">
         <label
            htmlFor="promo"
            className="block mb-2 text-sm font-medium text-gray-700"
         >
            Pilih Promo (Opsional)
         </label>
         <select
            id="promo"
            name="promo"
            className="w-full p-3 text-sm text-white bg-gray-900 border border-gray-200 rounded-lg"
            value={selectedPromoId ?? ""}
            onChange={(e) => onPromoChange(Number(e.target.value) || null)}
            disabled={availablePromos.length === 0}
         >
            <option value="">-- Pilih Promo --</option>
            {availablePromos.map((promo) => (
               <option key={promo.id_promo} value={promo.id_promo}>
                  {promo.title_promo} • {promo.tenor_promo}Bln •
                  Min: {formatShortAmount(promo.min_transaction_promo)}
               </option>
            ))}
         </select>
         {availablePromos.length === 0 && n > 0 && (
            <p className="mt-2 text-sm text-red-600">
               Tidak ada promo yang memenuhi harga barang.
            </p>
         )}
         {promos.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">
               Belum ada promo tersedia untuk toko ini.
            </p>
         )}

         {selectedPromo && (
            <div className="mt-3">
               <label className="block mb-2 text-sm font-medium text-gray-700">
                  Kode Voucher:
               </label>
               <div className="flex gap-2">
                  <input
                     type="text"
                     value={selectedPromo.voucher_code}
                     disabled
                     className="flex-1 px-3 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md"
                     readOnly
                  />
                  <button
                     type="button"
                     onClick={onCopyVoucher}
                     className="px-3 py-2 text-sm text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
                  >
                     Copy
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}

export default memo(PromoSelector);