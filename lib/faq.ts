export type FaqItem = {
  q: string;
  a: string;
};

/** Data FAQ chatbot — cukup edit di sini untuk mengubah pertanyaan/jawaban. */
export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Bagaimana cara order?",
    a: "Pilih produk → masukkan ke keranjang → buka halaman Checkout → isi data pemesan → klik “Kirim Order via WhatsApp”. Pesanan otomatis terkirim ke admin untuk konfirmasi.",
  },
  {
    q: "Apakah stok barang tersedia?",
    a: "Stok yang tampil di setiap produk adalah stok terkini. Jika stok 0, produk ditandai “Stok habis”. Untuk jumlah besar silakan konfirmasi via WhatsApp.",
  },
  {
    q: "Bisa harga grosir / reseller?",
    a: "Bisa. Kami melayani pembelian grosir untuk toko, kontraktor, dan proyek. Hubungi WhatsApp admin untuk penawaran harga khusus.",
  },
  {
    q: "Metode pembayaran apa saja?",
    a: "Pembayaran dibahas saat konfirmasi pesanan via WhatsApp — umumnya transfer bank atau bayar di tempat (untuk area tertentu).",
  },
  {
    q: "Berapa lama pengiriman?",
    a: "Untuk Jabodetabek biasanya 1–2 hari kerja. Luar kota 2–5 hari kerja tergantung ekspedisi. Bisa juga ambil di toko.",
  },
  {
    q: "Apakah bisa kirim luar kota?",
    a: "Ya, kami melayani pengiriman luar kota melalui ekspedisi. Ongkos kirim menyesuaikan berat dan tujuan.",
  },
  {
    q: "Jam buka toko?",
    a: "Toko buka Senin–Sabtu 08.00–17.00. Namun pesan WhatsApp bisa masuk kapan saja dan akan dibalas pada jam kerja.",
  },
];
