"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import DashboardIcon from "../icon/DashboardIcon";
import StoreIcon from "../icon/StoreIcon";
import PromoIcon from "../icon/PromoIcon";
import ImportIcon from "../icon/ImportIcon";
import { signOutClient } from "@services/auth";

export default function NavBar() {
   const pathname = usePathname() || "/admin-dashboard";
   const router = useRouter();

   const handleLogout = async () => {
      await signOutClient();
      router.push("/admin");
   };

   const navItems = [
      { label: "Dashboard", href: "/admin-dashboard" },
      { label: "Store", href: "/admin-dashboard/store" },
      { label: "Promo", href: "/admin-dashboard/promo" },
   ];

   return (
      <>
         {/* Desktop: left sidebar */}
         <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 border-r bg-gray-50">
            <div className="px-4 py-6 w-64 flex flex-col h-full">
               <h2 className="text-lg font-semibold mb-4">Admin</h2>
               <nav
                  aria-label="Admin navigation"
                  className="flex flex-col gap-2 flex-1"
               >
                  {navItems.map((item) => {
                     const active = pathname === item.href;
                     return (
                        <Link
                           key={item.href}
                           href={item.href}
                           className={
                              "px-3 py-2 rounded-md text-sm font-medium text-left " +
                              (active
                                 ? "bg-white text-black shadow"
                                 : "text-gray-600 hover:bg-white")
                           }
                        >
                           {item.label}
                        </Link>
                     );
                  })}
               </nav>
               <button
                  onClick={handleLogout}
                  className="mt-auto px-3 py-2 rounded-md text-sm font-medium text-left text-red-600 hover:bg-red-50"
               >
                  Logout
               </button>
            </div>
         </aside>

         {/* Mobile: bottom navigation */}
         <nav className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-4 flex items-center justify-around lg:hidden">
            {navItems.map((item) => {
               const active = pathname === item.href;
               return (
                  <Link
                     key={item.href}
                     href={item.href}
                     className={
                        "flex flex-col items-center text-xs " +
                        (active ? "text-black font-semibold" : "text-gray-500")
                     }
                  >
                     <span className="h-6 w-6 bg-slate-200 rounded-full mb-1 items-center justify-center flex">
                        {item.label === "Dashboard" ? (
                           <DashboardIcon />
                        ) : item.label === "Store" ? (
                           <StoreIcon />
                        ) : item.label === "Promo" ? (
                           <PromoIcon />
                        ) : item.label === "Insert Data" ? (
                           <ImportIcon />
                        ) : null}
                     </span>
                     {item.label}
                  </Link>
               );
            })}
         </nav>
      </>
   );
}
