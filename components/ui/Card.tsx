"use client";
import React from "react";

export default function Card({
   children,
   className = "",
}: {
   children: React.ReactNode;
   className?: string;
}) {
   return (
      <div className={`bg-white rounded-md shadow-sm p-4 ${className}`}>
         {children}
      </div>
   );
}

// shadcn-style subcomponents for structured Card usage
export function CardHeader({
   children,
   className = "",
}: {
   children: React.ReactNode;
   className?: string;
}) {
   return (
      <div className={`mb-4 flex items-center justify-between ${className}`}>
         {children}
      </div>
   );
}

export function CardTitle({
   children,
   className = "",
}: {
   children: React.ReactNode;
   className?: string;
}) {
   return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}

export function CardDescription({
   children,
   className = "",
}: {
   children: React.ReactNode;
   className?: string;
}) {
   return (
      <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
   );
}

export function CardContent({
   children,
   className = "",
}: {
   children: React.ReactNode;
   className?: string;
}) {
   return <div className={`${className}`}>{children}</div>;
}

export function CardFooter({
   children,
   className = "",
}: {
   children: React.ReactNode;
   className?: string;
}) {
   return (
      <div className={`mt-4 flex items-center justify-end ${className}`}>
         {children}
      </div>
   );
}
