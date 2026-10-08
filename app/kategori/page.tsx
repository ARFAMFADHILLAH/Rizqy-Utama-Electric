import Link from "next/link";
import { query } from "@/lib/db";
import { storeName } from "@/lib/format";

export const dynamic = "force-static";

export const metadata = { title: "Semua Kategori" };

type CategoryRow = {
  id: number;
  name: string;
  slug: string;
  product_count: number;
};

export default async function CategoriesPage() {
  const categories = await query<CategoryRow[]>(
    `SELECT c.id, c.name, c.slug, COUNT(p.id) AS product_count
       FROM categories c
       LEFT JOIN products p ON p.category_id = c.id AND p.is_active = TRUE
      GROUP BY c.id, c.name, c.slug
      ORDER BY c.name ASC`,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand-600">Beranda</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-navy-900">Kategori</span>
      </nav>

      <h1 className="text-xl font-bold text-navy-900">Semua Kategori</h1>
      <p className="mb-6 mt-1 text-sm text-gray-500">
        Pilih kategori untuk melihat produk material listrik yang tersedia di {storeName()}.
      </p>

      {categories.length === 0 ? (
        <div className="rounded-md border border-dashed border-gray-300 bg-white py-20 text-center">
          <p className="font-semibold text-navy-900">Belum ada kategori</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/?kategori=${category.slug}`}
              className="rounded-md border border-gray-200 bg-white p-5 text-center transition-shadow hover:shadow-md"
            >
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-navy-50 text-navy-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
                  />
                </svg>
              </div>
              <p className="mt-3 text-sm font-semibold text-navy-800">{category.name}</p>
              <p className="mt-0.5 text-xs text-gray-400">
                {category.product_count > 0
                  ? `${category.product_count} produk`
                  : "Belum ada produk"}
              </p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="inline-block rounded-md bg-brand-500 px-6 py-2.5 font-semibold text-white shadow-sm transition hover:bg-brand-600"
        >
          Lihat Semua Produk
        </Link>
      </div>
    </div>
  );
}