import React from "react";
import NavBar from "@components/AdminDashboard/NavBar";
import AuthGuard from "@components/Auth/AuthGuard";

export const metadata = {
   title: "Admin Dashboard",
};

export default function AdminDashboardLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <AuthGuard>
         <div className="min-h-screen bg-white">
            <NavBar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:pl-72 pb-20">
               {children}
            </main>
         </div>
      </AuthGuard>
   );
}
