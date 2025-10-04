import React from "react";
import PromoClient from "./PromoClient";

export default function PromoPage() {
   return (
      <div className="p-6">
         <div className="mb-4">
            <h2 className="text-xl font-semibold">Promos</h2>
            <h4 className="text-sm text-gray-600">Manage promo and vouchers</h4>
         </div>
         <PromoClient />
      </div>
   );
}
