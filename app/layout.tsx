import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import VercelIntegration from "@components/VercelIntegration";

const poppins = localFont({
   src: [
      { path: '../public/font/Poppins-Regular.ttf', weight: '400', style: 'normal' },
      { path: '../public/font/Poppins-Medium.ttf', weight: '500', style: 'normal' },
      { path: '../public/font/Poppins-SemiBold.ttf', weight: '600', style: 'normal' },
      { path: '../public/font/Poppins-Bold.ttf', weight: '700', style: 'normal' },
   ],
   variable: '--font-poppins',
   display: 'swap',
});

export const metadata: Metadata = {
   title: "Simulasi Cicilan Akulaku",
   description: "Hitung cicilan kredit barang dengan mudah. Simulasi cicilan 6, 9, dan 12 bulan dengan bunga flat 2.6% per bulan.",
   icons: {
      icon: "/akulaku-logo.png",
      shortcut: "/akulaku-logo.png",
      apple: "/akulaku-logo.png",
   },
   openGraph: {
      title: "Simulasi Cicilan Akulaku",
      description: "Hitung cicilan kredit barang dengan mudah",
      type: "website",
   },
};

export const viewport = {
   width: "device-width",
   initialScale: 1,
   maximumScale: 5,
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="id">
         <body className={poppins.className}>
            {children}
            <VercelIntegration />
         </body>
      </html>
   );
}
