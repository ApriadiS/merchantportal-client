import Link from "next/link";

export default function AdminDashboardPage() {
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="p-6 border rounded-lg">
            <h2 className="text-lg font-semibold">Promo</h2>
            <p className="text-sm text-muted-foreground mt-2">
               Manage promotional vouchers.
            </p>
            <div className="mt-4">
               <Link
                  href="/admin-dashboard/promo"
                  className="px-3 py-2 bg-blue-600 text-white rounded"
               >
                  Open Promos
               </Link>
            </div>
         </div>

         <div className="p-6 border rounded-lg">
            <h2 className="text-lg font-semibold">Store</h2>
            <p className="text-sm text-muted-foreground mt-2">
               Manage merchant stores.
            </p>
            <div className="mt-4">
               <Link
                  href="/admin-dashboard/store"
                  className="px-3 py-2 bg-blue-600 text-white rounded"
               >
                  Open Stores
               </Link>
            </div>
         </div>
      </div>
   );
}
