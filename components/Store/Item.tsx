import { ItemStoreProps } from "@utils/interface";

export default function ItemStore({ data, buttons }: ItemStoreProps) {
   return (
      <div className="flex flex-col md:flex-row md:justify-between p-4 border rounded-lg shadow-sm bg-red-200">
         <div className="p-2 bg-red-200">
            <div className="flex flex-col">
               <span className="font-semibold text-lg text-red-800">
                  {data.name}
               </span>
               <span className="font-light text-md italic text-red-800">
                  {data.company}
               </span>
            </div>
            <div className="flex flex-col">
               <span className="text-gray-700">{data.address}</span>
               <span className="text-red-700">({data.route})</span>
            </div>
         </div>
         <div className="flex flex-row w-full justify-center md:justify-end md:items-center bg-red-200">
            {buttons.map(({ label: key, onclick }) => (
               <button
                  key={key}
                  className="ml-2 px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-500 md:max-h-12"
                  onClick={onclick}
               >
                  {key}
               </button>
            ))}
         </div>
      </div>
   );
}
