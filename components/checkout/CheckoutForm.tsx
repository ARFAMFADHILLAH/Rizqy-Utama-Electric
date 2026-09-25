"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";
import { buildOrderMessage, formatRp, waLink } from "@/lib/format";

type Props = {
  products: Product[];
};

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500";

export default function CheckoutForm({ products }: Props) {
  const { items, clear } = useCart();
  const [error, setError] = useState("");

  const byId = new Map(products.map((p) => [p.id, p]));

  const cartItems = Object.entries(items)
    .map(([id, qty]) => {
      const product = byId.get(Number(id));
      if (!product || !product.is_active) return null;
      const safeQty = Math.min(qty, Math.max(product.stock, 0));
      return { product, qty: safeQty <= 0 ? 1 : safeQty };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-md border border-dashed border-gray-300 bg-white py-24 text-center">
          <p className="text-lg font-bold text-navy-900">Belum ada pesanan</p>
          <p className="mt-1 text-sm text-gray-500">Isi keranjang dulu sebelum checkout.</p>
          <Link
            href="/keranjang"
            className="mt-6 inline-block rounded-md bg-brand-500 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-600"
          >
            Kembali ke Keranjang
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim();

    if (!name || !phone) {
      setError("Nama dan No. HP wajib diisi.");
      return;
    }

    const message = buildOrderMessage(
      cartItems.map((item) => ({ product: item.product, qty: item.qty })),
      { name, phone, address, notes },
    );

    clear();
    window.location.assign(waLink(message));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-xl font-bold text-navy-900">Checkout</h1>
      <p className="mb-6 text-sm text-gray-500">
        Isi data pemesan, pesanan akan dikirim ke WhatsApp admin untuk konfirmasi.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-md border border-gray-200 bg-white p-6 sm:p-8"
        >
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-navy-900">
              Nama Lengkap *
            </label>
            <input type="text" id="name" name="name" required placeholder="cth: Budi Santoso" className={inputClass} />
          </div>

          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-navy-900">
              No. HP / WhatsApp *
            </label>
            <input type="tel" id="phone" name="phone" required placeholder="cth: 081234567890" className={inputClass} />
          </div>

          <div>
            <label htmlFor="address" className="mb-1.5 block text-sm font-semibold text-navy-900">
              Alamat Pengiriman
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              placeholder="Jalan, RT/RW, kelurahan, kecamatan, kota, kode pos"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="notes" className="mb-1.5 block text-sm font-semibold text-navy-900">
              Catatan
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              placeholder="Kebutuhan lain, atau ketersediaan pengiriman…"
              className={inputClass}
            />
          </div>

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-brand-500 px-6 py-3.5 text-lg font-bold text-white shadow-sm transition hover:bg-brand-600"
          >
            Kirim Order via WhatsApp
          </button>
          <p className="text-center text-xs text-gray-500">
            Klik tombol di atas akan membuka WhatsApp dengan ringkasan pesanan Anda.
          </p>
        </form>

        <aside className="h-fit rounded-md border border-gray-200 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="mb-4 font-bold text-navy-900">Pesanan</h2>
          <ul className="space-y-3 text-sm">
            {cartItems.map(({ product, qty }) => (
              <li key={product.id} className="flex justify-between gap-3">
                <span className="text-gray-600">
                  {qty} × {product.name}
                </span>
                <span className="whitespace-nowrap font-semibold text-navy-900">
                  {formatRp(product.price * qty)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4">
            <span className="font-semibold text-navy-900">Total</span>
            <span className="text-lg font-bold text-navy-900">{formatRp(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}