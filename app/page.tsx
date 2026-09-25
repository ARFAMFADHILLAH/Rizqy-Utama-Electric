import { query } from "@/lib/db";
import type { Category, Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { waNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ kategori?: string; q?: string }>;

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const { kategori, q } = await searchParams;

  const categories = await query<Category[]>(
    "SELECT id, name, slug FROM categories ORDER BY name ASC",
  );

  const where: string[] = ["p.is_active = 1"];
  const params: string[] = [];

  if (kategori) {
    where.push("c.slug = ?");
    params.push(kategori);
  }
  if (q && q.trim() !== "") {
    where.push("p.name LIKE ?");
    params.push(`%${q.trim()}%`);
  }

  const products = await query<Product[]>(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       JOIN categories c ON c.id = p.category_id
      WHERE ${where.join(" AND ")}
      ORDER BY p.featured DESC, p.id DESC
      LIMIT 60`,
    params,
  );

  const activeCategory = categories.find((c) => c.slug === kategori);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Strip info tipis */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-md bg-navy-900 px-4 py-2.5 text-sm text-white">
        <p>
          Kebutuhan instalasi listrik lengkap & original.
        </p>
        <a
          href={`https://wa.me/${waNumber()}`}
          className="font-semibold text-brand-400 transition hover:text-brand-300"
        >
          Konsultasi / grosir di WhatsApp →
        </a>
      </div>

      {/* Navigasi kategori */}
      <nav className="mb-5 flex gap-x-5 gap-y-2 overflow-x-auto pb-1 text-sm whitespace-nowrap">
        <Link
          href={`/?q=${q ?? ""}`}
          className={`font-medium transition ${
            !kategori
              ? "font-semibold text-navy-900 underline decoration-brand-500 decoration-2 underline-offset-4"
              : "text-gray-500 hover:text-navy-800"
          }`}
        >
          Semua
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/?kategori=${category.slug}&q=${q ?? ""}`}
            className={`font-medium transition ${
              kategori === category.slug
                ? "font-semibold text-navy-900 underline decoration-brand-500 decoration-2 underline-offset-4"
                : "text-gray-500 hover:text-navy-800"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </nav>

      {q?.trim() && (
        <p className="mb-4 text-sm text-gray-600">
          Menampilkan hasil untuk <strong className="text-navy-900">“{q.trim()}”</strong>{" "}
          <Link href="/" className="text-brand-600 hover:underline">
            (reset)
          </Link>
        </p>
      )}

      <h1 className="mb-4 text-lg font-bold text-navy-900">
        {q?.trim() ? "Hasil pencarian" : activeCategory ? activeCategory.name : "Rekomendasi untuk Anda"}
        <span className="ml-1 text-sm font-normal text-gray-500">
          ({products.length} produk)
        </span>
      </h1>

      {products.length === 0 ? (
        <div className="rounded-md border border-dashed border-gray-300 bg-white py-20 text-center">
          <p className="font-semibold text-navy-900">Produk tidak ditemukan</p>
          <p className="mt-1 text-sm text-gray-500">
            Coba kata kunci lain atau pilih kategori berbeda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} showButton />
          ))}
        </div>
      )}
    </div>
  );
}