import { PromoResponse } from "@/utils/interface";
import TenorCard from "./TenorCard";
import InstallmentDetails from "./InstallmentDetails";

type Result = {
   monthly: number;
   totalInterest: number;
   totalPayment: number;
};

interface InstallmentResultsProps {
   TENORS: number[];
   results: Record<number, Result>;
   expanded: number | null;
   selectedPromo: PromoResponse | null;
   n: number;
   formatRupiahLocal: (amount: number) => string;
   onToggleExpanded: (months: number) => void;
}

export default function InstallmentResults({
   TENORS,
   results,
   expanded,
   selectedPromo,
   n,
   formatRupiahLocal,
   onToggleExpanded,
}: InstallmentResultsProps) {
   return (
      <div className="p-4 bg-red-100 rounded-xl">
         <h2 className="mb-4 font-semibold text-center text-red-500 text-md">
            Hasil Simulasi Cicilan
         </h2>

         <div className="grid h-full grid-cols-3 gap-3 sm:gap-4">
            {TENORS.map((months) => {
               const res = results[months];
               const isOpen = expanded === months;
               return (
                  <TenorCard
                     key={months}
                     months={months}
                     result={res}
                     isOpen={isOpen}
                     selectedPromo={selectedPromo}
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
               selectedPromo={selectedPromo}
               formatRupiahLocal={formatRupiahLocal}
            />
         )}
      </div>
   );
}
