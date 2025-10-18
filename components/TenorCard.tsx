import { PromoTenor } from "@/types";

type Result = {
   monthly: number;
   totalInterest: number;
   totalPayment: number;
};

interface TenorCardProps {
   months: number;
   result: Result | undefined;
   isOpen: boolean;
   hasPromo: boolean;
   onToggle: () => void;
   formatRupiahLocal: (amount: number) => string;
}

export default function TenorCard({
   months,
   result,
   isOpen,
   hasPromo,
   onToggle,
   formatRupiahLocal,
}: TenorCardProps) {
   return (
      <div className="relative text-center">
         <div className="p-2.5 rounded-lg flex flex-col items-center justify-center bg-gray-50 min-h-[110px] active:bg-gray-100 transition-colors">
            <div className="text-xs font-medium text-gray-600 mb-1">
               {months} Bulan
            </div>
            <div className="flex-1 flex items-center justify-center w-full">
               <p className="text-sm font-bold text-red-500 leading-tight">
                  {result ? formatRupiahLocal(result.monthly) : "-"}
               </p>
            </div>

            <button
               type="button"
               aria-label={`Tampilkan rincian untuk ${months} bulan`}
               aria-expanded={isOpen}
               onClick={onToggle}
               className={`mt-1 p-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            >
               <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
               >
                  <path
                     strokeWidth={2.5}
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M19 9l-7 7-7-7"
                  />
               </svg>
            </button>
         </div>

         {hasPromo && (
            <div className="absolute flex items-center justify-center w-10 h-10 bg-red-500 border-2 border-white rounded-full shadow-lg -top-1.5 -right-1.5">
               <span className="text-[9px] font-bold text-white transform -rotate-12">
                  PROMO
               </span>
            </div>
         )}
      </div>
   );
}
