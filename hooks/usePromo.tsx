import { PromoObject } from "@/utils/interface";
import React, { createContext, useContext, useState, ReactNode } from "react";

const PromoContext = createContext<{
   value: PromoObject[];
   setValue: React.Dispatch<React.SetStateAction<PromoObject[]>>;
} | null>(null);

export const PromoProvider = ({
   children,
   initialValue,
}: {
   children: ReactNode;
   initialValue?: PromoObject[]; // Jadikan opsional
}) => {
   const [value, setValue] = useState<PromoObject[]>(initialValue || []);

   return (
      <PromoContext.Provider value={{ value, setValue }}>
         {children}
      </PromoContext.Provider>
   );
};

export const usePromo = () => {
   const context = useContext(PromoContext);
   if (!context) {
      throw new Error("usePromo must be used within a StoreProvider");
   }
   return context;
};
