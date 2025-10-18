import { PromoTenor } from "@/types";
import { PromoResponse } from "@/utils/interface";
import TenorCard from "./TenorCard";
import InstallmentDetails from "./InstallmentDetails";

type Result = {
   monthly: number;
   totalInterest: number;
   totalPayment: number;
};

interface InstallmentResultsProps {
   tenors: number[];
   results: Record<number, Result>;
   expanded: number | null;
   promoTenors: PromoTenor[];
   promoMap: Map<string, PromoResponse>;
   selectedPromoId: string | null;
   n: number;
   formatRupiahLocal: (amount: number) => string;
   onToggleExpanded: (months: number) => void;
   onCopyVoucher: () => void;
}

export default function InstallmentResults({
   tenors,
   results,
   expanded,
   promoTenors,
   promoMap,
   selectedPromoId,
   n,
   formatRupiahLocal,
   onToggleExpanded,
   onCopyVoucher,
}: InstallmentResultsProps) {
   const activeTenor = expanded && selectedPromoId
      ? promoTenors.find(t => t.promo_id === selectedPromoId && t.tenor === expanded)
      : null;
   const activePromo = activeTenor ? promoMap.get(activeTenor.promo_id) : null;

   return (
      <div className="p-3 bg-red-100 rounded-xl">
         <h2 className="mb-3 text-sm font-semibold text-center text-red-500">
            Hasil Simulasi Cicilan
         </h2>

         <div className="grid grid-cols-3 gap-2">
            {tenors.map((months) => {
               const res = results[months];
               const isOpen = expanded === months;
               const hasPromo = selectedPromoId
                  ? promoTenors.some(t => t.promo_id === selectedPromoId && t.tenor === months)
                  : false;
               return (
                  <TenorCard
                     key={months}
                     months={months}
                     result={res}
                     isOpen={isOpen}
                     hasPromo={hasPromo}
                     onToggle={() => onToggleExpanded(months)}
                     formatRupiahLocal={formatRupiahLocal}
                  />
               );
            })}
         </div>

         {expanded !== null && results[expanded] && (
            <InstallmentDetails
               expanded={expanded}
               results={results}
               n={n}
               activeTenor={activeTenor}
               activePromo={activePromo}
               formatRupiahLocal={formatRupiahLocal}
               onCopyVoucher={onCopyVoucher}
            />
         )}
      </div>
   );
}
