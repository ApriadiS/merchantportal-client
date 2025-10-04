import type { ItemType } from "@utils/types";
import ItemStore from "../Store/Item";
import ItemPromo from "../Promo/Item";
import { PromoObject, StoreObject } from "@/utils/interface";
import { useEffect } from "react";

interface CRUDComponentProps {
   type: ItemType;
   stores?: StoreObject[];
   promos?: PromoObject[];
   dataRelated?: Map<string, string[]>;
   buttons?: { label: string; onclick: (voucher_code?: string) => void }[];
}

export default function CRUDComponent({
   type,
   stores,
   promos,
   dataRelated,
   buttons,
}: CRUDComponentProps) {
   if (type == "store" && !stores) {
      throw new Error(
         "[CRUDComponentProps] Stores data is required for type 'store'"
      );
   }
   if (type == "promo" && !promos && !dataRelated) {
      throw new Error(
         "[CRUDComponentProps] Promos data is required for type 'promo'"
      );
   }

   useEffect(() => {
      console.log("Buttons in CRUDComponent:", buttons);
   }, [buttons]);

   const renderItem = () => {
      if (type === "store") {
         return (
            <>
               {stores?.map((store, index) => (
                  <ItemStore key={index} data={store} buttons={buttons || []} />
               ))}
            </>
         );
      } else {
         return (
            <>
               {promos?.map((promo, index) => (
                  <ItemPromo
                     key={index}
                     data={promo}
                     dataStores={dataRelated?.get(promo.title_promo) || []}
                     buttons={buttons || []}
                  />
               ))}
            </>
         );
      }
   };

   return (
      <div className="flex flex-col gap-4">
         <span className="font-bold text-2xl text-red-800">
            {type === "store" ? "Store" : "Promo"} Management
         </span>
         {/* Container */}
         <div className="p-4 border rounded-lg shadow-sm bg-white max-h-dvh overflow-y-auto flex flex-col gap-4">
            {/* Item */}
            {renderItem()}
         </div>
      </div>
   );
}
