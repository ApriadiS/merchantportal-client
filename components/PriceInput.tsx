import { memo } from "react";

interface PriceInputProps {
   dot: string;
   onPriceChange: (value: string) => void;
}

function PriceInput({ dot, onPriceChange }: PriceInputProps) {
   return (
      <div className="p-4 space-y-3 bg-red-100 rounded-xl">
         <div>
            <label
               htmlFor="price"
               className="block mb-2 text-sm font-medium text-gray-700"
            >
               Harga Barang
            </label>

            <div className="relative">
               <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
                  Rp
               </span>
               <input
                  id="price"
                  name="price"
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  className="w-full py-3 pr-4 text-white placeholder-gray-400 transition bg-gray-900 border border-gray-200 rounded-lg pl-9 focus:ring-2 focus-accent focus:border-transparent"
                  aria-label="Harga Barang"
                  required
                  value={dot}
                  onChange={(e) => onPriceChange(e.target.value)}
               />
            </div>
         </div>
      </div>
   );
}

export default memo(PriceInput);
