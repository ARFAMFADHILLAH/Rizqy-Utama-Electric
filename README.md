# Rizqy Utama Electric — Online Store (Next.js + Supabase)

Website toko material listrik **khusus tampilan pelanggan** (pembeli): katalog produk, keranjang belanja, dan checkout via WhatsApp. Panel admin menyusul di folder terpisah.

- **Stack:** Next.js 16 (App Router, **static export**) · React 19 · TypeScript · Tailwind CSS 4 · pg
- **Database:** Supabase Postgres (schema + seed: [`supabase/schema.sql`](supabase/schema.sql)) — MySQL siap dipakai lagi lewat env (`SUPABASE_DB_URL` dikosongkan → fallback mysql2)
- **Deploy:** Cloudflare Pages (HTML statis murni, output `out/`) — data di-*snapshot* saat `next build`
- **Checkout:** kirim ringkasan order ke WhatsApp (nomor dari `NEXT_PUBLIC_WA_NUMBER`)
- **Desain:** navy `#0A1F44` · orange `#FF7A00` · putih

## Fitur (Halaman Pelanggan)

| Rute | Fungsi |
|------|--------|
| `/` | Katalog: banner slider, pencarian (`?q`), filter kategori (multi-pilih) + rentang harga + urutkan, grid produk, testimoni, chatbot FAQ |
| `/produk/[slug]` | Detail produk: galeri foto + video, rating & jumlah terjual, harga, stok, deskripsi, tambah ke keranjang, produk sejenis |
| `/kategori` | Semua kategori + jumlah produk |
| `/keranjang` | Kelola keranjang (`localStorage`): ubah qty, hapus, kosongkan, subtotal |
| `/checkout` | Form pemesan (nama/HP/alamat/catatan) → buka `wa.me` berisi ringkasan order |

Fitur global: **bottom navigation** mobile, **chatbot FAQ** (rule-based + lanjut ke WhatsApp), keranjang tersimpan di `localStorage`.

> Panel `/admin` belum ada — disusul di iterasi berikutnya. Prompt siap pakai untuk membuatnya ada di [`docs/ADMIN-PROMPT.md`](docs/ADMIN-PROMPT.md).

## Menjalankan

```sh
npm install

# Isi .env.local:
#   SUPABASE_DB_URL -> koneksi Supabase Postgres (session pooler)  [wajib saat build]
#   MYSQL_*         -> cadangan; dipakai jika SUPABASE_DB_URL kosong
#   NEXT_PUBLIC_WA_NUMBER  -> nomor WA admin (628… tanpa + / 0)
#   NEXT_PUBLIC_STORE_NAME -> nama toko (opsional)

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
     - `SUPABASE_DB_URL` — koneksi Supabase Postgres (session pooler)
     - `NEXT_PUBLIC_WA_NUMBER` — nomor WA admin
     - `NEXT_PUBLIC_STORE_NAME` — nama toko (opsional)
3. Save & Deploy. Cloudflare menjalankan `next build` lalu menyajikan folder `out/`.

> **Penting:** karena HTML-nya statis, data produk diambil sekali saat build. Setiap kali data di Supabase berubah, jalankan **Retry deployment** (atau push commit baru) agar perubahan ikut terbit.

## Struktur

```
app/                  route (server component dieksekusi saat build)
  page.tsx                katalog (fetch data) + Suspense → HomeBrowser
  produk/[slug]/page.tsx  detail produk (generateStaticParams)
  kategori/page.tsx       semua kategori
  keranjang/page.tsx      keranjang
  checkout/page.tsx       checkout
components/
  Header.tsx / Footer.tsx / BottomNav.tsx
  ProductCard.tsx / AddToCartWidget.tsx / Stars.tsx
  home/BannerSlider.tsx / Testimonials.tsx
  home/HomeBrowser.tsx    (client) filter via query param
  home/HomeView.tsx       presentasional (dipakai server fallback + client)
  filters/FilterPanel.tsx (client) panel filter kategori/harga/urutkan
  product/ProductGallery.tsx (client) galeri foto + video
  chat/ChatWidget.tsx     (client) chatbot FAQ
  cart/CartView.tsx       (client) isi keranjang
  checkout/CheckoutForm.tsx (client) form + buat link wa.me
context/CartContext.tsx   keranjang berbasis localStorage (React Context)
lib/
  db.ts                   pool pg (Supabase) / mysql2 + helper query<T>
  filter.ts               logika filter/urutkan produk (client)
  faq.ts                  data FAQ chatbot
  types.ts                tipe Category/Product/Banner/Testimonial/Media/FilterState
  format.ts               format Rp, wa.me, build pesan order
```


## Database

Schema Supabase (Postgres) dibuat dari ERD MySQL yang ada — jalankan [`supabase/schema.sql`](supabase/schema.sql) sekali di SQL Editor Supabase:

- `categories(id, name, slug)`
- `products(id, category_id, name, slug, sku, description, price, stock, image, featured, is_active)`
- Terisi 6 kategori + 12 produk contoh + 1 admin (`users.is_admin`) untuk kebutuhan panel admin nanti.