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
         <aside className="hidden border-r lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 bg-gray-50">
            <div className="flex flex-col w-64 h-full px-4 py-6">
               <h2 className="mb-4 text-lg font-semibold">Admin</h2>
               <nav
                  aria-label="Admin navigation"
                  className="flex flex-col flex-1 gap-2"
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
                  className="px-3 py-2 mt-auto text-sm font-medium text-left text-red-600 rounded-md hover:bg-red-50"
               >
                  Logout
               </button>
            </div>
         </aside>

         {/* Mobile: bottom navigation */}
         <nav className="fixed bottom-0 left-0 right-0 grid items-center grid-cols-12 px-4 py-2 bg-white border-t lg:hidden">
            {navItems.map((item) => {
               const active = pathname === item.href;
               return (
                  <Link
                     key={item.href}
                     href={item.href}
                     className={
                        "flex flex-col items-center text-xs " +
                        (navItems.length === 3 ? "col-span-4" : "col-span-3") +
                        " " +
                        (active ? "text-black font-semibold" : "text-gray-500")
                     }
                  >
                     <span className="flex items-center justify-center w-6 h-6 grid-cols-12 mb-1 rounded-full bg-slate-200">
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
