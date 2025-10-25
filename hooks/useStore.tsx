import type { Store } from "@/utils/interface";

type StoreObject = Store;
import React, { createContext, useContext, useState, ReactNode } from "react";

const StoreContext = createContext<{
   value: StoreObject[];
   setValue: React.Dispatch<React.SetStateAction<StoreObject[]>>;
} | null>(null);

export const StoreProvider = ({
   children,
   initialValue,
}: {
   children: ReactNode;
   initialValue?: StoreObject[]; // Jadikan opsional
}) => {
   const [value, setValue] = useState<StoreObject[]>(initialValue || []);

   return (
      <StoreContext.Provider value={{ value, setValue }}>
         {children}
      </StoreContext.Provider>
   );
};

export const useStore = () => {
   const context = useContext(StoreContext);
   if (!context) {
      throw new Error("useStore must be used within a StoreProvider");
   }
   return context;
};
