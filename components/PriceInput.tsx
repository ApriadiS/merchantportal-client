import { memo } from "react";

interface PriceInputProps {
   dot: string;
   onPriceChange: (value: string) => void;
}

function PriceInput({ dot, onPriceChange }: PriceInputProps) {
   return (
      <div className="p-3 bg-red-100 rounded-xl">
         <label
            htmlFor="price"
            className="block mb-2 text-sm font-medium text-gray-700"
         >
            Harga Barang
         </label>

         <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base text-gray-500 pointer-events-none">
               Rp
            </span>
            <input
               id="price"
               name="price"
               type="text"
               inputMode="numeric"
               placeholder="0"
               className="w-full py-3.5 pr-4 pl-10 text-base text-white placeholder-gray-400 bg-gray-900 border-0 rounded-lg focus:ring-2 focus:ring-red-500"
               aria-label="Harga Barang"
               required
               value={dot}
               onChange={(e) => onPriceChange(e.target.value)}
            />
         </div>
      </div>
   );
}

export default memo(PriceInput);
