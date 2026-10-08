# Rizqy Utama Electric — Online Store (Next.js + Supabase)

Website toko material listrik **khusus tampilan pelanggan** (pembeli): katalog produk, keranjang belanja, dan checkout via WhatsApp. Panel admin menyusul di folder terpisah.

- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · pg
- **Database:** Supabase Postgres (schema + seed: [`supabase/schema.sql`](supabase/schema.sql)) — MySQL siap dipakai lagi lewat env (`SUPABASE_DB_URL` dikosongkan → fallback mysql2)
- **Checkout:** kirim ringkasan order ke WhatsApp (nomor dari `NEXT_PUBLIC_WA_NUMBER`)
- **Desain:** navy `#0A1F44` · orange `#FF7A00` · putih

## Fitur (Halaman Pelanggan)

| Rute | Fungsi |
|------|--------|
| `/` | Katalog: hero, pencarian (`?q`), filter kategori (`?kategori`), grid produk + badge unggulan/stok |
| `/produk/[slug]` | Detail produk: harga, stok, deskripsi, tambah ke keranjang (dengan pilih jumlah), produk sejenis |
| `/kategori` | Semua kategori + jumlah produk |
| `/keranjang` | Kelola keranjang (`localStorage`): ubah qty, hapus, kosongkan, subtotal |
| `/checkout` | Form pemesan (nama/HP/alamat/catatan) → buka `wa.me` berisi ringkasan order |

> Panel `/admin` belum ada — disusul di iterasi berikutnya. Prompt siap pakai untuk membuatnya ada di [`docs/ADMIN-PROMPT.md`](docs/ADMIN-PROMPT.md).

## Menjalankan

```sh
npm install

# Isi .env.local:
#   SUPABASE_DB_URL -> koneksi Supabase Postgres (session pooler)
#   MYSQL_*         -> cadangan; dipakai jika SUPABASE_DB_URL kosong
#   NEXT_PUBLIC_WA_NUMBER -> nomor WA admin (628… tanpa + / 0)

npm run dev        # http://localhost:3000
# atau produksi
npm run build && npm start
```

## Struktur

```
app/                  halaman (server component, query langsung MySQL via lib/db.ts)
  page.tsx                katalog
  produk/[slug]/page.tsx  detail produk
  kategori/page.tsx       semua kategori
  keranjang/page.tsx      keranjang
  checkout/page.tsx       checkout
components/
  Header.tsx / Footer.tsx
  ProductCard.tsx / AddToCartWidget.tsx (stepper jumlah + tambah)
  cart/CartView.tsx       (client) isi keranjang
  checkout/CheckoutForm.tsx (client) form + buat link wa.me
context/CartContext.tsx   keranjang berbasis localStorage (React Context)
lib/
  db.ts                   pool pg (Supabase) / mysql2 + helper query<T>
  types.ts                tipe Category & Product
  format.ts               format Rp, wa.me, build pesan order
```

## Database

Schema Supabase (Postgres) dibuat dari ERD MySQL yang ada — jalankan [`supabase/schema.sql`](supabase/schema.sql) sekali di SQL Editor Supabase:

- `categories(id, name, slug)`
- `products(id, category_id, name, slug, sku, description, price, stock, image, featured, is_active)`
- Terisi 6 kategori + 12 produk contoh + 1 admin (`users.is_admin`) untuk kebutuhan panel admin nanti.