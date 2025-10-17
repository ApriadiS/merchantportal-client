"use client";
import React, { useState } from "react";
import Image from "next/image";
import useCurrency from "@/hooks/useCurrency";

type Result = {
   monthly: number;
   totalInterest: number;
   totalPayment: number;
};

export default function SimulasiPage() {
   const [n, dot, , setValue] = useCurrency(0);
   const [results, setResults] = useState<Record<number, Result>>({});
   const [expanded, setExpanded] = useState<number | null>(null);
   const [error, setError] = useState<string | null>(null);

   const TENORS = [6, 9, 12];
   const MONTHLY_RATE = 0.026; // flat interest 2.6% per month
   const MAX_PRICE = 30_000_000; // maksimal 30 juta

   const formatRupiahLocal = (amount: number) =>
      `Rp ${amount.toLocaleString("id-ID")}`;

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      // Validate input
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

      // Compute results for each tenor
      const next: Record<number, Result> = {};
      for (const months of TENORS) {
         // Calculate monthly payment: (principal/tenor) + (principal * interest_rate)
         const principalPerMonth = n / months;
         const interestPerMonth = n * MONTHLY_RATE;
         const monthly = Math.ceil(principalPerMonth + interestPerMonth);
         
         const totalPayment = monthly * months;
         const totalInterest = totalPayment - n;

         next[months] = {
            monthly,
            totalInterest,
            totalPayment,
         };
      }

      setResults(next);
      // auto-expand the first tenor (9 months preferred if present)
      setExpanded(TENORS.includes(9) ? 9 : TENORS[0]);
   };

   // parse input value like useCurrency does: remove non-digits
   const parseDigits = (s: string) => {
      const digits = String(s).replace(/[^0-9-]/g, "");
      if (!digits) return 0;
      try {
         return Math.trunc(parseInt(digits, 10) || 0);
      } catch {
         return 0;
      }
   };

   const handlePriceChange = (value: string) => {
      const num = parseDigits(value);
      if (num > MAX_PRICE) {
         // clamp to maximum
         setValue(MAX_PRICE);
         return;
      }
      // Clear previous error as input is within allowed range
      if (error) setError(null);
      setValue(value);
   };

   return (
      <div className="min-h-screen bg-red-400 flex items-center justify-center p-4">
         <main className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-4 sm:p-6">
            <header className="text-center">
               <Image
                  src="/akulakupaylater-logo.png"
                  alt="Akulaku"
                  width={200}
                  height={200}
                  className="mx-auto"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rj9v/2Q=="
               />
               <p className="text-black text-md mt-3">
                  Hitung cicilan kredit barangmu dengan mudah
               </p>
            </header>

            <hr className="my-6 border-gray-100" />

            <form className="space-y-4" onSubmit={handleSubmit}>
               <div className="p-4 rounded-xl space-y-3 bg-red-100">
                  <div>
                     <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700 mb-2"
                     >
                        Harga Barang
                     </label>

                     <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                           Rp
                        </span>
                        <input
                           id="price"
                           name="price"
                           type="text"
                           inputMode="numeric"
                           placeholder="0"
                           className="w-full pl-9 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus-accent focus:border-transparent transition"
                           aria-label="Harga Barang"
                           required
                           // 1. Atur `value` input dari state `dot`
                           //    Jika nilainya "0", tampilkan string kosong agar placeholder terlihat
                           value={dot === "0" ? "" : dot}
                           // 2. Panggil handler yang mem-parsing, mem-clamp, dan setValue
                           onChange={(e) => handlePriceChange(e.target.value)}
                        />
                     </div>
                  </div>
               </div>

               <div className="pt-2">
                  <button
                     type="submit"
                     aria-label="Hitung Cicilan"
                     className="w-full font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 ease-in-out bg-red-500 text-white"
                  >
                     Hitung Cicilan
                  </button>
               </div>

               {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

               <div className="bg-red-100 p-4 rounded-xl">
                  <h2 className="text-center font-semibold text-red-500 mb-4 text-md">
                     Hasil Simulasi Cicilan
                  </h2>

                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                     {TENORS.map((months) => {
                        const res = results[months];
                        const isOpen = expanded === months;
                        return (
                           <div key={months} className="text-center">
                              <div className="p-3 rounded-lg flex flex-col items-center justify-center min-h-[100px] gap-1 sm:gap-0 bg-gray-50">
                                 <p className="text-sm text-gray-600 h-6">
                                    {months} Bulan
                                 </p>
                                 <div className="flex-grow flex items-center my-1 text-center justify-center w-full">
                                    <p className="text-sm sm:text-base font-bold text-red-500 whitespace-nowrap">
                                       {res
                                          ? formatRupiahLocal(res.monthly)
                                          : "-"}
                                    </p>
                                 </div>

                                 <button
                                    type="button"
                                    aria-label={`Tampilkan rincian untuk ${months} bulan`}
                                    aria-expanded={isOpen}
                                    onClick={() =>
                                       setExpanded((prev) =>
                                          prev === months ? null : months
                                       )
                                    }
                                    className={`transform transition-transform duration-200 ${
                                       isOpen ? "rotate-180" : ""
                                    }`}
                                 >
                                    <svg
                                       className="w-5 h-5 text-black"
                                       fill="none"
                                       stroke="currentColor"
                                       viewBox="0 0 24 24"
                                    >
                                       <path
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M19 9l-7 7-7-7"
                                       />
                                    </svg>
                                 </button>
                              </div>
                           </div>
                        );
                     })}
                  </div>
                  {/* Details panel for selected tenor */}
                  {expanded !== null && results[expanded] && (
                     <div className="mt-4 bg-white p-4 rounded-md text-black">
                        <div className="flex items-center justify-between mb-2">
                           <h3 className="text-sm text-gray-600">Rincian</h3>
                           <span className="text-xs text-gray-500">
                              Tenor: {expanded} bulan
                           </span>
                        </div>

                        <div className="space-y-2">
                           <div className="flex justify-between text-sm">
                              <span>Harga Produk:</span>
                              <strong>{formatRupiahLocal(n)}</strong>
                           </div>
                           <div className="flex justify-between text-sm">
                              <span>Biaya Bunga:</span>
                              <strong>
                                 {formatRupiahLocal(
                                    results[expanded].totalInterest
                                 )}
                              </strong>
                           </div>
                           <div className="flex justify-between text-sm font-semibold border-t border-black pt-2">
                              <span>Total Pembayaran:</span>
                              <strong className="text-red-500">
                                 {formatRupiahLocal(
                                    results[expanded].totalPayment
                                 )}
                              </strong>
                           </div>
                        </div>
                     </div>
                  )}
               </div>
            </form>

            <footer className="mt-6 text-center">
               <p className="text-xs text-gray-400">Powered by Akulaku</p>
               <p className="text-xs text-gray-500 mt-3 px-4 leading-relaxed">
                  <strong>Catatan:</strong> Simulasi ini hanya perkiraan.
                  Hubungi kami untuk detail lebih lanjut.
               </p>

               <a
                  href="https://wa.me/6285705887356"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2  text-white font-bold py-3 px-6 rounded-full shadow-md active:scale-95 transition-all duration-300 bg-green-500"
               >
                  <svg
                     className="w-6 h-6"
                     fill="currentColor"
                     viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg"
                  >
                     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path>
                  </svg>{" "}
                  <span>Hubungi via WhatsApp</span>
               </a>
            </footer>
         </main>
      </div>
   );
}
