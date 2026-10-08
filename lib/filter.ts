import type { FilterState, Product } from "@/lib/types";

export function toPositiveInt(value: string): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : null;
}

export function compareProducts(a: Product, b: Product, sort: string): number {
  switch (sort) {
    case "terbaru":
      return b.id - a.id;
    case "terlaris":
      return b.sold - a.sold || Number(b.featured) - Number(a.featured);
    case "termurah":
      return a.price - b.price;
    case "termahal":
      return b.price - a.price;
    default:
      return Number(b.featured) - Number(a.featured) || b.id - a.id;
  }
}

/**
 * Meniru filter/sort yang dulu dijalankan di SQL, tapi di sisi client —
 * karena static export tidak punya server untuk query saat runtime.
 */
export function filterProducts(products: Product[], filter: FilterState): Product[] {
  const q = filter.q.toLowerCase();
  const min = toPositiveInt(filter.min);
  const max = toPositiveInt(filter.max);
  const slugs = filter.kategori;

  const result = products.filter((product) => {
    if (q && !product.name.toLowerCase().includes(q)) return false;
    if (slugs.length > 0 && !(product.category_slug && slugs.includes(product.category_slug))) {
      return false;
    }
    if (min !== null && product.price < min) return false;
    if (max !== null && product.price > max) return false;
    return true;
  });

  result.sort((a, b) => compareProducts(a, b, filter.sort));
  return result.slice(0, 60);
}
