import type { Metadata } from "next";
import "./globals.css";
import VercelIntegration from "@components/VercelIntegration";

export const metadata: Metadata = {
   title: "Simulasi Cicilan Akulaku",
   description: "Simulasi Cicilan Akulaku untuk Merchant Portal",
   icons: {
      icon: "/akulaku-logo.png",
      shortcut: "/akulaku-logo.png",
      apple: "/akulaku-logo.png",
   },
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <head>
            <link
               rel="icon"
               type="image/png"
               sizes="32x32"
               href="/akulaku-logo.png"
            />
            <link
               rel="icon"
               type="image/png"
               sizes="16x16"
               href="/akulaku-logo.png"
            />
            <link rel="shortcut icon" href="/akulaku-logo.png" />
            <link rel="apple-touch-icon" href="/akulaku-logo.png" />
         </head>
         <body>
            {children}
            <VercelIntegration />
         </body>
      </html>
   );
}
