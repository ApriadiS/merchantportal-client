import { useState, useCallback } from "react";
import { PromoTenor } from "@/types";
import { PromoResponse } from "@/utils/interface";
import useCurrency from "@/hooks/useCurrency";

type Result = {
   monthly: number;
   totalInterest: number;
   totalPayment: number;
};

const MONTHLY_RATE = 0.026;
const MAX_PRICE = 30_000_000;

export const useInstallmentCalculator = () => {
   const [n, dot, , setValue] = useCurrency(0);
   const [results, setResults] = useState<Record<number, Result>>({});
   const [expanded, setExpanded] = useState<number | null>(null);
   const [error, setError] = useState<string | null>(null);

   const calculateInstallments = useCallback((tenors: PromoTenor[], promoMap: Map<string, PromoResponse>, selectedPromoId: string | null) => {
      const selectedTenor = selectedPromoId
         ? tenors.find((t) => t.promo_id === selectedPromoId)
         : null;

      if (typeof n !== "number" || !Number.isFinite(n) || n <= 0) {
         setResults({});
         setExpanded(null);
         setError("Masukkan harga barang yang valid (lebih dari 0)");
         return;
      }

      if (n > MAX_PRICE) {
         setResults({});
         setExpanded(null);
         setError("Harga maksimum adalah Rp 30.000.000");
         return;
      }

      const uniqueTenors = Array.from(new Set(tenors.map(t => t.tenor)));
      const next: Record<number, Result> = {};

      for (const months of uniqueTenors) {
         const matchingTenor = selectedPromoId
            ? tenors.find(t => t.promo_id === selectedPromoId && t.tenor === months)
            : null;

         let principal = n;
         let rate = MONTHLY_RATE;
         let adminFee = 0;
         let discountAmount = 0;

         if (matchingTenor) {
            const promo = promoMap.get(matchingTenor.promo_id);
            rate = promo?.interest_rate ? promo.interest_rate / 100 : MONTHLY_RATE;
            
            // Admin: FIX (Rp) atau PERCENT (%)
            if (promo?.admin_promo_type === 'PERCENT') {
               adminFee = Math.ceil((n * matchingTenor.admin) / 100);
            } else {
               adminFee = matchingTenor.admin;
            }
            
            // Discount: FIX (Rp) atau PERCENT (%)
            if (matchingTenor.discount > 0) {
               if (promo?.discount_type === 'PERCENT') {
                  discountAmount = Math.ceil((n * matchingTenor.discount) / 100);
               } else {
                  discountAmount = matchingTenor.discount;
               }
               if (discountAmount > matchingTenor.max_discount) {
                  discountAmount = matchingTenor.max_discount;
               }
            }
         }

         principal = n + adminFee - discountAmount;

         let effectiveMonths = months;
         if (matchingTenor && matchingTenor.free_installment > 0) {
            effectiveMonths = months - matchingTenor.free_installment;
         }

         let monthly: number;
         let totalPayment: number;
         let totalInterest: number;

         if (rate === 0) {
            monthly = Math.ceil(principal / effectiveMonths);
            totalPayment = principal;
            totalInterest = 0;
         } else {
            const principalPerMonth = principal / effectiveMonths;
            const interestPerMonth = principal * rate;
            monthly = Math.ceil(principalPerMonth + interestPerMonth);
            totalPayment = monthly * effectiveMonths;
            totalInterest = totalPayment - principal;
         }

         next[months] = { monthly, totalInterest, totalPayment };
      }

      setResults(next);
      setExpanded(null);
   }, [n]);

   const handlePriceChange = useCallback((value: string) => {
      const digits = value.replace(/[^0-9]/g, "");
      const num = digits ? parseInt(digits, 10) : 0;
      
      if (num > MAX_PRICE) {
         setValue(MAX_PRICE);
         return;
      }
      
      if (error) setError(null);
      setValue(num);
   }, [error, setValue]);

   return {
      n,
      dot,
      results,
      expanded,
      error,
      MAX_PRICE,
      setExpanded,
      calculateInstallments,
      handlePriceChange,
   };
};
