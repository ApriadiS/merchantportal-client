import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   experimental: {
      optimizePackageImports: [
         '@radix-ui/react-icons',
         'lucide-react',
         '@radix-ui/react-dialog',
         '@radix-ui/react-select',
         '@radix-ui/react-popover',
      ],
   },
   images: {
      formats: ['image/webp', 'image/avif'],
      minimumCacheTTL: 60,
   },
   compiler: {
      removeConsole: process.env.NODE_ENV === 'production',
   },
   poweredByHeader: false,
   compress: true,
};

export default nextConfig;
