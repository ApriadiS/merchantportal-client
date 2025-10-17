import { useCallback, useRef, useState } from "react";

export interface ToastOptions {
   type?: "success" | "error" | "info";
   message: string;
   duration?: number; // ms
}

export interface Toast {
   id: number;
   type: "success" | "error" | "info";
   message: string;
   open: boolean;
}

export function useToast() {
   const [toasts, setToasts] = useState<Toast[]>([]);
   const idRef = useRef(0);

   const push = useCallback((opts: ToastOptions) => {
      idRef.current += 1;
      const toast: Toast = {
         id: idRef.current,
         type: opts.type || "info",
         message: opts.message,
         open: true,
      };
      setToasts((prev) => [toast, ...prev]);
      setTimeout(() => {
         setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, opts.duration || 3000);
   }, []);

   const dismiss = useCallback((id: number) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
   }, []);

   return { toasts, push, dismiss };
}
