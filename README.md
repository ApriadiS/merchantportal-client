# Merchant Portal Client

Aplikasi web Merchant Portal berbasis **Svelte murni** + **TypeScript** + **Vite** untuk manajemen toko dan promo secara efisien. Project ini menggunakan pendekatan Client-Side Rendering (CSR) tanpa SvelteKit.

## Fitur Utama

- Manajemen data toko (tambah, edit, hapus, upload CSV)
- Manajemen promo (tambah, edit, hapus, upload CSV)
- Autentikasi admin
- Upload data via modal
- Navigasi SPA dengan client-side routing
- UI modern dan responsif

## Struktur Proyek

- `src/components/` — Komponen utama aplikasi (admin, promo, store)
- `src/pages/` — Halaman utama (Dashboard, Login, Home, dll)
- `src/lib/` — Komponen reusable & utilitas
- `src/core/` — Logika bisnis, API, types, dan utils
- `public/` — Aset statis (gambar, font, template CSV)

## Instalasi & Menjalankan

```bash
npm install
npm run dev
```

Akses aplikasi di [http://localhost:5173](http://localhost:5173)

## Teknologi

- [Svelte](https://svelte.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/) _(jika digunakan)_
- [svelte-routing](https://github.com/EmilTholin/svelte-routing) _(untuk routing SPA)_

## Pengembangan

- Rekomendasi IDE: [VS Code](https://code.visualstudio.com/)
- Ekstensi: [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)
- Ikuti struktur folder dan gunakan komponen reusable untuk menjaga kode tetap DRY dan modular.

## Kontribusi

Kontribusi sangat terbuka! Silakan buat pull request atau issue untuk perbaikan/penambahan fitur.

## Lisensi

MIT
