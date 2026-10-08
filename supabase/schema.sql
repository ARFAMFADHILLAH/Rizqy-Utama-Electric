-- ============================================================
-- Rizqy Utama Electric — Schema + Seed untuk Supabase (Postgres)
-- Jalankan sekali di: Supabase Dashboard -> SQL Editor -> Run
-- Idempotent: boleh dijalankan ulang tanpa merusak data.
-- ============================================================

-- Tabel pengguna (akun admin dipakai panel admin di iterasi berikutnya)
create table if not exists users (
  id                bigint generated always as identity primary key,
  name              text not null,
  email             text not null unique,
  email_verified_at timestamptz,
  password          text not null,
  remember_token    text,
  is_admin          boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Kategori produk
create table if not exists categories (
  id         bigint generated always as identity primary key,
  name       text not null,
  slug       text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Produk
create table if not exists products (
  id          bigint generated always as identity primary key,
  category_id bigint not null references categories (id) on delete cascade,
  name        text not null,
  slug        text not null unique,
  sku         text unique,
  description text,
  price       integer not null check (price >= 0),
  stock       integer not null default 0 check (stock >= 0),
  image       text,
  featured    boolean not null default false,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_products_category_id on products (category_id);
create index if not exists idx_products_is_active   on products (is_active);

-- ============================================================
-- Seed: 6 kategori
-- ============================================================
insert into categories (name, slug) values
  ('Kabel',      'kabel'),
  ('MCB',        'mcb'),
  ('Saklar',     'saklar'),
  ('Lampu LED',  'lampu-led'),
  ('Pipa',       'pipa'),
  ('Alat Ukur',  'alat-ukur')
on conflict (slug) do nothing;

-- ============================================================
-- Seed: 12 produk contoh (data contoh — edit sesuai katalog asli)
-- ============================================================
insert into products (category_id, name, slug, sku, description, price, stock, featured)
select c.id, v.name, v.slug, v.sku, v.description, v.price, v.stock, v.featured
from (
  values
    ('kabel',      'Kabel NYA 3x2,5 mm (roll 100 m)', 'kabel-nya-3x2-5mm-roll-100m', 'KB-NYA-325',
     'Kabel tembaga NYA untuk instalasi listrik rumah, 3 inti 2,5 mm2, per roll 100 meter.',
     465000, 25, true),
    ('kabel',      'Kabel NYM 2x1,5 mm (roll 100 m)', 'kabel-nym-2x1-5mm-roll-100m', 'KB-NYM-215',
     'Kabel NYM berlapis ganda, aman untuk instalasi permanen dalam dinding. Roll 100 meter.',
     575000, 18, false),
    ('mcb',        'MCB 1-Pole 10A', 'mcb-1-pole-10a', 'MC-1P-10A',
     'Miniature circuit breaker satu pole 10 ampere, melindungi instalasi dari beban lebih & hubung singkat.',
     62000, 80, true),
    ('mcb',        'MCB 2-Pole 32A', 'mcb-2-pole-32a', 'MC-2P-32A',
     'MCB dua pole 32 ampere untuk panel distribusi, pemutus arus utama.',
     185000, 35, false),
    ('saklar',     'Saklar Tunggal + Stop Kontak', 'saklar-tunggal-stop-kontak', 'SK-TG-01',
     'Saklar tunggal satu titik dengan stop kontak terpasang, bahan bakar awet.',
     48000, 120, false),
    ('saklar',     'Saklar Ganda (Double Switch)', 'saklar-ganda-double-switch', 'SK-GD-02',
     'Saklar ganda untuk mengendalikan dua titik lampu dari satu tempat.',
     57000, 75, false),
    ('lampu-led',  'Lampu LED 9W Putih', 'lampu-led-9w-putih', 'LD-9W-WH',
     'Lampu LED 9 watt cahaya putih, hemat energi, tahan lama, fitting E27.',
     24000, 200, true),
    ('lampu-led',  'Lampu LED Panel 18W', 'lampu-led-panel-18w', 'LD-PN-18W',
     'Lampu LED panel 18 watt untuk plafon, cahaya merata dan tidak menyilaukan.',
     86000, 40, false),
    ('pipa',       'Pipa Conduit 20 mm (batang 4 m)', 'pipa-conduit-20mm-4m', 'PP-CD-20',
     'Pipa conduit PVC 20 mm untuk kabel listrik, batang 4 meter, mudah ditekuk.',
     33000, 150, false),
    ('pipa',       'Pipa PVC AW 1/2 inci (batang 4 m)', 'pipa-pvc-aw-1-2-inci-4m', 'PP-AW-12',
     'Pipa PVC AW 1/2 inci untuk instalasi air dan kabel, batang 4 meter.',
     44000, 90, false),
    ('alat-ukur',  'Multimeter Digital', 'multimeter-digital', 'AU-MMD-01',
     'Multimeter digital untuk mengukur tegangan, arus, dan resistansi. Layar LCD.',
     175000, 20, true),
    ('alat-ukur',  'Tang Ampere Clamp', 'tang-ampere-clamp', 'AU-TAC-01',
     'Clamp meter untuk mengukur arus AC tanpa memutus kabel, hingga 600A.',
     385000, 12, false)
) as v (cat_slug, name, slug, sku, description, price, stock, featured)
join categories c on c.slug = v.cat_slug
on conflict (slug) do nothing;

-- Admin bawaan untuk panel admin (iterasi berikutnya) — password di-hash bcrypt,
-- ganti setelah login pertama kali.
insert into users (name, email, password, is_admin)
values ('Admin', 'admin@rizqyutama.com', '$2b$10$RBXpIGZWzQj0W3wXVJI0Les50ANNI4PangHvY7tayjo86uAj2SFJO', true)
on conflict (email) do nothing;

-- ============================================================
-- Iterasi tampilan pelanggan: rating/terjual, media, banner, testimoni
-- ============================================================

-- Rating & jumlah terjual (diisi seed dulu; nanti bisa dari order/ulasan asli)
alter table products add column if not exists rating       numeric(2,1) not null default 0;
alter table products add column if not exists rating_count integer      not null default 0;
alter table products add column if not exists sold         integer      not null default 0;

-- Galeri media produk (foto + video)
create table if not exists product_media (
  id         bigint generated always as identity primary key,
  product_id bigint not null references products (id) on delete cascade,
  type       text not null check (type in ('image', 'video')),
  url        text not null,
  sort       integer not null default 0,
  created_at timestamptz not null default now(),
  unique (product_id, url)
);

create index if not exists idx_product_media_product on product_media (product_id);

-- Banner slider di halaman depan
create table if not exists banners (
  id         bigint generated always as identity primary key,
  title      text not null,
  subtitle   text,
  image_url  text,
  link_url   text,
  sort       integer not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- Testimoni pelanggan
create table if not exists testimonials (
  id         bigint generated always as identity primary key,
  name       text not null,
  city       text,
  rating     integer not null default 5 check (rating between 1 and 5),
  message    text not null,
  avatar_url text,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- Thumbnail produk (URL eksternal contoh; ganti dengan foto asli kapan pun)
update products
   set image = 'https://picsum.photos/seed/' || slug || '/600/600'
 where image is null
   and slug in (
     'kabel-nya-3x2-5mm-roll-100m', 'kabel-nym-2x1-5mm-roll-100m',
     'mcb-1-pole-10a', 'mcb-2-pole-32a',
     'saklar-tunggal-stop-kontak', 'saklar-ganda-double-switch',
     'lampu-led-9w-putih', 'lampu-led-panel-18w',
     'pipa-conduit-20mm-4m', 'pipa-pvc-aw-1-2-inci-4m',
     'multimeter-digital', 'tang-ampere-clamp'
   );

-- Rating & terjual contoh (hanya diisi saat masih 0)
update products
   set rating = v.rating, rating_count = v.rating_count, sold = v.sold
  from (values
    ('kabel-nya-3x2-5mm-roll-100m', 4.8, 42, 320),
    ('kabel-nym-2x1-5mm-roll-100m', 4.7, 28, 210),
    ('mcb-1-pole-10a',              4.9, 65, 540),
    ('mcb-2-pole-32a',              4.6, 21, 180),
    ('saklar-tunggal-stop-kontak',  4.7, 38, 410),
    ('saklar-ganda-double-switch',  4.5, 19, 250),
    ('lampu-led-9w-putih',          4.8, 120, 980),
    ('lampu-led-panel-18w',         4.7, 44, 300),
    ('pipa-conduit-20mm-4m',        4.6, 25, 220),
    ('pipa-pvc-aw-1-2-inci-4m',     4.5, 17, 160),
    ('multimeter-digital',          4.9, 31, 145),
    ('tang-ampere-clamp',           4.8, 22, 90)
  ) as v (slug, rating, rating_count, sold)
 where products.slug = v.slug and products.rating = 0 and products.sold = 0;

-- Galeri: 3 foto per produk (contoh)
insert into product_media (product_id, type, url, sort)
select p.id, 'image',
       'https://picsum.photos/seed/' || p.slug || '-' || g.n || '/800/800', g.n
  from products p
  cross join generate_series(1, 3) as g (n)
 where p.slug in (
   'kabel-nya-3x2-5mm-roll-100m', 'kabel-nym-2x1-5mm-roll-100m',
   'mcb-1-pole-10a', 'mcb-2-pole-32a',
   'saklar-tunggal-stop-kontak', 'saklar-ganda-double-switch',
   'lampu-led-9w-putih', 'lampu-led-panel-18w',
   'pipa-conduit-20mm-4m', 'pipa-pvc-aw-1-2-inci-4m',
   'multimeter-digital', 'tang-ampere-clamp'
 )
on conflict (product_id, url) do nothing;

-- Galeri: contoh video untuk beberapa produk
insert into product_media (product_id, type, url, sort)
select p.id, 'video',
       'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 0
  from products p
 where p.slug in (
   'mcb-1-pole-10a', 'lampu-led-9w-putih',
   'multimeter-digital', 'kabel-nya-3x2-5mm-roll-100m'
 )
on conflict (product_id, url) do nothing;

-- Banner slider (hanya bila belum ada)
insert into banners (title, subtitle, image_url, link_url, sort)
select * from (values
  ('Diskon Kabel & MCB', 'Harga grosir untuk kebutuhan proyek instalasi',
   'https://picsum.photos/seed/banner-kabel/1200/420', '/?kategori=kabel', 1),
  ('Lampu LED Hemat Energi', 'Cahaya terang, tagihan listrik lebih ringan',
   'https://picsum.photos/seed/banner-lampu/1200/420', '/?kategori=lampu-led', 2),
  ('Alat Ukur Profesional', 'Multimeter & clamp meter untuk teknisi',
   'https://picsum.photos/seed/banner-alat/1200/420', '/?kategori=alat-ukur', 3)
) as t (title, subtitle, image_url, link_url, sort)
where not exists (select 1 from banners);

-- Testimoni pelanggan (hanya bila belum ada)
insert into testimonials (name, city, rating, message, avatar_url)
select * from (values
  ('Budi Santoso',   'Bandung',  5, 'Barang original, pengiriman cepat. Kabel dan MCB-nya rapi, cocok buat proyek rumah.', 'https://i.pravatar.cc/80?img=12'),
  ('Siti Aminah',    'Bekasi',   5, 'Harga grosirnya bersaing. Beli lampu LED banyak, semua nyala dengan baik.', 'https://i.pravatar.cc/80?img=45'),
  ('Pak Rudi',       'Jakarta',  4, 'Respons WA cepat, stok lengkap. Bantu rekomendasi MCB sesuai kebutuhan.', 'https://i.pravatar.cc/80?img=33'),
  ('Dewi Lestari',   'Depok',    5, 'Pesanan datang tepat waktu, packing aman. Pasti order lagi untuk toko saya.', 'https://i.pravatar.cc/80?img=20'),
  ('Andi Pratama',   'Tangerang',5, 'Alat ukur bagus dan terkalibrasi. Pelayanan ramah, recommended.', 'https://i.pravatar.cc/80?img=52'),
  ('Toko Jaya Listrik','Bogor',  4, 'Supplier andalan untuk kebutuhan harian toko. Harga dan stok konsisten.', 'https://i.pravatar.cc/80?img=8')
) as t (name, city, rating, message, avatar_url)
where not exists (select 1 from testimonials);
