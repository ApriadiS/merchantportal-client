<script lang="ts">
  import { log } from "../lib/core/utils/logger";
  log("NotFoundPage loaded");
  // Halaman fallback untuk route yang tidak dikenali
</script>

<div class="min-h-screen flex items-center justify-center bg-[#fff1f1]">
  <div class="text-center">
    <h1 class="text-4xl font-bold text-[#ff4745] mb-4">404</h1>
    <p class="text-lg text-gray-700 mb-6">Halaman tidak ditemukan</p>
    <a href="/" class="text-[#ff4745] underline">Kembali ke Beranda</a>
  </div>
</div>
