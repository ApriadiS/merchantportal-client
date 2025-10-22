"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAllPromoTenors, createPromoTenor, updatePromoTenor, deletePromoTenor } from "@/services/api/promo_tenor";
import { formatCurrency, formatPercent, formatAdmin } from "@/utils/format";
import type { PromoTenor } from "@/types";

interface Props {
   open: boolean;
   onClose: () => void;
   promoId: number;
   promoTitle: string;
}

export default function TenorManagementModal({ open, onClose, promoId, promoTitle }: Props) {
   const [tenors, setTenors] = useState<PromoTenor[]>([]);
   const [loading, setLoading] = useState(false);
   const [showForm, setShowForm] = useState(false);
   const [editingTenor, setEditingTenor] = useState<PromoTenor | null>(null);

   const [tenor, setTenor] = useState("");
   const [voucherCode, setVoucherCode] = useState("");
   const [minTransaction, setMinTransaction] = useState("");
   const [subsidi, setSubsidi] = useState("");
   const [admin, setAdmin] = useState("");
   const [discount, setDiscount] = useState("");
   const [maxDiscount, setMaxDiscount] = useState("");
   const [freeInstallment, setFreeInstallment] = useState("");

   useEffect(() => {
      if (open) {
         fetchTenors();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [open, promoId]);

   const fetchTenors = async () => {
      setLoading(true);
      try {
         const data = await getAllPromoTenors({ promo_id: String(promoId) });
         setTenors(data);
      } catch (err) {
         console.error("Error fetching tenors:", err);
      } finally {
         setLoading(false);
      }
   };

   const handleEdit = (t: PromoTenor) => {
      setEditingTenor(t);
      setTenor(String(t.tenor));
      setVoucherCode(t.voucher_code || "");
      setMinTransaction(String(t.min_transaction));
      setSubsidi(String(t.subsidi));
      setAdmin(String(t.admin));
      setDiscount(String(t.discount));
      setMaxDiscount(String(t.max_discount));
      setFreeInstallment(String(t.free_installment));
      setShowForm(true);
   };

   const resetForm = () => {
      setEditingTenor(null);
      setTenor("");
      setVoucherCode("");
      setMinTransaction("");
      setSubsidi("");
      setAdmin("");
      setDiscount("");
      setMaxDiscount("");
      setFreeInstallment("");
      setShowForm(false);
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (loading) return;
      setLoading(true);
      try {
         const payload = {
            promo_id: String(promoId),
            tenor: Number(tenor),
            voucher_code: voucherCode || null,
            min_transaction: Number(minTransaction),
            subsidi: Number(subsidi),
            admin: Number(admin),
            discount: Number(discount),
            max_discount: Number(maxDiscount),
            free_installment: Number(freeInstallment),
            is_available: true,
         };

         if (editingTenor) {
            await updatePromoTenor(editingTenor.id, payload);
         } else {
            await createPromoTenor(payload);
         }
         resetForm();
         fetchTenors();
      } catch (err) {
         console.error("Error saving tenor:", err);
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async (id: string) => {
      if (loading) return;
      if (!confirm("Delete this tenor?")) return;
      setLoading(true);
      try {
         await deletePromoTenor(id);
         fetchTenors();
      } catch (err) {
         console.error("Error deleting tenor:", err);
      } finally {
         setLoading(false);
      }
   };

   if (!open) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
         <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
         <div className="relative z-50 w-[700px] max-w-full mx-5 max-h-[90vh] overflow-y-auto">
            <Card className="bg-card">
               <CardHeader>
                  <CardTitle>Manage Tenors - {promoTitle}</CardTitle>
               </CardHeader>
               <CardContent>
                  {!showForm ? (
                     <>
                        <div className="mb-4">
                           <Button type="button" onClick={() => { resetForm(); setShowForm(true); }}>
                              Add Tenor
                           </Button>
                        </div>

                        {loading ? (
                           <div className="text-sm text-muted-foreground">Loading...</div>
                        ) : tenors.length === 0 ? (
                           <div className="text-sm text-muted-foreground">No tenors found.</div>
                        ) : (
                           <div className="grid grid-cols-1 gap-3">
                              {tenors.map((t) => (
                                 <div key={t.id} className="p-3 bg-muted/10 rounded border">
                                    <div className="flex justify-between items-start mb-2">
                                       <div className="font-medium">
                                          {t.tenor} bulan - {t.voucher_code}
                                       </div>
                                       <div className="flex gap-2">
                                          <Button
                                             type="button"
                                             variant="outline"
                                             size="sm"
                                             onClick={() => handleEdit(t)}
                                          >
                                             Edit
                                          </Button>
                                          <Button
                                             type="button"
                                             variant="destructive"
                                             size="sm"
                                             onClick={() => handleDelete(t.id)}
                                             disabled={loading}
                                          >
                                             {loading ? "Deleting..." : "Delete"}
                                          </Button>
                                       </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                       <div>
                                          <span className="text-muted-foreground">Min: </span>
                                          {formatCurrency(t.min_transaction)}
                                       </div>
                                       <div>
                                          <span className="text-muted-foreground">Subsidi: </span>
                                          {formatPercent(t.subsidi, 2)}
                                       </div>
                                       <div>
                                          <span className="text-muted-foreground">Admin: </span>
                                          {formatCurrency(t.admin)}
                                       </div>
                                       <div>
                                          <span className="text-muted-foreground">Discount: </span>
                                          {formatCurrency(t.discount)}
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        )}
                     </>
                  ) : (
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="block text-sm font-medium mb-1">Tenor (bulan)</label>
                              <input
                                 type="number"
                                 value={tenor}
                                 onChange={(e) => setTenor(e.target.value)}
                                 className="w-full px-3 py-2 border rounded-md"
                                 required
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-medium mb-1">Voucher Code</label>
                              <input
                                 type="text"
                                 value={voucherCode}
                                 onChange={(e) => setVoucherCode(e.target.value)}
                                 className="w-full px-3 py-2 border rounded-md"
                                 required
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-medium mb-1">Min Transaction</label>
                              <input
                                 type="number"
                                 value={minTransaction}
                                 onChange={(e) => setMinTransaction(e.target.value)}
                                 className="w-full px-3 py-2 border rounded-md"
                                 required
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-medium mb-1">Subsidi (%)</label>
                              <input
                                 type="number"
                                 step="0.01"
                                 value={subsidi}
                                 onChange={(e) => setSubsidi(e.target.value)}
                                 className="w-full px-3 py-2 border rounded-md"
                                 required
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-medium mb-1">Admin</label>
                              <input
                                 type="number"
                                 value={admin}
                                 onChange={(e) => setAdmin(e.target.value)}
                                 className="w-full px-3 py-2 border rounded-md"
                                 required
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-medium mb-1">Discount</label>
                              <input
                                 type="number"
                                 value={discount}
                                 onChange={(e) => setDiscount(e.target.value)}
                                 className="w-full px-3 py-2 border rounded-md"
                                 required
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-medium mb-1">Max Discount</label>
                              <input
                                 type="number"
                                 value={maxDiscount}
                                 onChange={(e) => setMaxDiscount(e.target.value)}
                                 className="w-full px-3 py-2 border rounded-md"
                                 required
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-medium mb-1">Free Installment</label>
                              <input
                                 type="number"
                                 value={freeInstallment}
                                 onChange={(e) => setFreeInstallment(e.target.value)}
                                 className="w-full px-3 py-2 border rounded-md"
                                 required
                              />
                           </div>

                        </div>

                        <div className="flex justify-end gap-2">
                           <Button type="button" variant="outline" onClick={resetForm}>
                              Cancel
                           </Button>
                           <Button type="submit" disabled={loading}>
                              {loading ? "Saving..." : editingTenor ? "Update" : "Create"}
                           </Button>
                        </div>
                     </form>
                  )}

                  <div className="mt-4 flex justify-end">
                     <Button type="button" variant="outline" onClick={onClose}>
                        Close
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
