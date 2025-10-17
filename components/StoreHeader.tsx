import Image from "next/image";
import { memo } from "react";
import { StoreResponse } from "@/utils/interface";

interface StoreHeaderProps {
   store: StoreResponse | null;
}

function StoreHeader({ store }: StoreHeaderProps) {
   return (
      <header className="text-center">
         <Image
            src="/akulakupaylater-logo.png"
            alt="Akulaku"
            width={200}
            height={200}
            className="mx-auto"
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rj9v/2Q=="
         />
         <p className="mt-3 text-black text-md">
            {store
               ? `${store.name} (${store.store_type})`
               : "Hitung cicilan kredit barangmu dengan mudah"}
         </p>
         {store?.company && (
            <p className="text-sm text-gray-600">{store.company}</p>
         )}
      </header>
   );
}

export default memo(StoreHeader);