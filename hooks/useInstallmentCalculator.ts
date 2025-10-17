import { useState, useCallback } from "react";
import { PromoResponse } from "@/utils/interface";
import useCurrency from "@/hooks/useCurrency";

type Result = {
   monthly: number;
   totalInterest: number;
   totalPayment: number;
};

const TENORS = [6, 9, 12];
const MONTHLY_RATE = 0.026;
const MAX_PRICE = 30_000_000;

export const useInstallmentCalculator = () => {
   const [n, dot, , setValue] = useCurrency(0);
   const [results, setResults] = useState<Record<number, Result>>({});
   const [expanded, setExpanded] = useState<number | null>(null);
   const [error, setError] = useState<string | null>(null);
   const [selectedPromoId, setSelectedPromoId] = useState<number | null>(null);

   const calculateInstallments = useCallback((promos: PromoResponse[]) => {
      const selectedPromo =
         promos.find((p) => p.id_promo === selectedPromoId) || null;

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

      const next: Record<number, Result> = {};

      for (const months of TENORS) {
         let principal = n;
         let rate = MONTHLY_RATE;
         let adminFee = 0;
         let discountAmount = 0;

         if (selectedPromo && months === selectedPromo.tenor_promo) {
            rate = selectedPromo.interest_rate / 100;

            if (selectedPromo.admin_promo_type === "PERCENT") {
               adminFee = Math.round(n * (selectedPromo.admin_promo / 100));
            } else {
               adminFee = selectedPromo.admin_promo;
            }

            if (selectedPromo.discount) {
               if (selectedPromo.discount_type === "PERCENT") {
                  discountAmount = Math.round(
                     n * (selectedPromo.discount / 100)
                  );
                  if (
                     selectedPromo.max_discount &&
                     discountAmount > selectedPromo.max_discount
                  ) {
                     discountAmount = selectedPromo.max_discount;
                  }
               } else {
                  discountAmount = selectedPromo.discount;
               }
            }
         }

         principal = n + adminFee - discountAmount;

         // Adjust months for free installments
         let effectiveMonths = months;
         if (
            selectedPromo &&
            months === selectedPromo.tenor_promo &&
            selectedPromo.free_installment > 0
         ) {
            effectiveMonths = months - selectedPromo.free_installment;
         }

         const principalPerMonth = principal / effectiveMonths;
         const interestPerMonth = principal * rate;
         let monthly = Math.ceil(principalPerMonth + interestPerMonth);
         let totalPayment = monthly * effectiveMonths;
         let totalInterest = totalPayment - principal;

         if (rate === 0) {
            monthly = Math.ceil(principalPerMonth);
            totalPayment = principal;
            totalInterest = 0;
         }

         next[months] = { monthly, totalInterest, totalPayment };
      }

      setResults(next);
      setExpanded(null);
   }, [n, selectedPromoId]);

   const handlePriceChange = useCallback((value: string) => {
      const digits = value.replace(/[^0-9]/g, "");
      const num = digits ? parseInt(digits, 10) : 0;
      
      if (num > MAX_PRICE) {
         setValue(MAX_PRICE);
         return;
      }
      
      if (error) setError(null);
      setValue(num);
      setSelectedPromoId(null);
   }, [error, setValue]);

   return {
      n,
      dot,
      results,
      expanded,
      error,
      selectedPromoId,
      TENORS,
      MAX_PRICE,
      setExpanded,
      setSelectedPromoId,
      calculateInstallments,
      handlePriceChange,
   };
};
