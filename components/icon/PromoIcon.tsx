import Image from "next/image";

export interface PromoIconProps {
   width?: number;
   height?: number;
}

export default function PromoIcon({ width, height }: PromoIconProps) {
   return (
      <Image
         src="/icons/promo-icon.svg"
         alt="Promo Icon"
         className="opacity-60"
         width={width || 16}
         height={height || 16}
      />
   );
}
