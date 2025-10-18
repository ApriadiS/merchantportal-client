import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface PromoTenorFormProps {
  tenor: number;
  setTenor: (value: number) => void;
  minTransaction: string;
  setMinTransaction: (value: string) => void;
  subsidi: string;
  setSubsidi: (value: string) => void;
  admin: string;
  setAdmin: (value: string) => void;
  discount: string;
  setDiscount: (value: string) => void;
  maxDiscount: string;
  setMaxDiscount: (value: string) => void;
  voucherCode: string;
  setVoucherCode: (value: string) => void;
  freeInstallment: number;
  setFreeInstallment: (value: number) => void;
  isAvailable: boolean;
  setIsAvailable: (value: boolean) => void;
  errors?: Record<string, string>;
}

export default function PromoTenorForm({
  tenor, setTenor,
  minTransaction, setMinTransaction,
  subsidi, setSubsidi,
  admin, setAdmin,
  discount, setDiscount,
  maxDiscount, setMaxDiscount,
  voucherCode, setVoucherCode,
  freeInstallment, setFreeInstallment,
  isAvailable, setIsAvailable,
  errors = {},
}: PromoTenorFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label>Tenor (bulan)</Label>
        <RadioGroup
          value={String(tenor)}
          onValueChange={(v) => setTenor(Number(v))}
        >
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="6" id="tenor-6" />
              <Label htmlFor="tenor-6" className="cursor-pointer">6 Bulan</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="9" id="tenor-9" />
              <Label htmlFor="tenor-9" className="cursor-pointer">9 Bulan</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="12" id="tenor-12" />
              <Label htmlFor="tenor-12" className="cursor-pointer">12 Bulan</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="minTransaction">Min Transaction</Label>
        <Input
          id="minTransaction"
          value={minTransaction}
          onChange={(e) => setMinTransaction(e.target.value)}
          placeholder="Rp 1.000.000"
        />
        {errors.minTransaction && (
          <p className="text-sm text-red-500 mt-1">{errors.minTransaction}</p>
        )}
      </div>

      <div>
        <Label htmlFor="subsidi">Subsidi</Label>
        <Input
          id="subsidi"
          value={subsidi}
          onChange={(e) => setSubsidi(e.target.value)}
          placeholder="Rp 50.000"
        />
      </div>

      <div>
        <Label htmlFor="admin">Admin Fee</Label>
        <Input
          id="admin"
          value={admin}
          onChange={(e) => setAdmin(e.target.value)}
          placeholder="Rp 0"
        />
      </div>

      <div>
        <Label htmlFor="discount">Discount (%)</Label>
        <Input
          id="discount"
          type="number"
          step="0.01"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          placeholder="5.5"
        />
      </div>

      <div>
        <Label htmlFor="maxDiscount">Max Discount</Label>
        <Input
          id="maxDiscount"
          value={maxDiscount}
          onChange={(e) => setMaxDiscount(e.target.value)}
          placeholder="Rp 100.000"
        />
      </div>

      <div>
        <Label htmlFor="voucherCode">Voucher Code (Optional)</Label>
        <Input
          id="voucherCode"
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value)}
          placeholder="PROMO12"
        />
      </div>

      <div>
        <Label>Free Installment</Label>
        <RadioGroup
          value={String(freeInstallment)}
          onValueChange={(v) => setFreeInstallment(Number(v))}
        >
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="0" id="free-0" />
              <Label htmlFor="free-0" className="cursor-pointer">Tanpa Gratis</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="1" id="free-1" />
              <Label htmlFor="free-1" className="cursor-pointer">Gratis 1x</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="2" id="free-2" />
              <Label htmlFor="free-2" className="cursor-pointer">Gratis 2x</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="3" id="free-3" />
              <Label htmlFor="free-3" className="cursor-pointer">Gratis 3x</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="isAvailable"
          checked={isAvailable}
          onCheckedChange={(checked) => setIsAvailable(Boolean(checked))}
        />
        <Label htmlFor="isAvailable" className="cursor-pointer">
          Available
        </Label>
      </div>
    </div>
  );
}
