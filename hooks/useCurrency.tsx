"use client";
import { useCallback, useState, useMemo } from "react";

type SetValue = (value: string | number | ((prev: number) => number)) => void;

function normalizeToNumber(
   value?: number | string | ((prev: number) => number),
   prev = 0
): number {
   if (typeof value === "function") {
      try {
         return value(prev);
      } catch {
         return prev;
      }
   }

   if (value === undefined || value === null) return prev;

   if (typeof value === "number") {
      if (Number.isFinite(value)) return Math.trunc(value);
      return prev;
   }

   // string: remove non-digit characters (keep minus if present at start)
   const s = String(value).trim();
   // allow leading minus
   const negative = s.startsWith("-");
   const digits = s.replace(/[^0-9]/g, "");
   if (!digits) return 0;

   const MAX_INT = 2147483647;
   let num = parseInt(digits, 10);

   if (num > MAX_INT) {
      num = MAX_INT;
   }

   return negative ? -num : num;
}

/**
 * Formats a number with dot as a thousand separator.
 * Example: 1000 -> "1.000"
 */
function formatWithDot(amount: number): string {
   const sign = amount < 0 ? "-" : "";
   const abs = Math.abs(Math.trunc(amount || 0));
   // Use Intl to format with Indonesian grouping (dot) and no decimal places
   const formatted = abs.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
   });
   return `${sign}${formatted}`;
}

/**
 * Formats a number into Rupiah currency string.
 * Example: 1000 -> "Rp. 1.000"
 */
function formatRupiah(amount: number): string {
   // Use a space after the currency symbol and Indonesian grouping
   // Examples: 1000 -> "Rp 1.000", -5000 -> "-Rp 5.000"
   const sign = amount < 0 ? "-" : "";
   const abs = Math.abs(Math.trunc(amount || 0));
   const formatted = abs.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
   });
   return `${sign}Rp ${formatted}`;
}

/**
 * useCurrency hook
 * Returns [normalNumber, withDot, formattedCurrency, setValue]
 * - normalNumber: number (integer) suitable for calculations
 * - withDot: string like "1.000"
 * - formattedCurrency: string like "Rp. 1.000"
 * - setValue: setter that accepts number or (prev:number)=>number
 *
 * Example:
 * const [normal, withDot, currency, setValue] = useCurrency(1000)
 */
export default function useCurrency(initial?: number | string) {
   const [normal, setNormal] = useState<number>(() => normalizeToNumber(initial, 0));
   
   const withDot = useMemo(() => formatWithDot(normal), [normal]);
   const currency = useMemo(() => formatRupiah(normal), [normal]);

   const setValue: SetValue = useCallback((val) => {
      if (typeof val === "string") {
         // For string input, parse directly without normalization
         const digits = val.replace(/[^0-9]/g, "");
         const num = digits ? parseInt(digits, 10) : 0;
         setNormal(num);
      } else {
         setNormal((prev) => normalizeToNumber(val, prev));
      }
   }, []);

   return [normal, withDot, currency, setValue] as const;
}
