"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { getStoreByRoutePublic, getPromoTenorsByStoreIdPublic } from "@/services/api/public";
import { getPromoByIdPublic } from "@/services/api/promos";
import { StoreResponse, PromoResponse } from "@/utils/interface";
import { PromoTenor } from "@/types";
import { useInstallmentCalculator } from "@/hooks/useInstallmentCalculator";
import StoreHeader from "@/components/StoreHeader";
import PriceInput from "@/components/PriceInput";
import PromoSelector from "@/components/PromoSelector";
import InstallmentResults from "@/components/InstallmentResults";
import Footer from "@/components/Footer";

interface Props {
   params: Promise<{ storeRoute: string }>;
}

export default function StoreSimulasiPage({ params }: Props) {
   const { storeRoute } = React.use(params);
   const {
      n,
      dot,
      results,
      expanded,
      error,
      setExpanded,
      calculateInstallments,
      handlePriceChange
   } = useInstallmentCalculator();
   
   const [tenors, setTenors] = useState<PromoTenor[]>([]);
   const [promos, setPromos] = useState<PromoResponse[]>([]);
   const [promoMap, setPromoMap] = useState<Map<string, PromoResponse>>(new Map());
   const [store, setStore] = useState<StoreResponse | null>(null);
   const [loading, setLoading] = useState(true);
   const [showToast, setShowToast] = useState(false);
   const [storeNotFound, setStoreNotFound] = useState(false);
   const [selectedPromoId, setSelectedPromoId] = useState<string | null>(null);
   const [calculatedPromoId, setCalculatedPromoId] = useState<string | null>(null);

   const formatRupiahLocal = (amount: number) => `Rp ${amount.toLocaleString("id-ID")}`;
   const formatShortAmount = (amount: number) => {
      if (amount >= 1000000) {
         const millions = amount / 1000000;
         return `${millions}JT`;
      }
      return `${amount.toLocaleString("id-ID")}`;
   };

   React.useEffect(() => {
      async function fetchData() {
         if (!storeRoute) return;
         
         try {
            setLoading(true);
            
            const storeRes = await getStoreByRoutePublic(storeRoute);
            
            if (!storeRes) {
               setStoreNotFound(true);
               return;
            }

            setStore(storeRes);

            const tenorResults = await getPromoTenorsByStoreIdPublic(String(storeRes.id));
            const availableTenors = tenorResults.filter(t => t.is_available);
            setTenors(availableTenors);
            
            // Get unique promo_ids and fetch promo details
            const uniquePromoIds = [...new Set(availableTenors.map(t => t.promo_id))];
            const promoPromises = uniquePromoIds.map(id => getPromoByIdPublic(id));
            const promoResults = (await Promise.all(promoPromises)).filter(p => p !== null) as PromoResponse[];
            
            setPromos(promoResults);
            const map = new Map<string, PromoResponse>();
            promoResults.forEach(p => map.set(String(p.id_promo), p));
            setPromoMap(map);
         } catch (err) {
            if (process.env.NODE_ENV === 'development') {
               console.error("Error fetching store data:", err);
            }
         } finally {
            setLoading(false);
         }
      }
      fetchData();
   }, [storeRoute]);

   const availableTenors = useMemo(() => {
      if (!n || !tenors.length) return [];
      return tenors.filter((tenor) => n >= tenor.min_transaction);
   }, [n, tenors]);

   const uniqueTenors = useMemo(() => {
      return Array.from(new Set(tenors.map(t => t.tenor))).sort((a, b) => a - b);
   }, [tenors]);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      calculateInstallments(tenors, promoMap, selectedPromoId);
      setCalculatedPromoId(selectedPromoId);
   };

   const handleCopyVoucher = async () => {
      if (!expanded || !selectedPromoId) return;
      const activeTenor = tenors.find(t => t.promo_id === selectedPromoId && t.tenor === expanded);
      if (!activeTenor?.voucher_code) return;
      try {
         await navigator.clipboard.writeText(activeTenor.voucher_code);
         setShowToast(true);
         setTimeout(() => setShowToast(false), 2000);
      } catch (err) {
         console.error("Failed to copy:", err);
      }
   };

   const handleToggleExpanded = (months: number) => {
      setExpanded(prev => prev === months ? null : months);
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen p-4 bg-red-400">
            <div className="w-full max-w-md p-4 bg-white shadow-2xl rounded-2xl sm:p-6">
               <div className="text-center">
                  <div className="w-8 h-8 mx-auto border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                  <p className="mt-2 text-sm text-gray-600">Memuat...</p>
               </div>
            </div>
         </div>
      );
   }

   if (storeNotFound) {
      const whatsappNumber = "6281234567890";
      const whatsappMessage = "Halo, saya ingin bertanya tentang simulasi cicilan";
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

      return (
         <div className="flex items-center justify-center min-h-screen p-4 bg-red-400">
            <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-2xl text-center">
               <div className="mb-6">
                  <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                     Store Tidak Ditemukan
                  </h2>
                  <p className="text-gray-600 mb-6">
                     Maaf, store yang Anda cari tidak tersedia atau mungkin telah dipindahkan.
                  </p>
               </div>

               <div className="space-y-4">
                  <p className="text-sm text-gray-700">
                     Butuh bantuan? Hubungi kami melalui WhatsApp untuk informasi lebih lanjut tentang simulasi cicilan.
                  </p>
                  
                  <a
                     href={whatsappUrl}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="inline-flex items-center justify-center w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-200"
                  >
                     <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                     </svg>
                     Hubungi via WhatsApp
                  </a>

                  <Link
                     href="/"
                     className="inline-block w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                     Kembali ke Beranda
                  </Link>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-red-400 flex items-center justify-center p-3 md:p-4">
         <main className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-3 sm:p-4">
            <StoreHeader store={store} />
            
            <hr className="my-4 border-gray-100" />

            <form className="space-y-3" onSubmit={handleSubmit}>
               <PriceInput dot={dot} onPriceChange={handlePriceChange} />

               <PromoSelector
                  availableTenors={availableTenors}
                  allTenors={tenors}
                  promos={promos}
                  n={n}
                  selectedPromoId={selectedPromoId}
                  onPromoChange={setSelectedPromoId}
               />

               <button
                  type="submit"
                  aria-label="Hitung Cicilan"
                  className="w-full px-4 py-3.5 text-base font-bold text-white transition-all active:scale-[0.98] bg-red-500 rounded-lg shadow-md"
               >
                  Hitung Cicilan
               </button>

               {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

               <InstallmentResults
                  tenors={uniqueTenors}
                  results={results}
                  expanded={expanded}
                  promoTenors={tenors}
                  promoMap={promoMap}
                  selectedPromoId={calculatedPromoId}
                  n={n}
                  formatRupiahLocal={formatRupiahLocal}
                  onToggleExpanded={handleToggleExpanded}
                  onCopyVoucher={handleCopyVoucher}
               />

            </form>

            <Footer />
         </main>

         {showToast && (
            <div className="fixed z-50 px-4 py-3 text-sm font-medium text-white bg-green-500 rounded-lg shadow-lg top-4 left-1/2 -translate-x-1/2 animate-in fade-in-0 slide-in-from-top-2">
               ✓ Kode voucher berhasil disalin!
            </div>
         )}
      </div>
   );
}