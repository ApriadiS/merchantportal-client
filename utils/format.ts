export function formatCurrency(value: number | null | undefined) {
   if (value === null || value === undefined) return "Rp. 0";
   // Ensure integer formatting with thousands separator and no decimals
   const intVal = Math.round(Number(value));
   return "Rp. " + intVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatPercent(value: number | null | undefined, decimals = 2) {
   if (value === null || value === undefined) return "0%";
   // Keep decimals if present, trim unnecessary zeros
   const num = Number(value);
   return num.toFixed(decimals).replace(/\.0+$/, "") + "%";
}

export function formatAdmin(
   adminValue: number | null | undefined,
   adminType?: string
) {
   if (adminType?.toLowerCase() === "percent") {
      return formatPercent(adminValue ?? 0, 2);
   }
   return formatCurrency(adminValue ?? 0);
}
