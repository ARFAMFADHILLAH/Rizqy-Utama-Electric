"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, FilterState } from "@/lib/types";

export type { FilterState };

export const SORT_OPTIONS = [
  { value: "unggulan", label: "Unggulan" },
  { value: "terbaru", label: "Terbaru" },
  { value: "terlaris", label: "Terlaris" },
  { value: "termurah", label: "Harga termurah" },
  { value: "termahal", label: "Harga termahal" },
];

type Props = {
  categories: Category[];
  current: FilterState;
  initialOpen?: boolean;
};

export default function FilterPanel({ categories, current, initialOpen = false }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(initialOpen);
  const [kategori, setKategori] = useState<string[]>(current.kategori);
  const [q, setQ] = useState(current.q);
  const [min, setMin] = useState(current.min);
  const [max, setMax] = useState(current.max);
  const [sort, setSort] = useState(current.sort || "unggulan");

  const activeCount = useMemo(
    () => kategori.length + (min ? 1 : 0) + (max ? 1 : 0) + (q.trim() ? 1 : 0),
    [kategori, min, max, q],
  );

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-filter", handler);
    return () => window.removeEventListener("open-filter", handler);
  }, []);

  const toggleCategory = (slug: string) => {
    setKategori((prev) =>
      prev.includes(slug) ? prev.filter((item) => item !== slug) : [...prev, slug],
    );
  };

  const apply = () => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (kategori.length) params.set("kategori", kategori.join(","));
    if (min.trim()) params.set("min", min.trim());
    if (max.trim()) params.set("max", max.trim());
    if (sort && sort !== "unggulan") params.set("sort", sort);
    router.push(params.toString() ? `/?${params}` : "/");
    setOpen(false);
  };

  const reset = () => {
    setKategori([]);
    setQ("");
    setMin("");
    setMax("");
    setSort("unggulan");
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-md border border-navy-800 bg-white px-3.5 py-2 text-sm font-semibold text-navy-800 transition hover:bg-navy-800 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
            />
          </svg>
          Filter
          {activeCount > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1 text-[11px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>

        <label className="ml-auto flex items-center gap-1.5 text-sm text-gray-600">
          <span className="hidden sm:inline">Urutkan</span>
          <select
            value={sort}
            onChange={(event) => {
              const next = event.target.value;
              setSort(next);
              const params = new URLSearchParams();
              if (q.trim()) params.set("q", q.trim());
              if (kategori.length) params.set("kategori", kategori.join(","));
              if (min.trim()) params.set("min", min.trim());
              if (max.trim()) params.set("max", max.trim());
              if (next && next !== "unggulan") params.set("sort", next);
              router.push(params.toString() ? `/?${params}` : "/");
            }}
            className="rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm text-navy-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <button
            type="button"
            aria-label="Tutup filter"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-navy-950/50"
          />
          <div className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-navy-900">Filter Produk</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup"
                className="grid h-8 w-8 place-items-center rounded-md text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="filter-q" className="mb-1.5 block text-sm font-semibold text-navy-900">
                  Kata kunci
                </label>
                <input
                  id="filter-q"
                  type="search"
                  value={q}
                  onChange={(event) => setQ(event.target.value)}
                  placeholder="Cari produk…"
                  className="w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-navy-900">Kategori</p>
                <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm text-navy-800 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50"
                    >
                      <input
                        type="checkbox"
                        checked={kategori.includes(category.slug)}
                        onChange={() => toggleCategory(category.slug)}
                        className="h-4 w-4 accent-brand-500"
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-navy-900">Rentang Harga</p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={min}
                    onChange={(event) => setMin(event.target.value)}
                    placeholder="Min"
                    className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
                  />
                  <span className="text-gray-400">–</span>
                  <input
                    type="number"
                    min={0}
                    value={max}
                    onChange={(event) => setMax(event.target.value)}
                    placeholder="Maks"
                    className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={reset}
                className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-semibold text-navy-800 transition hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={apply}
                className="flex-1 rounded-md bg-brand-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
