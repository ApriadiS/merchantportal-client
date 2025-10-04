import Image from "next/image";

export interface ImportIconProps {
   width?: number;
   height?: number;
}

export default function ImportIcon({ width, height }: ImportIconProps) {
   return (
      <Image
         src="/icons/import-icon.svg"
         alt="Import Icon"
         className="opacity-70"
         width={width || 16}
         height={height || 16}
      />
   );
}
