import { ItemPromoProps } from "@/utils/interface";
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
      <div className="flex flex-col lg:flex-row p-4 border rounded-lg shadow-sm bg-red-200">
         <div className="p-2 bg-red-200 gap-2 flex flex-col lg:flex-none">
            <div className="flex flex-col">
               <span className="font-semibold text-lg text-red-800">
                  {data.title_promo}
               </span>
               {/* Min Tablet */}
               <span className="hidden sm:block font-light text-sm italic text-red-800">
                  {data.start_date_promo} - {data.end_date_promo}
               </span>
               {/* Mobile */}
               <span className="sm:hidden font-light text-sm italic text-red-800">
                  {data.start_date_promo} - {data.end_date_promo}
               </span>
            </div>
            <div className="hidden sm:flex flex-col">
               <h2 className="text-red-500">Store:</h2>
               <h1 className="text-red-700">
                  {dataStores && dataStores.length > 0
                     ? dataStores.join(", ")
                     : "No stores associated"}
               </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 text-sm sm:text-lg">
               <div className="flex sm:hidden flex-col">
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
                     {formatCurrencyNumber(data.min_transaction_promo)}
                  </h1>
               </div>
               <div className="flex flex-col">
                  <h2 className="text-red-500">Tenor</h2>
                  <h1 className="text-red-700">{data.tenor_promo} Bulan</h1>
               </div>
               <div className="flex flex-col">
                  <h2 className="text-red-500">Subsidi</h2>
                  <h1 className="text-red-700">{data.subsidi_promo}%</h1>
               </div>
               <div className="flex flex-col">
                  <h2 className="text-red-500">Admin</h2>
                  {data.admin_promo_type === "FIX" ? (
                     <h1 className="text-red-700">
                        {formatCurrencyNumber(data.admin_promo)}
                     </h1>
                  ) : (
                     <h1 className="text-red-700">{data.admin_promo}%</h1>
                  )}
               </div>
               <div className="flex flex-col">
                  <h2 className="text-red-500">Bunga</h2>
                  <h1 className="text-red-700">{data.interest_rate}% </h1>
               </div>
            </div>
         </div>
         <div className="flex flex-row w-full justify-center sm:justify-start lg:justify-end lg:items-center bg-red-200 gap-1 lg:shrink ">
            {buttons.map(({ label: key, onclick }, index) => (
               <button
                  key={`${key}-${index}`}
                  className="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-500 md:max-h-12"
                  onClick={() => onclick(data.voucher_code)}
               >
                  {key}
               </button>
            ))}
         </div>
      </div>
   );
}
