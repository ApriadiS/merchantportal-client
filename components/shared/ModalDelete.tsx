import React from "react";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ModalDeleteProps {
   title: string;
   description?: React.ReactNode;
   onClose: () => void;
   // primary and secondary actions
   primary?: { label: string; onClick: () => void };
   secondary?: { label: string; onClick: () => void };
   // legacy props (backwards compatibility)
   buttons?: {
      label: string;
      bgColor?: string;
      textColor?: string;
      bgColorHover?: string;
      textColorHover?: string;
      onclick: () => void;
   }[];
   data?: React.ReactNode[];
   // render inline (no portal/overlay). Useful when caller already provides overlay.
   inline?: boolean;
}

export default function ModalDelete({
   title,
   description,
   onClose,
   primary,
   secondary,
   buttons,
   data,
   inline = false,
}: ModalDeleteProps) {
   const content = (
      <div className="w-full max-w-md md:max-w-lg rounded-lg p-6 bg-card">
         {inline ? (
            <div className="mb-2">
               <h3 className="text-lg md:text-xl font-semibold">{title}</h3>
            </div>
         ) : (
            <DialogHeader>
               <DialogTitle className="text-lg md:text-xl">{title}</DialogTitle>
            </DialogHeader>
         )}

         <div className="py-4">
            <div className="text-sm text-muted-foreground">{description}</div>
            {data && data.length > 0 && (
               <div className="mt-3 space-y-2">
                  {data.map((item, idx) => (
                     <div key={idx} className="text-sm">
                        {item}
                     </div>
                  ))}
               </div>
            )}
         </div>

         <DialogFooter>
            <div className="w-full flex flex-col sm:flex-row gap-3 sm:justify-end">
               {/* Legacy buttons support: if `buttons` provided, render them in order */}
               {buttons && buttons.length > 0 ? (
                  buttons.map((b) => (
                     <button
                        key={b.label}
                        onClick={b.onclick}
                        className={`px-4 py-2 rounded-md ${
                           b.bgColor ?? "bg-muted"
                        } ${b.textColor ?? "text-muted-foreground"} hover:${
                           b.bgColorHover ?? "bg-muted/90"
                        } hover:${b.textColorHover ?? "text-muted-foreground"}`}
                     >
                        {b.label}
                     </button>
                  ))
               ) : (
                  <>
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={secondary?.onClick ?? onClose}
                     >
                        {secondary?.label ?? "Batal"}
                     </Button>
                     <Button
                        variant="destructive"
                        size="sm"
                        onClick={primary?.onClick}
                     >
                        {primary?.label ?? "Hapus"}
                     </Button>
                  </>
               )}
            </div>
         </DialogFooter>
      </div>
   );

   if (inline) {
      return content;
   }

   return (
      <Dialog open onOpenChange={(open) => !open && onClose()}>
         <DialogContent className="w-full max-w-md md:max-w-lg rounded-lg p-0">
            {content}
         </DialogContent>
      </Dialog>
   );
}
