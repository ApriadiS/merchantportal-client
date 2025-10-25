import { memo, useMemo } from "react";
import { PromoTenor } from "@/types";
import { PromoResponse } from "@/utils/interface";

interface PromoSelectorProps {
   availableTenors: PromoTenor[];
   allTenors: PromoTenor[];
   promos: PromoResponse[];
   n: number;
   selectedPromoId: string | null;
   onPromoChange: (id: string | null) => void;
}

function PromoSelector({
   availableTenors,
   allTenors,
   promos,
   n,
   selectedPromoId,
   onPromoChange
}: PromoSelectorProps) {
   const promoGroups = useMemo(() => {
      const groups = new Map<string, { promo_id: string; title: string }>();
      
      availableTenors.forEach(tenor => {
         if (!groups.has(tenor.promo_id)) {
            const promo = promos.find(p => String(p.id_promo) === tenor.promo_id);
            groups.set(tenor.promo_id, {
               promo_id: tenor.promo_id,
               title: promo?.title_promo || "Promo Tanpa Judul"
            });
         }
      });
      
      return Array.from(groups.values());
   }, [availableTenors, promos]);

   return (
      <div className="p-3 bg-red-100 rounded-xl">
         <label
            htmlFor="promo"
            className="block mb-2 text-sm font-medium text-gray-700"
         >
            Pilih Promo (Opsional)
         </label>
         <select
            id="promo"
            name="promo"
            className="w-full p-3.5 text-base text-white bg-gray-900 border-0 rounded-lg focus:ring-2 focus:ring-red-500"
            value={selectedPromoId ?? ""}
            onChange={(e) => onPromoChange(e.target.value || null)}
            disabled={promoGroups.length === 0}
         >
            <option value="">REGULER</option>
            {promoGroups.map((group) => (
               <option key={group.promo_id} value={group.promo_id}>
                  {group.title}
               </option>
            ))}
         </select>
         {promoGroups.length === 0 && n > 0 && (
            <p className="mt-2 text-sm text-red-600">
               Tidak ada promo yang memenuhi harga barang.
            </p>
         )}
         {allTenors.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">
               Belum ada promo tersedia untuk toko ini.
            </p>
         )}
      </div>
   );
}

export default memo(PromoSelector);