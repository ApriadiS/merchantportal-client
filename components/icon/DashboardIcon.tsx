import Image from "next/image";

export interface DashboardIconProps {
   width?: number;
   height?: number;
}

export default function DashboardIcon({ width, height }: DashboardIconProps) {
   return (
      <Image
         src="/icons/dashboard-icon.svg"
         alt="Dashboard Icon"
         width={width || 16}
         height={height || 16}
      />
   );
}
