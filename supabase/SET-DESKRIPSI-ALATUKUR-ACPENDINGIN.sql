-- ============================================================
-- Template deskripsi produk ala marketplace (Markdown)
-- Jalankan di Supabase Dashboard -> SQL Editor
-- Hanya mengisi produk yang description NULL/empty & masih aktif
-- AMAN: tidak menyentuh produk yang sudah punya deskripsi
-- ============================================================

-- Preview produk yang akan diupdate
select p.id, p.name, p.slug, p.sku, c.name as kategori
from products p
join categories c on c.id = p.category_id
where (p.description is null or trim(p.description) = '')
  and p.is_active = true
  and c.slug in ('alat-ukur', 'ac-pendingin')
order by c.slug, p.id;

-- ALAT UKUR: template deskripsi
update products p
set description = 
  '## ' || p.name || E'\n\n' ||
  'Peralatan ukur andal untuk kebutuhan teknisi listrik. Cocok digunakan untuk pengecekan instalasi, perawatan, maupun troubleshooting di lapangan.\n\n' ||
  '### Fitur Utama\n' ||
  '- **Akurat & Stabil** – Hasil pengukuran konsisten untuk berbagai kebutuhan.\n' ||
  '- **Desain Praktis** – Ringkas, ringan, dan mudah dibawa.\n' ||
  '- **Tahan Lama** – Dibuat untuk pemakaian rutin di lapangan.\n' ||
  '- **Pengoperasian Mudah** – Cocok untuk pemula maupun profesional.\n\n' ||
  '### Spesifikasi Singkat\n' ||
  '| Item | Keterangan |\n' ||
  '|---|---|\n' ||
  COALESCE('|' || 'SKU' || '|' || COALESCE(p.sku,'-') || '|\n', '') ||
  '|' || 'Kategori' || '|' || 'Alat Ukur' || '|\n' ||
  '|' || 'Kondisi' || '|' || 'Baru' || '|\n\n' ||
  '### Catatan\n' ||
  '- Harga sudah termasuk perhitungan toko.\n' ||
  '- Stok dapat berubah sewaktu-waktu.\n' ||
  '- Untuk ketersediaan & garansi, silakan tanya via WhatsApp.'
from categories c
where c.id = p.category_id
  and c.slug = 'alat-ukur'
  and p.is_active = true
  and (p.description is null or trim(p.description) = '');

-- AC & PENDINGIN: template deskripsi
update products p
set description = 
  '## ' || p.name || E'\n\n' ||
  'Produk pendingin berkualitas untuk menunjang kenyamanan ruang. Dirancang untuk efisiensi, kehandalan, dan kemudahan perawatan.\n\n' ||
  '### Fitur Utama\n' ||
  '- **Performa Andal** – Pendinginan merata untuk berbagai ukuran ruangan.\n' ||
  '- **Efisien Energi** – Dirancang untuk penggunaan yang lebih efisien.\n' ||
  '- **Pengoperasian Nyaman** – Kontrol praktis dan perawatan relatif mudah.\n' ||
  '- **Konstruksi Kokoh** – Cocok untuk pemakaian jangka panjang.\n\n' ||
  '### Spesifikasi Singkat\n' ||
  '| Item | Keterangan |\n' ||
  '|---|---|\n' ||
  COALESCE('|' || 'SKU' || '|' || COALESCE(p.sku,'-') || '|\n', '') ||
  '|' || 'Kategori' || '|' || 'AC & Pendingin' || '|\n' ||
  '|' || 'Kondisi' || '|' || 'Baru' || '|\n\n' ||
  '### Catatan Pembelian\n' ||
  '- **Konsultasi Gratis** – Bantu hitung kebutuhan BTU sesuai luas ruangan via WhatsApp.\n' ||
  '- **Instalasi** – Bisa kami arahkan untuk kebutuhan pemasangan.\n' ||
  '- **Stok & Harga** – Dapat berubah sewaktu-waktu.\n' ||
  '- Untuk detail teknis & ketersediaan, silakan hubungi kami melalui WhatsApp.'
from categories c
where c.id = p.category_id
  and c.slug = 'ac-pendingin'
  and p.is_active = true
  and (p.description is null or trim(p.description) = '');

-- Cek hasil
select p.id, p.name, c.slug as kategori, left(p.description, 80) as deskripsi_preview
from products p
join categories c on c.id = p.category_id
where p.is_active = true
  and c.slug in ('alat-ukur', 'ac-pendingin')
  and p.description is not null
order by c.slug, p.id
limit 10;
