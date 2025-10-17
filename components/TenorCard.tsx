import { PromoResponse } from "@/utils/interface";

type Result = {
   monthly: number;
   totalInterest: number;
   totalPayment: number;
};

interface TenorCardProps {
   months: number;
   result: Result | undefined;
   isOpen: boolean;
   selectedPromo: PromoResponse | null;
   onToggle: () => void;
   formatRupiahLocal: (amount: number) => string;
}

export default function TenorCard({
   months,
   result,
   isOpen,
   selectedPromo,
   onToggle,
   formatRupiahLocal,
}: TenorCardProps) {
   return (
      <div className="relative text-center">
         <div className="p-3 rounded-lg flex flex-col items-center justify-center min-h-[100px] gap-1 sm:gap-0 bg-gray-50 h-32">
            <div className="h-6 text-sm text-gray-600">
               {selectedPromo &&
               months === selectedPromo.tenor_promo &&
               selectedPromo.free_installment > 0 ? (
                  <div className="flex flex-col">
                     <span className="line-through">{months} Bulan</span>
                     <span className="ml-1 font-semibold text-red-500">
                        {months - selectedPromo.free_installment} Bulan
                     </span>
                  </div>
               ) : (
                  `${months} Bulan`
               )}
            </div>
            <div className="flex items-center justify-center flex-grow w-full my-1 text-center">
               <p className="text-sm font-bold text-red-500 sm:text-base whitespace-nowrap">
                  {result ? formatRupiahLocal(result.monthly) : "-"}
               </p>
            </div>

            <button
               type="button"
               aria-label={`Tampilkan rincian untuk ${months} bulan`}
               aria-expanded={isOpen}
               onClick={onToggle}
               className={`transform transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
               }`}
            >
               <svg
                  className="w-5 h-5 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
               >
                  <path
                     strokeWidth={2}
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M19 9l-7 7-7-7"
                  />
               </svg>
            </button>
         </div>

         {/* Promo stamp */}
         {selectedPromo && months === selectedPromo.tenor_promo && (
            <div className="absolute flex items-center justify-center w-12 h-12 bg-red-500 border-2 border-white rounded-full shadow-lg -top-2 -right-2">
               <span className="text-[10px] font-bold text-white transform -rotate-12">
                  PROMO
               </span>
            </div>
         )}
      </div>
   );
}
