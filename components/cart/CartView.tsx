"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";
import { formatRp } from "@/lib/format";

type Props = {
  products: Product[];
};

function Thumb({ product }: { product: Product }) {
  return (
    <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-md border border-gray-200 bg-white">
      {product.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.2}
          stroke="currentColor"
          className="h-6 w-6 text-gray-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0 0 21.75 19.5V4.5A1.5 1.5 0 0 0 20.25 3H3.75A1.5 1.5 0 0 0 2.25 4.5v15A1.5 1.5 0 0 0 3.75 21Z"
          />
        </svg>
      )}
    </div>
  );
}

export default function CartView({ products }: Props) {
  const { items, setQty, remove, clear, count } = useCart();

  const byId = new Map(products.map((p) => [p.id, p]));

  const cartItems = Object.entries(items)
    .map(([id, qty]) => {
      const product = byId.get(Number(id));
      if (!product || !product.is_active) return null;
      const safeQty = Math.min(qty, Math.max(product.stock, 0));
      return { id: product.id, product, qty: safeQty <= 0 ? 1 : safeQty };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-md border border-dashed border-gray-300 bg-white py-24 text-center">
          <p className="text-lg font-bold text-navy-900">Keranjang masih kosong</p>
          <p className="mt-1 text-sm text-gray-500">
            Yuk lihat-lihat katalog material listrik kami.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-md bg-brand-500 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-600"
          >
            Lihat Produk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-xl font-bold text-navy-900">Keranjang Belanja</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          {cartItems.map(({ product, qty }) => (
            <div
              key={product.id}
              className="flex items-center gap-4 rounded-md border border-gray-200 bg-white p-4"
            >
              <Link href={`/produk/${product.slug}`} className="shrink-0">
                <Thumb product={product} />
              </Link>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/produk/${product.slug}`}
                  className="line-clamp-1 font-semibold text-navy-900 hover:text-brand-600"
                >
                  {product.name}
                </Link>
                <p className="mt-0.5 text-sm text-gray-500">{formatRp(product.price)}</p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setQty(product.id, qty - 1)}
                  className="grid h-8 w-8 place-items-center rounded-md border border-gray-200 bg-white font-bold text-gray-600 transition hover:bg-gray-50"
                  aria-label="Kurangi jumlah"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-semibold text-navy-900">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(product.id, qty + 1)}
                  disabled={qty >= product.stock}
                  className="grid h-8 w-8 place-items-center rounded-md border border-gray-200 bg-white font-bold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Tambah jumlah"
                >
                  +
                </button>
              </div>

              <p className="whitespace-nowrap text-sm font-bold text-navy-900">
                {formatRp(product.price * qty)}
              </p>

              <button
                type="button"
                onClick={() => remove(product.id)}
                className="rounded-md p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                aria-label="Hapus item"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-md border border-gray-200 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="mb-1 text-base font-bold text-navy-900">Ringkasan</h2>
          <p className="mb-5 text-sm text-gray-500">
            {cartItems.length} jenis produk · {count} pcs
          </p>

          <div className="flex justify-between border-b border-gray-200 py-2 text-sm">
            <span>Subtotal</span>
            <span className="font-semibold text-navy-900">{formatRp(total)}</span>
          </div>

          <div className="mb-6 mt-4 flex items-center justify-between">
            <span className="font-semibold text-navy-900">Total</span>
            <span className="text-xl font-bold text-navy-900">{formatRp(total)}</span>
          </div>

          <Link
            href="/checkout"
            className="block rounded-md bg-brand-500 px-6 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-brand-600"
          >
            Lanjut ke Checkout
          </Link>

          <button
            type="button"
            onClick={clear}
            className="mt-3 w-full text-center text-sm text-gray-500 transition hover:text-red-500"
          >
            Kosongkan keranjang
          </button>
        </aside>
      </div>
    </div>
  );
}