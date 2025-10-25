import type { PromoTenor } from "@/utils/interface";

interface ItemPromoProps {
   data: PromoTenor & {
      title_promo?: string;
      start_date_promo?: string;
      end_date_promo?: string;
      admin_promo_type?: string;
      interest_rate?: number;
   };
   dataStores?: string[];
   buttons: Array<{ label: string; onclick: (code: string) => void }>;
}
import { useEffect } from "react";

export default function ItemPromo({
   data,
   dataStores,
   buttons,
}: ItemPromoProps) {
   const formatCurrencyNumber = (value: number) => {
      return isNaN(value) ? "Rp. 0" : `Rp. ${value.toLocaleString("id-ID")}`;
   };

   useEffect(() => {
      // console.log("Buttons in ItemPromo:", buttons);
   }, [buttons]);

   return (
      <div className="flex flex-col p-4 bg-red-200 border rounded-lg shadow-sm lg:flex-row">
         <div className="flex flex-col gap-2 p-2 bg-red-200 lg:flex-none">
            <div className="flex flex-col">
               <span className="text-lg font-semibold text-red-800">
                  {data.title_promo}
               </span>
               {/* Min Tablet */}
               <span className="hidden text-sm italic font-light text-red-800 sm:block">
                  {data.start_date_promo} - {data.end_date_promo}
               </span>
               {/* Mobile */}
               <span className="text-sm italic font-light text-red-800 sm:hidden">
                  {data.start_date_promo} - {data.end_date_promo}
               </span>
            </div>
            <div className="flex-col hidden sm:flex">
               <h2 className="text-red-500">Store:</h2>
               <h1 className="text-red-700">
                  {dataStores && dataStores.length > 0
                     ? dataStores.join(", ")
                     : "No stores associated"}
               </h1>
            </div>
            <div className="flex flex-col gap-4 text-sm sm:flex-row sm:text-lg">
               <div className="flex flex-col sm:hidden">
                  <h2 className="text-red-500">Store</h2>
                  <h1 className="text-red-700">
                     {dataStores && dataStores.length > 0
                        ? dataStores.join(", ")
                        : "No stores associated"}
                  </h1>
               </div>
               <div className="flex flex-col">
                  <h2 className="text-red-500">Minimum</h2>
                  <h1 className="text-red-700">
                     {formatCurrencyNumber(data.min_transaction)}
                  </h1>
               </div>
               <div className="flex flex-col">
                  <h2 className="text-red-500">Tenor</h2>
                  <h1 className="text-red-700">{data.tenor} Bulan</h1>
               </div>
               <div className="flex flex-col">
                  <h2 className="text-red-500">Subsidi</h2>
                  <h1 className="text-red-700">{data.subsidi}%</h1>
               </div>
               <div className="flex flex-col">
                  <h2 className="text-red-500">Admin</h2>
                  {data.admin_promo_type === "FIX" ? (
                     <h1 className="text-red-700">
                        {formatCurrencyNumber(data.admin)}
                     </h1>
                  ) : (
                     <h1 className="text-red-700">{data.admin}%</h1>
                  )}
               </div>
               <div className="flex flex-col">
                  <h2 className="text-red-500">Bunga</h2>
                  <h1 className="text-red-700">{data.interest_rate}% </h1>
               </div>
            </div>
         </div>
         <div className="flex flex-row justify-center w-full gap-1 bg-red-200 sm:justify-start lg:justify-end lg:items-center lg:shrink ">
            {buttons.map(({ label: key, onclick }, index) => (
               <button
                  key={`${key}-${index}`}
                  className="px-4 py-2 text-white bg-red-400 rounded-md hover:bg-red-500 md:max-h-12"
                  onClick={() => onclick(data.voucher_code || "")}
               >
                  {key}
               </button>
            ))}
         </div>
      </div>
   );
}
