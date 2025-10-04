interface LoadingProps {
   size?: number; // Size of the loading spinner in pixels
   color?: string; // Color of the spinner (CSS color value)
   label?: string; // Optional label below the spinner
   speed?: number; // Speed multiplier for the spin animation (default is 1)
}

export default function Loading({
   size = 40,
   color = "red",
   speed = 1,
   label = "Memuat data...",
}: LoadingProps) {
   return (
      <div className="flex flex-col justify-center items-center h-full min-h-[100px]">
         <div
            className="rounded-full"
            style={{
               width: size,
               height: size,
               borderWidth: 4,
               borderColor: color,
               borderTopColor: "lightpink",
               animation: `spin ${1 / speed}s linear infinite`,
            }}
         />
         {label && <span className="mt-2 text-sm text-gray-600">{label}</span>}
         <style>
            {`
           @keyframes spin {
            to { transform: rotate(360deg); }
           }
        `}
         </style>
      </div>
   );
}
