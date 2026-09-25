# Prompt — Bangun Panel Admin Rizqy Utama Electric

> Salin & tempel prompt ini ke asisten / agen coding untuk membuat panel admin
> di folder terpisah. Sesuaikan angka di `[KURUNG]` jika perlu.

---

Kamu akan membangun **panel admin** untuk toko online **Rizqy Utama Electric** yang sudah berjalan. Panel admin ini **folder terpisah** dan **tidak boleh mengubah** halaman pelanggan yang sudah ada (`/`, `/produk/[slug]`, `/keranjang`, `/checkout`, `/kategori`).

## Konteks proyek (wajib dipatuhi)

- Stack: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + `mysql2` (**tanpa ORM/Prisma**).
- Database: MySQL portable di `127.0.0.1:3306`, db `rizqyutamaelectric`, user `root`, tanpa password. Tabel **tidak dimigrate** — pakai existing.
- Akses DB hanya lewat `lib/db.ts` → `query<T>(sql, params)`. Semua halaman yang baca data wajib `export const dynamic = "force-dynamic"`.
- `params`/`searchParams` di halaman adalah **Promise** → wajib `await`.
- Keranjang pelanggan memakai `localStorage` (jangan disentuh).
- Nomor WA toko: `NEXT_PUBLIC_WA_NUMBER`. Format harga/WA ada di `lib/format.ts`.
- Design system sudah ada: warna `navy-*` dan `brand-*` (orange) di `app/globals.css`. Pakai token yang sama.
- Commands: `npm run dev`, `npm run build`, `npm run lint`. Build & lint harus lolos.

## Struktur database (sudah ada)

```
users
  id, name, email(unique), email_verified_at, password, remember_token,
  is_admin (boolean, default false), created_at, updated_at

categories
  id, name, slug(unique), created_at, updated_at

products
  id, category_id (FK->categories.id, ON DELETE CASCADE),
  name, slug(unique), sku(nullable, unique), description(nullable text),
  price (int), stock (int default 0), image (nullable string, path/URL),
  featured (boolean default false), is_active (boolean default true),
  created_at, updated_at
```

Akun admin seed yang sudah ada: email `admin@rizqyutama.com`, password `admin123` (ada di tabel `users` dengan `is_admin = 1`).

## Fitur yang harus dibuat

1. **Autentikasi admin**
   - Halaman login (`/admin/login`) memakai email + password terhadap tabel `users`.
   - Cek `is_admin = 1`, selain itu tolak.
   - Pakai cookie/session (mis. `next/headers` cookies + token yang aman), REST-API route handlers di `app/admin/api/...` atau server actions.
   - Logout.
2. **Middleware/guard**: semua rute `/admin/*` (di luar login) menolak yang bukan admin — alihkan ke `/admin/login`.

3. **Dashboard** (`/admin`): kartu ringkasan Jumlah Produk, Produk Aktif, Kategori, Stok Habis + daftar produk terakhir diubah.

4. **Produk CRUD** (`/admin/produk`):
   - List (tabel: produk, kategori, harga, stok, status aktif, aksi).
   - Tambah/Edit form: nama, slug (auto dari nama + unik), sku (unik, opsional), kategori, harga (int), stok (int), deskripsi, gambar, featured (checkbox), is_active (checkbox).
   - Upload gambar: simpan ke `public/uploads/` (validasi jpeg/png/webp/gif, max 2 MB), path disimpan di kolom `image`. Boleh juga isi `image_url` sebagai alternatif.
   - Toggle aktif/nonaktif, hapus (dengan konfirmasi).
5. **Kategori CRUD** (`/admin/kategori`):
   - List (nama, slug, jumlah produk), tambah (slug auto + unik), hapus (tidak boleh jika masih ada produk).
6. **Satu layout admin** lengkap: header/sidebar mini (Dashboard, Produk, Kategori, Lihat Toko, Logout), responsif, konsisten dengan tema navy/orange.

## Larangan

- Jangan sentuh: `components/Header.tsx`, `components/Footer.tsx`, `components/ProductCard.tsx`, `components/AddToCartWidget.tsx`, `components/cart/*`, `components/checkout/*`, `context/CartContext.tsx`, `lib/db.ts`, `lib/format.ts`, semua halaman publik.
- Jangan tambah ORM baru, jangan ubah koneksi DB, jangan ubah `.env.local` di luar menambah variabel baru (prefix `ADMIN_`/`SESSION_` bila perlu, dan update `.env.example`).

## Kriteria selesai

- [ ] `npm run build` sukses, `npm run lint` bersih.
- [ ] Login/logout berfungsi; non-admin dan tamu ditolak dari `/admin/*`.
- [ ] Dashboard menampilkan angka yang benar dari MySQL.
- [ ] CRUD produk & kategori berfungsi end-to-end (termasuk upload gambar ke `public/uploads/`); produk yang dinonaktifkan langsung hilang dari halaman publik.
- [ ] Tulis catatan singkat cara menjalankan & kredensial default di `docs/ADMIN.md`.

Selamat mengerjakan! 🚀