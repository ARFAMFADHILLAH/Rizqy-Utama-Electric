"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

type Props = {
  productId: number;
  stock: number;
  big?: boolean;
};

/** Stepper jumlah + tombol tambah ke keranjang. */
export default function AddToCartWidget({ productId, stock, big = false }: Props) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (stock <= 0) {
    return (
      <button
        type="button"
        disabled
        className="w-full cursor-not-allowed rounded-md bg-gray-100 px-4 py-2 font-semibold text-gray-400"
      >
        Stok Habis
      </button>
    );
  }

  const increase = () => setQty((value) => Math.min(value + 1, stock));
  const decrease = () => setQty((value) => Math.max(value - 1, 1));

  const handleAdd = () => {
    add(productId, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  const btnSize = big ? "h-11" : "h-8";

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={decrease}
        aria-label="Kurangi jumlah"
        className={`grid ${btnSize} w-8 place-items-center rounded-md border border-gray-200 bg-white font-bold text-gray-600 transition hover:bg-gray-50 ${
          big ? "text-lg" : "text-base"
        }`}
      >
        −
      </button>
      <span className={`w-6 text-center font-semibold text-navy-900 ${big ? "text-base" : "text-sm"}`}>
        {qty}
      </span>
      <button
        type="button"
        onClick={increase}
        aria-label="Tambah jumlah"
        className={`grid ${btnSize} w-8 place-items-center rounded-md border border-gray-200 bg-white font-bold text-gray-600 transition hover:bg-gray-50 ${
          big ? "text-lg" : "text-base"
        }`}
      >
        +
      </button>
      <button
        type="button"
        onClick={handleAdd}
        className={`flex-1 rounded-md bg-brand-500 px-3 font-semibold text-white shadow-sm transition hover:bg-brand-600 ${btnSize} ${
          big ? "text-[15px]" : "text-sm"
        }`}
      >
        {added ? "✓ Masuk" : "Tambah"}
      </button>
    </div>
  );
}