import Image from "next/image";

export interface StoreIconProps {
   width?: number;
   height?: number;
}

export default function StoreIcon({ width, height }: StoreIconProps) {
   return (
      <Image
         src="/icons/store-icon.svg"
         alt="Store Icon"
         width={width || 16}
         height={height || 16}
      />
   );
}
