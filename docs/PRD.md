# PRD — Rizqy Utama Electric (versi Next.js + Supabase Postgres)

## 1. Ringkasan
Toko online material listrik (kabel, MCB, saklar, lampu LED, pipa, alat ukur). Iterasi ini **fokus halaman pelanggan**: katalog → keranjang → checkout via WhatsApp. Panel admin dibuat menyusul di folder terpisah.

## 2. Sasaran
- Lokakarya electronik simple, user friendly, mudah dipahami pembeli.
- Checkout tanpa payment gateway — order dikirim sebagai pesan WhatsApp.
- Tampilan bersih: navy / orange / putih, format harga & stok jelas.

## 3. Non-Goal (iterasi ini)
- Tidak ada halaman admin (menyusul).
- Tidak ada akun/login pelanggan, payment gateway, ongkir otomatis.
- Tidak ada migrasi schema — skema Supabase dibuat mengikuti tabel MySQL yang sudah ada (`supabase/schema.sql`).

## 4. Alur Pelanggan
1. **Katalog** (`/`) — lihat produk, filter kategori, cari.
2. **Kategori** (`/kategori`) — menjelajah semua kategori + jumlah produk.
3. **Detail** (`/produk/[slug]`) — harga, stok, deskripsi, pilih jumlah, tambah ke keranjang.
4. **Keranjang** (`/keranjang`) — ubah jumlah, hapus, lihat subtotal. Tersimpan di `localStorage` (tidak butuh login/server state).
5. **Checkout** (`/checkout`) — isi nama, No. HP, alamat, catatan → buka `wa.me/<nomor>` berisi pesan order.

## 5. Aturan Bisnis
- Produk nonaktif tidak muncul di katalog.
- Jumlah keranjang dibatasi stok; stok 0 → tombol tambah dinonaktifkan & label "Stok habis".
- Harga integer Rupiah; format `Rp 1.000.000`.

## 6. Desain
- Navy `#0A1F44` (header/hero/panel ringkasan), orange `#FF7A00` (CTA), putih.
- Responsif; kartu produk 2–4 kolom.

## 7. Data
- Database: Supabase Postgres (`SUPABASE_DB_URL`) — schema + seed 6 kategori & 12 produk contoh di `supabase/schema.sql`. MySQL (`MYSQL_*`) cadangan, aktif bila `SUPABASE_DB_URL` kosong.
- Konfigurasi: `NEXT_PUBLIC_WA_NUMBER` (nomor WA admin), `SUPABASE_DB_URL`, `MYSQL_*`.

## 8. Kriteria Selesai (verifikasi)
- [x] `npm run build` sukses, semua halaman `200`
- [x] Filter kategori (`?kategori=kabel`) & pencarian (`?q`) bekerja
- [x] Halaman semua kategori (`/kategori`) dengan jumlah produk
- [x] Detail produk menampilkan harga/stok/SKU/deskripsi + pilih jumlah
- [x] Keranjang berfungsi via localStorage, total benar
- [x] Checkout menghasilkan link `wa.me` dengan ringkasan order
- [x] Empty state bila tidak ada hasil / keranjang kosong