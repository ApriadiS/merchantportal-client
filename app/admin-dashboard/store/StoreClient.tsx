"use client";
import { useEffect, useState } from "react";
import type { StoreResponse } from "@/utils/interface";
import Loading from "@components/shared/Loading";
import ModalDelete from "@components/shared/ModalDelete";
import { Button } from "@components/ui/shadcn/button";
import {
   Card as ShadCard,
   CardHeader as ShadCardHeader,
   CardTitle as ShadCardTitle,
   CardDescription as ShadCardDescription,
   CardContent as ShadCardContent,
} from "@components/ui/shadcn/card";
import { useToast } from "@components/ui/Toast";
import { getAllStores, deleteStore } from "@services/database/client/stores";
import { Input } from "@components/ui/shadcn/input";
import StoreFormModal from "@components/Store/StoreFormModal";

export default function StoreClient() {
   const [stores, setStores] = useState<StoreResponse[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<Error | null>(null);
   const [deleteTarget, setDeleteTarget] = useState<StoreResponse | null>(null);
   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
   const [q, setQ] = useState("");
   const [filterCompany, setFilterCompany] = useState<string | "">("");
   const [filterRoute, setFilterRoute] = useState("");
   const [isCreateOpen, setIsCreateOpen] = useState(false);
   const [editingStore, setEditingStore] = useState<StoreResponse | null>(null);
   const toast = useToast();

   const STORAGE_KEY = "store:list:filters";

   const resetFilters = async () => {
      setQ("");
      setFilterCompany("");
      setFilterRoute("");
      try {
         if (typeof window !== "undefined") {
            localStorage.removeItem(STORAGE_KEY);
         }
      } catch (err) {
         console.warn("Could not clear persisted store filters", err);
      }
      // refetch store list
      try {
         setIsLoading(true);
         const rows = await getAllStores();
         setStores(rows);
      } catch (err) {
         setError(err as Error);
      } finally {
         setIsLoading(false);
      }
   };

   // load persisted filter state on mount
   useEffect(() => {
      try {
         if (typeof window === "undefined") return;
         const raw = localStorage.getItem(STORAGE_KEY);
         if (!raw) return;
         const parsed = JSON.parse(raw || "{}");
         if (parsed.q) setQ(parsed.q);
         if (parsed.filterCompany) setFilterCompany(parsed.filterCompany);
         if (parsed.filterRoute) setFilterRoute(parsed.filterRoute);
      } catch (err) {
         console.warn("Could not load persisted store filters", err);
      }
   }, []);

   // persist filters when they change
   useEffect(() => {
      try {
         if (typeof window === "undefined") return;
         const payload = { q, filterCompany, filterRoute };
         localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
         // ignore
      }
   }, [q, filterCompany, filterRoute]);

   // Fallback: if refine's useList returned no data after loading, try direct
   // Supabase client fetch. This is a pragmatic fallback while we debug why
   // the Refine hook isn't populating `data` in this environment.
   useEffect(() => {
      let mounted = true;
      (async () => {
         try {
            const rows = await getAllStores();
            if (!mounted) return;
            setStores(rows);
         } catch (err) {
            console.error("getAllStores failed", err);
            setError(err as Error);
         } finally {
            if (mounted) setIsLoading(false);
         }
      })();
      return () => {
         mounted = false;
      };
   }, []);

   const handleDelete = async (id?: number) => {
      if (!id) return;
      try {
         await deleteStore(id);
         // refetch list
         const rows = await getAllStores();
         setStores(rows);
         setIsDeleteOpen(false);
         setDeleteTarget(null);
         toast.push({ type: "success", message: "Store berhasil dihapus" });
      } catch (err) {
         console.error("deleteStore failed", err);
         toast.push({ type: "error", message: "Gagal menghapus store" });
      }
   };

   if (isLoading) return <Loading label="Memuat data..." speed={1.4} />;

   const filtered = stores.filter((s) => {
      const term = q.trim().toLowerCase();
      if (!term) return true;
      return (
         s.name.toLowerCase().includes(term) ||
         s.company.toLowerCase().includes(term) ||
         (s.route || "").toLowerCase().includes(term)
      );
   });

   // (Filter UI is currently disabled)

   // apply additional filters from the popover
   const finalFiltered = filtered.filter((s) => {
      if (filterCompany) {
         if ((s.company || "") !== filterCompany) return false;
      }
      if (filterRoute) {
         if (!(s.route || "").toLowerCase().includes(filterRoute.toLowerCase()))
            return false;
      }
      return true;
   });

   return (
      <>
         <ShadCard className="overflow-x-auto">
            <ShadCardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-0">
               <div className="flex items-start sm:items-center gap-2 sm:flex-row flex-col mb-4">
                  <div className="flex-1 min-w-0">
                     <div className="relative">
                        <Input
                           className="w-full pr-10"
                           value={q}
                           onChange={(e) => setQ(e.target.value)}
                           placeholder="Search name, company or route"
                        />
                        {q && q.length > 0 && (
                           <button
                              type="button"
                              aria-label="Clear search"
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                              onClick={() => setQ("")}
                           >
                              ×
                           </button>
                        )}
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Button onClick={() => setIsCreateOpen(true)}>
                        Tambah Store
                     </Button>
                  </div>
               </div>
            </ShadCardHeader>

            <ShadCardContent>
               {finalFiltered.length === 0 ? (
                  <div className="p-6 text-center text-sm text-gray-500">
                     No stores found.
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {finalFiltered.map((s) => (
                        <div
                           key={s.id}
                           className="p-4 rounded-md shadow-sm hover:shadow-md transition"
                        >
                           <div className="flex justify-between items-start gap-4">
                              <div>
                                 <h4 className="text-sm font-semibold">
                                    {s.name} - ({s.type})
                                 </h4>
                                 <p className="text-xs text-muted-foreground">
                                    {s.company}
                                 </p>
                              </div>
                              <div className="text-right text-xs">
                                 <div className="text-muted-foreground">
                                    Route
                                 </div>
                                 <div className="font-medium">
                                    {s.route || "-"}
                                 </div>
                              </div>
                           </div>

                           <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                              <div>
                                 <div className="text-muted-foreground">
                                    Company
                                 </div>
                                 <div className="font-medium">{s.company}</div>
                              </div>
                              <div>
                                 <div className="text-muted-foreground">
                                    Route
                                 </div>
                                 <div className="font-medium">
                                    {s.route || "-"}
                                 </div>
                              </div>
                           </div>

                           <div className="mt-4 flex justify-end gap-2">
                              <Button
                                 variant="ghost"
                                 onClick={() => setEditingStore(s)}
                              >
                                 Edit
                              </Button>
                              <Button
                                 variant="destructive"
                                 onClick={() => {
                                    setDeleteTarget(s);
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
            </ShadCardContent>
         </ShadCard>
         {isDeleteOpen && deleteTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
               <div
                  className="absolute inset-0 bg-black opacity-60"
                  onClick={() => setIsDeleteOpen(false)}
               />
               <div className="relative z-50">
                  <ModalDelete
                     title={`Hapus store: ${deleteTarget.name}`}
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
                           onclick: () => handleDelete(deleteTarget.id),
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
         <StoreFormModal
            open={isCreateOpen || Boolean(editingStore)}
            initial={editingStore}
            onClose={() => {
               setIsCreateOpen(false);
               setEditingStore(null);
            }}
            onCreated={(s) =>
               setStores((prev) => [s as StoreResponse, ...prev])
            }
            onUpdated={(s) =>
               setStores((prev) => prev.map((it) => (it.id === s.id ? s : it)))
            }
         />
      </>
   );
}
