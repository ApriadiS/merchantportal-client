"use client";
import React, { createContext, useCallback, useContext, useState } from "react";

type Toast = {
   id: string;
   type: "success" | "error" | "info";
   message: string;
};

const ToastContext = createContext<{
   push: (t: Omit<Toast, "id">) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
   const [toasts, setToasts] = useState<Toast[]>([]);

   const push = useCallback((t: Omit<Toast, "id">) => {
      const id = String(Date.now()) + Math.random().toString(36).slice(2, 8);
      setToasts((s) => [...s, { id, ...t }]);
      setTimeout(() => {
         setToasts((s) => s.filter((x) => x.id !== id));
      }, 4000);
   }, []);

   return (
      <ToastContext.Provider value={{ push }}>
         {children}
         <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
            {toasts.map((t) => (
               <div
                  key={t.id}
                  className={`px-4 py-2 rounded shadow text-sm text-white ${
                     t.type === "success"
                        ? "bg-green-600"
                        : t.type === "error"
                        ? "bg-red-600"
                        : "bg-blue-600"
                  }`}
               >
                  {t.message}
               </div>
            ))}
         </div>
      </ToastContext.Provider>
   );
}

export function useToast() {
   const ctx = useContext(ToastContext);
   if (!ctx) throw new Error("useToast must be used within ToastProvider");
   return ctx;
}
