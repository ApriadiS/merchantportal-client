"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import type { PromoResponse } from "@/utils/interface";
import { usePromoForm } from "@/hooks/usePromoForm";
import PromoFormFields from "./PromoFormFields";
import PromoStoreMapping from "./PromoStoreMapping";

interface Props {
   open: boolean;
   onClose: () => void;
   onCreated?: (p: PromoResponse) => void;
   onUpdated?: (p: PromoResponse) => void;
   initial?: PromoResponse | null;
}

export default function PromoFormModal({
   open,
   onClose,
   onCreated,
   onUpdated,
   initial = null,
}: Props) {
   const {
      // Form state
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
      
      // UI state
      loading,
      errors,
      isEditing,
      
      // Store mapping state
      assignedMappings,
      availableStoresToAdd,
      selectedStoreToAdd, setSelectedStoreToAdd,
      mappingLoading,
      mappingError,
      
      // Actions
      parseCurrencyInput,
      addStoreToPromo,
      removeMapping,
      handleSubmit,
   } = usePromoForm({ open, initial, onCreated, onUpdated, onClose });

   if (!open) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center py-8 overflow-x-hidden overflow-y-auto">
         <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
         <form
            onSubmit={handleSubmit}
            className="relative z-50 bg-white rounded-t-lg p-6 w-full max-w-md md:rounded-md md:w-[550px] shadow-lg max-h-[85vh] overflow-y-auto overflow-x-hidden mx-4"
            style={{ WebkitOverflowScrolling: "touch" }}
         >
            <h3 className="mb-4 text-lg font-semibold">
               {isEditing ? "Edit Promo" : "Tambah Promo"}
            </h3>
            
            <PromoFormFields
               title={title} setTitle={setTitle}
               voucher={voucher} setVoucher={setVoucher}
               minCurrency={minCurrency} setMin={setMin}
               tenor={tenor} setTenor={setTenor}
               subsidiPercent={subsidiPercent} setSubsidiPercent={setSubsidiPercent}
               adminValue={adminValue} setAdminValue={setAdminValue}
               adminType={adminType} setAdminType={setAdminType}
               interest={interest} setInterest={setInterest}
               startDate={startDate} setStartDate={setStartDate}
               endDate={endDate} setEndDate={setEndDate}
               freeInstallment={freeInstallment} setFreeInstallment={setFreeInstallment}
               isActive={isActive} setIsActive={setIsActive}
               discount={discount} setDiscount={setDiscount}
               discountType={discountType} setDiscountType={setDiscountType}
               maxDiscount={maxDiscount} setMaxDiscount={setMaxDiscount}
               errors={errors}
               parseCurrencyInput={parseCurrencyInput}
            />

            <PromoStoreMapping
               assignedMappings={assignedMappings}
               availableStoresToAdd={availableStoresToAdd}
               selectedStoreToAdd={selectedStoreToAdd}
               setSelectedStoreToAdd={setSelectedStoreToAdd}
               mappingLoading={mappingLoading}
               mappingError={mappingError}
               addStoreToPromo={addStoreToPromo}
               removeMapping={removeMapping}
            />

            <div className="mt-4 flex justify-center gap-2">
               <Button variant="outline" type="button" onClick={onClose}>
                  Batal
               </Button>
               <Button type="submit" disabled={loading}>
                  {loading ? "Menyimpan..." : isEditing ? "Perbarui" : "Simpan"}
               </Button>
            </div>
         </form>
      </div>
   );
}