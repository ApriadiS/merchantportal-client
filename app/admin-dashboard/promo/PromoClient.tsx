"use client";
import React, { useEffect, useState } from "react";
import Loading from "@components/shared/Loading";
import ModalDelete from "@components/shared/ModalDelete";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PromoFormModal from "@components/Promo/PromoFormModal";
import PromoViewModal from "@components/Promo/PromoViewModal";
import type { PromoResponse, StoreResponse } from "@/utils/interface";
import { formatCurrency, formatPercent, formatAdmin } from "@/utils/format";
import { useToast } from "@/hooks/useToast-old";
// supabaseClient usage replaced by service wrappers below
import { getAllPromos, deletePromo } from "@services/database/promos";
import {
   getAllPromoStores,
   getPromoStoresByPromoId,
} from "@services/database/promo_store";
import { getStoresByIds } from "@services/database/stores";

type PromoWithCount = PromoResponse & { storeCount?: number };

export default function PromoClient() {
   const [promos, setPromos] = useState<PromoWithCount[]>([]);
   const [deleteTarget, setDeleteTarget] = useState<PromoResponse | null>(null);
   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
   const [isCreateOpen, setIsCreateOpen] = useState(false);
   const [editingPromo, setEditingPromo] = useState<PromoResponse | null>(null);
   const [viewPromo, setViewPromo] = useState<PromoResponse | null>(null);
   const [storesForView, setStoresForView] = useState<StoreResponse[]>([]);
   const [storesForViewLoading, setStoresForViewLoading] = useState(false);
   const [storesForViewError, setStoresForViewError] = useState<string | null>(
      null
   );
   const [q, setQ] = useState("");
   const [filterAdminType, setFilterAdminType] = useState<string | "">("");
   const [filterActive, setFilterActive] = useState<boolean | "">("");
   const { push } = useToast();
   const STORAGE_KEY = "promo:list:filters";

   const resetFilters = () => {
      setQ("");
      setFilterAdminType("");
      setFilterActive("");
      try {
         if (typeof window !== "undefined") {
            localStorage.removeItem(STORAGE_KEY);
         }
      } catch {
         // ignore
      }
      // reload lists
      refetchPromos();
      refetchPromoStores();
   };

   // mark used to avoid linter unused warning while filter UI is commented out
   void resetFilters;

   // load persisted filter state on mount
   useEffect(() => {
      try {
         if (typeof window === "undefined") return;
         const raw = localStorage.getItem(STORAGE_KEY);
         if (!raw) return;
         const parsed = JSON.parse(raw || "{}");
         if (parsed.q) setQ(parsed.q);
         if (parsed.filterAdminType) setFilterAdminType(parsed.filterAdminType);
         if (parsed.filterActive !== undefined)
            setFilterActive(parsed.filterActive);
      } catch (err) {
         console.warn("Could not load persisted promo filters", err);
      }
   }, []);

   // persist filters when they change
   useEffect(() => {
      try {
         if (typeof window === "undefined") return;
         const payload = { q, filterAdminType, filterActive };
         localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
         // ignore
      }
   }, [q, filterAdminType, filterActive]);

   // (Dev snapshot and fallback effects moved below after useList declarations)

   const [promosLoading, setPromosLoading] = useState(true);
   const [promoStoresLoading, setPromoStoresLoading] = useState(true);
   const refetchPromos = async () => {
      setPromosLoading(true);
      try {
         const rows = await getAllPromos();
         setPromos(
            (rows as PromoResponse[]).map((p) => ({ ...p, storeCount: 0 }))
         );
      } catch (err) {
         console.error("getAllPromos failed", err);
      } finally {
         setPromosLoading(false);
      }
   };
   const refetchPromoStores = async () => {
      setPromoStoresLoading(true);
      try {
         const rows = await getAllPromoStores();
         return rows;
      } catch (err) {
         console.error("getAllPromoStores failed", err);
         return [] as { id: number; promo_id: number; store_id: number }[];
      } finally {
         setPromoStoresLoading(false);
      }
   };

   // Dev-only: snapshot useList results
   useEffect(() => {
      try {
         console.debug("PromoClient: snapshot", {
            timestamp: new Date().toISOString(),
            promosCount: promos.length,
            promosLoading,
            promoStoresLoading,
         });
      } catch (err) {
         console.debug("PromoClient: debug snapshot failed", err);
      }
   }, [promos, promosLoading, promoStoresLoading]);

   useEffect(() => {
      let mounted = true;
      (async () => {
         try {
            // mark loading while we fetch initial data
            if (mounted) {
               setPromosLoading(true);
               setPromoStoresLoading(true);
            }

            const pRows = await getAllPromos();
            if (!mounted) return;
            const psRows = await getAllPromoStores();
            if (!mounted) return;
            const storesByPromo = new Map<number, number>();
            psRows.forEach(
               (ps: { id: number; promo_id: number; store_id: number }) => {
                  storesByPromo.set(
                     ps.promo_id,
                     (storesByPromo.get(ps.promo_id) || 0) + 1
                  );
               }
            );
            if (mounted) {
               setPromos(
                  (pRows as PromoResponse[]).map((p) => ({
                     ...p,
                     storeCount: storesByPromo.get(p.id_promo) || 0,
                  }))
               );
            }
         } catch (err) {
            console.error("Promo list load failed", err);
         } finally {
            if (mounted) {
               setPromosLoading(false);
               setPromoStoresLoading(false);
            }
         }
      })();
      return () => {
         mounted = false;
      };
   }, []);

   const handleDelete = async (id?: number) => {
      if (!id) return;
      try {
         await deletePromo(id);
         // local update
         setPromos((prev) => prev.filter((s) => s.id_promo !== id));
         setIsDeleteOpen(false);
         setDeleteTarget(null);
         push({ type: "success", message: "Promo berhasil dihapus" });
         // refetch lists
         await refetchPromos();
         await refetchPromoStores();
      } catch (err) {
         console.error("deletePromo failed", err);
         push({ type: "error", message: "Gagal menghapus promo" });
      }
   };

   // promos are loaded above with counts in the main load effect; nothing further required here.

   if (promosLoading || promoStoresLoading)
      return <Loading label="Memuat promo..." speed={1.4} />;

   const filtered = promos.filter((p) => {
      const term = q.trim().toLowerCase();
      if (!term) return true;
      return (
         (p.title_promo || "").toLowerCase().includes(term) ||
         (p.voucher_code || "").toLowerCase().includes(term) ||
         String(p.min_transaction_promo || "").includes(term) ||
         String(p.tenor_promo || "").includes(term) ||
         String(p.subsidi_promo || "").includes(term) ||
         String(p.admin_promo || "").includes(term) ||
         String(p.interest_rate || "").includes(term) ||
         (p.start_date_promo || "").includes(term) ||
         (p.end_date_promo || "").includes(term)
      );
   });
   // apply additional filters
   const finalFiltered = filtered.filter((p) => {
      if (filterAdminType) {
         if ((p.admin_promo_type || "") !== filterAdminType) return false;
      }
      if (filterActive !== "") {
         if (Boolean(p.is_active) !== Boolean(filterActive)) return false;
      }
      return true;
   });

   return (
      <>
         <Card className="overflow-x-auto">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-0">
               <div className="flex items-start sm:items-center gap-2 sm:flex-row flex-col mb-4">
                  <div className="flex-1 min-w-0">
                     <Input
                        className="w-full"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search title or voucher"
                     />
                  </div>
                  {/* Filter UI commented out per request. To restore, replace this
                      comment with the original Popover+Select JSX. */}
                  <Button onClick={() => setIsCreateOpen(true)}>
                     Tambah Promo
                  </Button>
               </div>
            </CardHeader>

            <CardContent>
               {finalFiltered.length === 0 ? (
                  <div className="p-6 text-center text-sm text-gray-500">
                     No promos found.
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {finalFiltered.map((p) => (
                        <div
                           key={p.id_promo}
                           className="p-4 rounded-md shadow-sm hover:shadow-md transition"
                        >
                           <div className="flex justify-between items-start gap-4">
                              <div className="flex gap-1 flex-col">
                                 <h4 className="text-sm font-semibold">
                                    {p.title_promo}
                                 </h4>
                                 <div className="flex flex-col sm:flex-row gap-1 text-xs text-muted-foreground">
                                    <p>{p.voucher_code || "-"}</p>
                                    <p className="hidden md:block">-</p>
                                    <p>
                                       Min:{" "}
                                       {formatCurrency(p.min_transaction_promo)}
                                    </p>
                                 </div>
                              </div>
                              <div className="text-right text-xs">
                                 <div className="text-sm font-medium">
                                    {p.tenor_promo} bulan
                                 </div>
                                 <div className="text-muted-foreground">
                                    {p.start_date_promo} — {p.end_date_promo}
                                 </div>
                              </div>
                           </div>

                           {/* Desktop/Tablet: show grid details */}
                           <div className="mt-3 grid grid-cols-2 gap-2 text-xs md:grid">
                              <div>
                                 <div className="text-muted-foreground">
                                    Subsidi
                                 </div>
                                 <div className="font-medium">
                                    {p.subsidi_promo}
                                 </div>
                              </div>
                              <div>
                                 <div className="text-muted-foreground">
                                    Admin
                                 </div>
                                 <div className="font-medium">
                                    {formatAdmin(
                                       p.admin_promo,
                                       p.admin_promo_type
                                    )}
                                 </div>
                              </div>
                              <div>
                                 <div className="text-muted-foreground">
                                    Bunga
                                 </div>
                                 <div className="font-medium">
                                    {formatPercent(p.interest_rate, 2)}
                                 </div>
                              </div>
                              {p.discount && (
                                 <div>
                                    <div className="text-muted-foreground">
                                       Discount
                                    </div>
                                    <div className="font-medium">
                                       {p.discount_type === "PERCENT" 
                                          ? `${p.discount}%`
                                          : formatCurrency(p.discount)
                                       }
                                    </div>
                                 </div>
                              )}
                           </div>

                           {/* (Mobile inline actions removed) */}

                           {/* Desktop actions */}
                           <div className="mt-4 flex justify-end gap-2">
                              <Button
                                 variant="ghost"
                                 onClick={() => {
                                    setEditingPromo(p);
                                    setIsCreateOpen(false);
                                 }}
                              >
                                 Edit
                              </Button>
                              <Button
                                 onClick={async () => {
                                    setStoresForViewLoading(true);
                                    setStoresForViewError(null);
                                    try {
                                       const psRows =
                                          await getPromoStoresByPromoId(
                                             p.id_promo
                                          );
                                       const ids = psRows
                                          .map((r) => r.store_id)
                                          .filter(Boolean) as number[];
                                       if (ids.length === 0) {
                                          setStoresForView([]);
                                       } else {
                                          const sRows = await getStoresByIds(
                                             ids
                                          );
                                          setStoresForView(sRows);
                                       }
                                    } catch (err) {
                                       console.error(
                                          "Failed to load stores for promo view",
                                          err
                                       );
                                       const msg =
                                          err instanceof Error
                                             ? err.message
                                             : String(err);
                                       setStoresForViewError(msg);
                                    } finally {
                                       setStoresForViewLoading(false);
                                       setViewPromo(p);
                                    }
                                 }}
                              >
                                 View
                              </Button>
                              <Button
                                 variant="destructive"
                                 onClick={() => {
                                    setDeleteTarget(p);
                                    setIsDeleteOpen(true);
                                 }}
                              >
                                 Delete
                              </Button>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </CardContent>
         </Card>
         <PromoFormModal
            open={isCreateOpen || Boolean(editingPromo)}
            initial={editingPromo}
            onClose={() => {
               setIsCreateOpen(false);
               setEditingPromo(null);
            }}
            onCreated={(p) =>
               setPromos((prev) => [p as PromoResponse, ...prev])
            }
            onUpdated={(p) =>
               setPromos((prev) =>
                  prev.map((it) => (it.id_promo === p.id_promo ? p : it))
               )
            }
         />
         <PromoViewModal
            open={Boolean(viewPromo)}
            promo={viewPromo}
            stores={storesForView}
            storesLoading={storesForViewLoading}
            storesError={storesForViewError}
            onClose={() => setViewPromo(null)}
            onEdit={(p) => {
               setViewPromo(null);
               setEditingPromo(p);
            }}
         />
         {isDeleteOpen && deleteTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
               <div
                  className="absolute inset-0 bg-black opacity-60"
                  onClick={() => setIsDeleteOpen(false)}
               />
               <div className="relative z-50">
                  <ModalDelete
                     title={`Hapus promo: ${deleteTarget.title_promo}`}
                     onClose={() => {
                        setIsDeleteOpen(false);
                        setDeleteTarget(null);
                     }}
                     inline
                     buttons={[
                        {
                           label: "Hapus",
                           bgColor: "bg-red-500",
                           textColor: "text-white",
                           bgColorHover: "bg-red-600",
                           textColorHover: "text-white",
                           onclick: () => handleDelete(deleteTarget.id_promo),
                        },
                        {
                           label: "Batal",
                           bgColor: "bg-gray-300",
                           textColor: "text-black",
                           bgColorHover: "bg-gray-400",
                           textColorHover: "text-black",
                           onclick: () => {
                              setIsDeleteOpen(false);
                              setDeleteTarget(null);
                           },
                        },
                     ]}
                  />
               </div>
            </div>
         )}
      </>
   );
}
