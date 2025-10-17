import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPercent } from "@/utils/format";

interface PromoFormFieldsProps {
   title: string;
   setTitle: (value: string) => void;
   voucher: string;
   setVoucher: (value: string) => void;
   minCurrency: string;
   setMin: (value: string) => void;
   tenor: string;
   setTenor: (value: string) => void;
   subsidiPercent: number | "";
   setSubsidiPercent: (value: number | "") => void;
   adminValue: number | "";
   setAdminValue: (value: number | "") => void;
   adminType: string;
   setAdminType: (value: string) => void;
   interest: number | "";
   setInterest: (value: number | "") => void;
   startDate: string;
   setStartDate: (value: string) => void;
   endDate: string;
   setEndDate: (value: string) => void;
   freeInstallment: number | "";
   setFreeInstallment: (value: number | "") => void;
   isActive: boolean;
   setIsActive: (value: boolean) => void;
   discount: number | "";
   setDiscount: (value: number | "") => void;
   discountType: string;
   setDiscountType: (value: string) => void;
   maxDiscount: number | "";
   setMaxDiscount: (value: number | "") => void;
   errors: Record<string, string>;
   parseCurrencyInput: (s: string) => number;
}

export default function PromoFormFields({
   title, setTitle,
   voucher, setVoucher,
   minCurrency, setMin,
   tenor, setTenor,
   subsidiPercent, setSubsidiPercent,
   adminValue, setAdminValue,
   adminType, setAdminType,
   interest, setInterest,
   startDate, setStartDate,
   endDate, setEndDate,
   freeInstallment, setFreeInstallment,
   isActive, setIsActive,
   discount, setDiscount,
   discountType, setDiscountType,
   maxDiscount, setMaxDiscount,
   errors,
   parseCurrencyInput,
}: PromoFormFieldsProps) {
   return (
      <div className="flex flex-col min-w-0 gap-2">
         <Label className="text-sm">Title</Label>
         <Input value={title} onChange={(e) => setTitle(e.target.value)} />
         {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}

         <Label className="text-sm">Voucher Code</Label>
         <Input value={voucher} onChange={(e) => setVoucher(e.target.value)} />

         <Label className="text-sm">Min Transaction</Label>
         <Input
            type="text"
            value={minCurrency}
            onChange={(e) => setMin(e.target.value)}
         />
         {errors.minTx && <p className="text-sm text-red-500">{errors.minTx}</p>}

         <Label className="text-sm">Tenor (bulan)</Label>
         <RadioGroup
            value={tenor}
            onValueChange={(v) => setTenor(String(v))}
            aria-label="Tenor (bulan)"
         >
            <div className="flex gap-3 mt-2">
               <Label className="inline-flex items-center gap-2">
                  <RadioGroupItem value="6" />
                  <span className="text-sm font-normal">6 Bulan</span>
               </Label>
               <Label className="inline-flex items-center gap-2">
                  <RadioGroupItem value="9" />
                  <span className="text-sm font-normal">9 Bulan</span>
               </Label>
               <Label className="inline-flex items-center gap-2">
                  <RadioGroupItem value="12" />
                  <span className="text-sm font-normal">12 Bulan</span>
               </Label>
            </div>
         </RadioGroup>

         <Label className="text-sm">Subsidi (%)</Label>
         <div className="flex items-center gap-2">
            <Input
               type="text"
               value={subsidiPercent}
               onChange={(e) => {
                  const val = e.target.value;
                  // Only allow numbers and empty string
                  if (val === "" || /^\d+$/.test(val)) {
                     setSubsidiPercent(val === "" ? "" : parseInt(val, 10));
                  }
               }}
            />
            <Label className="text-xl font-medium">%</Label>
         </div>

         <Label className="text-sm">Admin</Label>
         <Input
            type="text"
            value={
               adminType.toLowerCase() === "percent"
                  ? formatPercent(Number(adminValue ?? 0), 2)
                  : "Rp " + (Number(adminValue ?? 0) || 0).toLocaleString("id-ID")
            }
            onChange={(e) => {
               const val = parseCurrencyInput(e.target.value);
               setAdminValue(val === 0 && e.target.value === "" ? "" : val);
            }}
         />

         <Label className="text-sm">Tipe Admin</Label>
         <RadioGroup
            value={adminType}
            onValueChange={(v) => setAdminType(String(v).toUpperCase())}
            aria-label="Tipe Admin"
         >
            <div className="flex gap-3 mt-2">
               <Label className="inline-flex items-center gap-2">
                  <RadioGroupItem value="FIX" />
                  <span className="text-sm font-normal">FIX</span>
               </Label>
               <Label className="inline-flex items-center gap-2">
                  <RadioGroupItem value="PERCENT" />
                  <span className="text-sm font-normal">PERCENT</span>
               </Label>
            </div>
         </RadioGroup>

         <Label className="text-sm">Interest Rate (%)</Label>
         <Input
            type="number"
            step="0.01"
            value={interest}
            onChange={(e) => {
               const val = e.target.value;
               setInterest(val === "" ? "" : Number(val));
            }}
         />

         <Label className="text-sm">Free Installment</Label>
         <RadioGroup
            value={String(freeInstallment)}
            onValueChange={(v) => setFreeInstallment(Number(v))}
            className="flex flex-row gap-4 mt-1"
         >
            <div className="flex items-center space-x-2">
               <RadioGroupItem value="0" id="free-0" />
               <Label htmlFor="free-0" className="text-sm">Tanpa Gratis</Label>
            </div>
            <div className="flex items-center space-x-2">
               <RadioGroupItem value="1" id="free-1" />
               <Label htmlFor="free-1" className="text-sm">Gratis 1x</Label>
            </div>
            <div className="flex items-center space-x-2">
               <RadioGroupItem value="2" id="free-2" />
               <Label htmlFor="free-2" className="text-sm">Gratis 2x</Label>
            </div>
         </RadioGroup>

         <Label className="text-sm">Start Date</Label>
         <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
         />

         <Label className="text-sm">End Date</Label>
         <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
         />

         <Label className="text-sm">Discount</Label>
         <Input
            type="text"
            value={
               discountType.toLowerCase() === "percent"
                  ? formatPercent(Number(discount ?? 0), 2)
                  : "Rp " + (Number(discount ?? 0) || 0).toLocaleString("id-ID")
            }
            onChange={(e) => {
               const val = parseCurrencyInput(e.target.value);
               setDiscount(val === 0 && e.target.value === "" ? "" : val);
            }}
         />

         <Label className="text-sm">Tipe Discount</Label>
         <RadioGroup
            value={discountType}
            onValueChange={(v) => setDiscountType(String(v).toUpperCase())}
            aria-label="Tipe Discount"
         >
            <div className="flex gap-3 mt-2">
               <Label className="inline-flex items-center gap-2">
                  <RadioGroupItem value="FIX" />
                  <span className="text-sm font-normal">FIX</span>
               </Label>
               <Label className="inline-flex items-center gap-2">
                  <RadioGroupItem value="PERCENT" />
                  <span className="text-sm font-normal">PERCENT</span>
               </Label>
            </div>
         </RadioGroup>

         {discountType === "PERCENT" && (
            <>
               <Label className="text-sm">Max Discount</Label>
               <Input
                  type="text"
                  value={"Rp " + (Number(maxDiscount ?? 0) || 0).toLocaleString("id-ID")}
                  onChange={(e) => {
                     const val = parseCurrencyInput(e.target.value);
                     setMaxDiscount(val === 0 && e.target.value === "" ? "" : val);
                  }}
               />
            </>
         )}

         <div className="flex items-center gap-2">
            <Checkbox
               id="promo-active"
               checked={isActive}
               onCheckedChange={(v) => setIsActive(Boolean(v))}
            />
            <Label htmlFor="promo-active" className="text-sm">Active</Label>
         </div>
      </div>
   );
}