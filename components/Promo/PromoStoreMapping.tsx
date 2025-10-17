import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { StoreResponse } from "@/utils/interface";

interface PromoStoreMappingProps {
   assignedMappings: { id: number; store: StoreResponse }[];
   availableStoresToAdd: StoreResponse[];
   selectedStoreToAdd: string;
   setSelectedStoreToAdd: (value: string) => void;
   mappingLoading: boolean;
   mappingError: string | null;
   addStoreToPromo: (storeId: number) => Promise<void>;
   removeMapping: (mappingId: number) => Promise<void>;
}

export default function PromoStoreMapping({
   assignedMappings,
   availableStoresToAdd,
   selectedStoreToAdd,
   setSelectedStoreToAdd,
   mappingLoading,
   mappingError,
   addStoreToPromo,
   removeMapping,
}: PromoStoreMappingProps) {
   return (
      <div className="mt-3">
         <h4 className="text-sm font-medium">Assigned Stores</h4>
         
         {mappingLoading && <p className="text-sm">Loading stores...</p>}
         {mappingError && <p className="text-sm text-red-500">{mappingError}</p>}

         {assignedMappings.length === 0 && !mappingLoading ? (
            <p className="text-sm text-muted-foreground">
               Tidak ada store yang ditugaskan
            </p>
         ) : (
            <ul className="mt-2 space-y-2">
               {assignedMappings.map((m) => (
                  <li key={m.id} className="flex items-center justify-between">
                     <div className="min-w-0">
                        <div className="font-medium truncate">{m.store.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                           {m.store.company}
                        </div>
                     </div>
                     <div>
                        <Button
                           type="button"
                           variant="destructive"
                           size="sm"
                           onClick={() => removeMapping(m.id)}
                           disabled={mappingLoading}
                        >
                           Remove
                        </Button>
                     </div>
                  </li>
               ))}
            </ul>
         )}

         <div className="mt-3 flex gap-1 items-center">
            <div className="flex-1 min-w-0">
               <Select
                  value={selectedStoreToAdd}
                  onValueChange={(v) => setSelectedStoreToAdd(v)}
               >
                  <SelectTrigger className="w-full">
                     <SelectValue placeholder="Pilih store..." />
                  </SelectTrigger>
                  <SelectContent>
                     {availableStoresToAdd.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                           {s.name} — {s.company}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
            <div className="flex-shrink-0">
               <Button
                  type="button"
                  onClick={() =>
                     selectedStoreToAdd !== "" &&
                     addStoreToPromo(Number(selectedStoreToAdd))
                  }
                  disabled={mappingLoading || selectedStoreToAdd === ""}
               >
                  Tambah
               </Button>
            </div>
         </div>
      </div>
   );
}