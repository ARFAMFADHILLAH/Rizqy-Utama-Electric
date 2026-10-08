# ERD — Rizqy Utama Electric (Supabase Postgres, mengikuti skema MySQL)

Tabel dibuat oleh implementasi sebelumnya (MySQL) dan direplikasi di Supabase Postgres lewat `supabase/schema.sql` (identity auto-increment, `boolean`, `timestamptz`).

```
users
  id            BIGINT UNSIGNED PK auto increment
  name          VARCHAR(255)
  email         VARCHAR(255) unique
  email_verified_at  timestamp null
  password      VARCHAR(255)
  remember_token     VARCHAR(100) null
  is_admin      BOOLEAN default false
  created_at / updated_at

categories
  id            BIGINT UNSIGNED PK auto increment
  name          VARCHAR(255)
  slug          VARCHAR(255) unique
  created_at / updated_at

products
  id            BIGINT UNSIGNED PK auto increment
  category_id   FK -> categories.id (ON DELETE CASCADE)
  name          VARCHAR(255)
  slug          VARCHAR(255) unique
  sku           VARCHAR(100) null unique
  description   TEXT null
  price         INT UNSIGNED
  stock         INT UNSIGNED default 0
  image         VARCHAR(255) null         (path/URL gambar produk)
  featured      BOOLEAN default false
  is_active     BOOLEAN default true
  created_at / updated_at

Relasi:
  categories 1 --- * products
  products.category_id references categories.id
```

Catatan:
- `is_active=0` → produk disembunyikan di katalog.
- `users.is_admin=1` → akun admin untuk panel admin (dibuat di iterasi berikutnya).
- Keranjang belanja **tidak** disimpan di DB — memakai `localStorage` browser.
- Order **tidak** dipersistenkan — dikirim langsung sebagai pesan WhatsApp (`orders` bisa ditambahkan bila nanti butuh riwayat).