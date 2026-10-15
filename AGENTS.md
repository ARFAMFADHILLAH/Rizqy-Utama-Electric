<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project notes — Rizqy Utama Electric

- Next.js 16 App Router + TypeScript + Tailwind v4 + `@supabase/supabase-js` + `swr`, tanpa ORM, tanpa Prisma.
- **Deploy: Cloudflare Pages dengan `output: "export"` (HTML statis murni, folder `out/`).** Tidak ada server saat runtime.
- **Data diambil di browser (Client-Side Fetching) langsung dari Supabase PostgREST** via anon key: env `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Dashboard → Settings → API). Nilai `NEXT_PUBLIC_*` ter-bake saat build. Build **tidak** butuh akses DB.
- Lapisan data: `lib/supabase.ts` (klien browser, lazy) → `lib/api.ts` (mapper + hooks SWR). SQL lama kini jadi query PostgREST; join kategori pakai resource embedding `select("*, categories(name, slug)")` lalu di-flatten ke `category_name`/`category_slug` agar tipe `Product` & `lib/filter.ts` tidak berubah.
- Halaman server component hanya shell + `export const metadata`; body-nya komponen client (`"use client"`) yang fetch via SWR. Gunakan `components/LoadingBlock.tsx` / `components/home/HomeSkeleton.tsx` untuk loading dan `components/DataError.tsx` untuk error + retry.
- Keamanan: RLS + policy `SELECT` untuk `anon` pada tabel katalog ada di akhir `supabase/schema.sql` (jalankan sekali di SQL Editor; `users` sengaja tanpa policy). Tanpa policy, anon key tidak bisa membaca apa pun.
- **Static export: dynamic route tanpa `generateStaticParams()` tidak didukung.** Detail produk karena itu memakai query param: `/produk/?slug=…` (`app/produk/page.tsx` → `components/product/ProductDetailClient.tsx`). Link produk selalu `/produk/?slug=${encodeURIComponent(slug)}`.
- Filter/pencarian homepage **di sisi client** (query param dibaca via `useSearchParams`): `components/home/HomeBrowser.tsx` (client, fetch SWR) → `lib/filter.ts` → `components/home/HomeView.tsx` (presentasional). Logika filter harus tetap sinkron dengan `lib/filter.ts` bila menambah opsi. `useSearchParams` wajib dibungkus `<Suspense>`.
- `HomeBrowser`, `ProductDetailClient`, `CartPage`, `CheckoutPage`, `CategoryBrowser` semuanya client component yang memanggil hook SWR dari `lib/api.ts`. Key SWR: `banners`, `categories`, `testimonials`, `products:active`, `products:all`, `category-counts`, `["product", slug]`, `["product-media", id]`, `["related-products", categoryId, productId]`.
- Semua komponen yang memakai `useCart()` harus "use client". Keranjang = `localStorage` via `context/CartContext.tsx`.
- Nomor WA toko: `NEXT_PUBLIC_WA_NUMBER` (format 628…) — nilai `NEXT_PUBLIC_*` ikut ter-bake saat build. Helpers di `lib/format.ts`. Email kontak: `NEXT_PUBLIC_CONTACT_EMAIL` (default di `lib/format.ts`), tampil sebagai `mailto:` di footer.
- Link sosmed/marketplace (Instagram, LinkedIn, Shopee, TikTok, Tokopedia, Blibli): env `NEXT_PUBLIC_*_URL` dibaca `lib/social.ts` (default URL ada di kode), dirender `components/SocialLinks.tsx` (header + footer). Kosong & tanpa default → `#`/nonaktif.
- Commands: `npm run dev`, `npm run build` (menghasilkan `out/`), `npm run preview` (serve `out/`), `npm run lint`.
