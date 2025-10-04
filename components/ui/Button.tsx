"use client";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   variant?: "default" | "destructive" | "outline";
}

export default function Button({
   children,
   variant = "default",
   className = "",
   ...rest
}: ButtonProps) {
   const base = "px-3 py-1.5 rounded-md text-sm inline-flex items-center";
   const variantClass =
      variant === "destructive"
         ? "bg-red-500 text-white hover:bg-red-600"
         : variant === "outline"
         ? "border border-gray-200 text-gray-700 hover:bg-gray-50"
         : "bg-blue-600 text-white hover:bg-blue-700";

   return (
      <button className={`${base} ${variantClass} ${className}`} {...rest}>
         {children}
      </button>
   );
}
