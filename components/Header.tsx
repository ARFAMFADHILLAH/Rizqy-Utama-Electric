"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import SocialLinks from "@/components/SocialLinks";

export default function Header() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 leading-tight">
          <span className="block text-base font-extrabold tracking-tight text-navy-800 sm:text-lg">
            RIZQY UTAMA
          </span>
          <span className="block text-[11px] font-bold uppercase tracking-widest text-brand-500">
            Electric
          </span>
        </Link>

        {/* Search — desktop */}
        <form action="/" method="get" className="mx-auto hidden max-w-xl flex-1 md:flex">
          <div className="relative flex-1">
            <input
              type="search"
              name="q"
              placeholder="Cari produk…"
              className="w-full rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            className="rounded-r-md bg-brand-500 px-6 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            Cari
          </button>
        </form>

        {/* Sosmed & marketplace — desktop */}
        <div className="hidden items-center md:flex">
          <SocialLinks variant="header" />
        </div>

        <nav className="ml-auto flex items-center gap-1 md:ml-0">
          <Link
            href="/kategori"
            className="hidden items-center rounded-md px-3 py-2 text-sm font-medium text-navy-700 transition hover:bg-gray-100 sm:flex"
          >
            Kategori
          </Link>
          <Link
            href="/keranjang"
            aria-label="Keranjang belanja"
            className="relative flex items-center gap-2 rounded-md px-3 py-2 font-medium text-navy-700 transition hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}