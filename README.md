# Rizqy Utama Electric — Online Store (Next.js + Supabase)

<p align="center">
  <img src="public/logo/circle-logo-rizqyutama.png" alt="Rizqy Utama Electric Logo" width="180" />
</p>

Website toko material listrik **khusus tampilan pelanggan** (pembeli): katalog produk, keranjang belanja, dan checkout via WhatsApp. Panel admin menyusul di folder terpisah.

- **Stack:** Next.js 16 (App Router, **static export**) · React 19 · TypeScript · Tailwind CSS 4 · `@supabase/supabase-js` + `swr`
- **Database:** Supabase Postgres (dibaca di browser via PostgREST + anon key)
- **Deploy:** Cloudflare Pages (HTML statis murni, output `out/`)
- **Checkout:** kirim ringkasan order ke WhatsApp (nomor dari `NEXT_PUBLIC_WA_NUMBER`)
- **Desain:** navy `#0A1F44` · orange `#FF7A00` · putih

## Cara data diambil

Tidak ada server saat runtime. Setelah halaman dimuat, **browser** memanggil Supabase PostgREST memakai `NEXT_PUBLIC_SUPABASE_ANON_KEY`; hasilnya ditampilkan dan di-cache oleh **SWR**. Mapping query ada di `lib/api.ts`. Build **tidak butuh akses database** — cukup env `NEXT_PUBLIC_*`.

## Fitur (Halaman Pelanggan)

| Rute | Fungsi |
|------|--------|
| `/` | Katalog: banner slider, pencarian (`?q`), filter kategori (multi-pilih) + rentang harga + urutkan, grid produk, testimoni, chatbot FAQ |
| `/produk/?slug=…` | Detail produk: galeri foto + video, rating & jumlah terjual, harga, stok, deskripsi, tambah ke keranjang, produk sejenis |
| `/kategori` | Semua kategori + jumlah produk |
| `/keranjang` | Kelola keranjang (`localStorage`): ubah qty, hapus, kosongkan, subtotal |
| `/checkout` | Form pemesan (nama/HP/alamat/catatan) → buka `wa.me` berisi ringkasan order |

Fitur global: **bottom navigation** mobile, **chatbot FAQ** (rule-based + lanjut ke WhatsApp), **link sosial & marketplace** (Instagram, LinkedIn, Shopee, TikTok, Tokopedia, Blibli) di header & footer, keranjang tersimpan di `localStorage`.

> Panel `/admin` belum ada — disusul di iterasi berikutnya. Prompt siap pakai untuk membuatnya ada di [`docs/ADMIN-PROMPT.md`](docs/ADMIN-PROMPT.md).

## Menjalankan

```sh
npm install

# Isi .env.local (lihat .env.example):
#   NEXT_PUBLIC_SUPABASE_URL      -> Project URL Supabase (Dashboard -> Settings -> API)   [wajib]
#   NEXT_PUBLIC_SUPABASE_ANON_KEY -> anon public key                                        [wajib]
#   NEXT_PUBLIC_WA_NUMBER  -> nomor WA admin (628… tanpa + / 0)
#   NEXT_PUBLIC_STORE_NAME -> nama toko (opsional)
#   NEXT_PUBLIC_CONTACT_EMAIL -> email kontak di footer (default rizqyutamashop@gmail.com)
#   NEXT_PUBLIC_INSTAGRAM_URL / LINKEDIN_URL / SHOPEE_URL / TIKTOK_URL / TOKOPEDIA_URL / BLIBLI_URL -> link sosmed & marketplace (kosong = pakai default di lib/social.ts)

# Sekali saja: jalankan supabase/schema.sql di Supabase SQL Editor
# (schema + seed + RLS read-only publik untuk role anon).

npm run dev                    # http://localhost:3000
npm run build && npm run preview   # build static -> out/, lalu serve lokal
```

## Deploy ke Cloudflare Pages

1. Push repo ke GitHub, lalu di Cloudflare Dashboard buat **Pages → Connect to Git**.
2. Isi setelan build:
   - **Framework preset:** `Next.js (Static HTML Export)` — atau **None**
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   - **Environment variables (Production *dan* Preview):**
     - `NEXT_PUBLIC_SUPABASE_URL` — Project URL Supabase
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon public key
     - `NEXT_PUBLIC_WA_NUMBER` — nomor WA admin
     - `NEXT_PUBLIC_STORE_NAME` — nama toko (opsional)
     - `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_LINKEDIN_URL`, `NEXT_PUBLIC_SHOPEE_URL`, `NEXT_PUBLIC_TIKTOK_URL`, `NEXT_PUBLIC_TOKOPEDIA_URL`, `NEXT_PUBLIC_BLIBLI_URL` — link sosmed & marketplace (opsional)
3. Save & Deploy. Cloudflare menjalankan `next build` lalu menyajikan folder `out/`.

> **Penting:** nilai `NEXT_PUBLIC_*` di-bake saat build. Setiap kali env berubah, jalankan build ulang. Perubahan **data** di Supabase langsung tampil tanpa redeploy karena dibaca di browser.

## Struktur

```
app/                  route; server component hanya shell + metadata
  page.tsx                katalog → Suspense → HomeBrowser (client)
  produk/page.tsx         detail produk (slug via query param) → ProductDetailClient
  kategori/page.tsx       semua kategori → CategoryBrowser
  keranjang/page.tsx      keranjang → CartPage
  checkout/page.tsx       checkout → CheckoutPage
components/
  Header.tsx / Footer.tsx / BottomNav.tsx
  ProductCard.tsx / AddToCartWidget.tsx / Stars.tsx / DataError.tsx / LoadingBlock.tsx
  home/BannerSlider.tsx / Testimonials.tsx / HomeSkeleton.tsx
  home/HomeBrowser.tsx    (client) fetch SWR + filter via query param
  home/HomeView.tsx       presentasional
  filters/FilterPanel.tsx (client) panel filter kategori/harga/urutkan
  product/ProductGallery.tsx (client) galeri foto + video
  product/ProductDetailClient.tsx (client) detail produk
  CategoryBrowser.tsx     (client) daftar kategori + jumlah produk
  chat/ChatWidget.tsx     (client) chatbot FAQ
  cart/CartView.tsx / cart/CartPage.tsx (client)
  checkout/CheckoutForm.tsx / checkout/CheckoutPage.tsx (client)
context/CartContext.tsx   keranjang berbasis localStorage (React Context)
lib/
  supabase.ts             klien browser Supabase (lazy)
  api.ts                  mapper + hooks SWR (banners, categories, products, …)
  filter.ts               logika filter/urutkan produk (client)
  faq.ts                  data FAQ chatbot
  types.ts                tipe Category/Product/Banner/Testimonial/Media/FilterState
  format.ts               format Rp, wa.me, build pesan order
supabase/schema.sql       schema + seed + RLS publik (anon read-only)
```
