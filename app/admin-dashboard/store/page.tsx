import React from "react";
import StoreClient from "./StoreClient";

export default function StorePage() {
   return (
      <div className="p-6">
         <div className="mb-4">
            <h2 className="text-xl font-semibold">Stores</h2>
            <h4 className="text-sm text-gray-600">Manage merchant store</h4>
         </div>
         <StoreClient />
      </div>
   );
}
