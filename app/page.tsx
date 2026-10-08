import Link from "next/link";
import { query } from "@/lib/db";
import type { Banner, Category, Product, Testimonial } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import BannerSlider from "@/components/home/BannerSlider";
import Testimonials from "@/components/home/Testimonials";
import FilterPanel from "@/components/filters/FilterPanel";
import { waNumber } from "@/lib/format";

export const dynamic = "force-static";

type SearchParams = Promise<{
  kategori?: string;
  q?: string;
  min?: string;
  max?: string;
  sort?: string;
  filter?: string;
}>;

const SORT_SQL: Record<string, string> = {
  unggulan: "p.featured DESC, p.id DESC",
  terbaru: "p.id DESC",
  terlaris: "p.sold DESC, p.featured DESC",
  termurah: "p.price ASC",
  termahal: "p.price DESC",
};

function toPositiveInt(value: string | undefined): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : null;
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  const q = sp.q?.trim() ?? "";
  const slugs = (sp.kategori ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const min = toPositiveInt(sp.min);
  const max = toPositiveInt(sp.max);
  const sort = sp.sort && SORT_SQL[sp.sort] ? sp.sort : "unggulan";

  const [banners, categories, testimonials] = await Promise.all([
    query<Banner[]>(
      `SELECT id, title, subtitle, image_url, link_url, sort
         FROM banners
        WHERE is_active = TRUE
        ORDER BY sort ASC, id ASC`,
    ),
    query<Category[]>("SELECT id, name, slug FROM categories ORDER BY name ASC"),
    query<Testimonial[]>(
      `SELECT id, name, city, rating, message, avatar_url
         FROM testimonials
        WHERE is_active = TRUE
        ORDER BY id ASC
        LIMIT 6`,
    ),
  ]);

  const where: string[] = ["p.is_active = TRUE"];
  const params: (string | number)[] = [];

  if (q) {
    where.push("LOWER(p.name) LIKE LOWER(?)");
    params.push(`%${q}%`);
  }
  if (slugs.length > 0) {
    where.push(`c.slug IN (${slugs.map(() => "?").join(", ")})`);
    params.push(...slugs);
  }
  if (min !== null) {
    where.push("p.price >= ?");
    params.push(min);
  }
  if (max !== null) {
    where.push("p.price <= ?");
    params.push(max);
  }

  const products = await query<Product[]>(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       JOIN categories c ON c.id = p.category_id
      WHERE ${where.join(" AND ")}
      ORDER BY ${SORT_SQL[sort]}
      LIMIT 60`,
    params,
  );

  const activeCategory =
    slugs.length === 1 ? categories.find((c) => c.slug === slugs[0]) : undefined;

  const heading = q
    ? "Hasil pencarian"
    : slugs.length > 0
      ? activeCategory
        ? activeCategory.name
        : `${slugs.length} kategori dipilih`
      : "Rekomendasi untuk Anda";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <BannerSlider banners={banners} />

      {/* Keunggulan singkat */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { title: "Produk Original", desc: "Garansi & SNI" },
          { title: "Harga Grosir", desc: "Untuk proyek & toko" },
          { title: "Order Mudah", desc: "Checkout via WhatsApp" },
          { title: "Kirim Cepat", desc: "Jabodetabek & luar kota" },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-md border border-gray-200 bg-white px-3 py-2.5"
          >
            <p className="text-xs font-semibold text-navy-900 sm:text-sm">{item.title}</p>
            <p className="mt-0.5 text-[11px] text-gray-500 sm:text-xs">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Navigasi kategori */}
      <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 text-sm whitespace-nowrap">
        <Link
          href={q ? `/?q=${encodeURIComponent(q)}` : "/"}
          className={`rounded-full border px-3.5 py-1.5 font-medium transition ${
            slugs.length === 0
              ? "border-navy-900 bg-navy-900 text-white"
              : "border-gray-300 bg-white text-gray-600 hover:border-navy-400"
          }`}
        >
          Semua
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/?kategori=${category.slug}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`rounded-full border px-3.5 py-1.5 font-medium transition ${
              slugs.includes(category.slug)
                ? "border-navy-900 bg-navy-900 text-white"
                : "border-gray-300 bg-white text-gray-600 hover:border-navy-400"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </nav>

      <div className="mt-5 flex items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-navy-900">
          {heading}
          <span className="ml-1 text-sm font-normal text-gray-500">
            ({products.length} produk)
          </span>
        </h1>
      </div>

      <div className="mt-3">
        <FilterPanel
          categories={categories}
          current={{ kategori: slugs, q, min: sp.min ?? "", max: sp.max ?? "", sort }}
          initialOpen={sp.filter === "1"}
        />
      </div>

      {q && (
        <p className="mt-3 text-sm text-gray-600">
          Menampilkan hasil untuk <strong className="text-navy-900">“{q}”</strong>{" "}
          <Link href="/" className="text-brand-600 hover:underline">
            (reset)
          </Link>
        </p>
      )}

      {products.length === 0 ? (
        <div className="mt-4 rounded-md border border-dashed border-gray-300 bg-white py-20 text-center">
          <p className="font-semibold text-navy-900">Produk tidak ditemukan</p>
          <p className="mt-1 text-sm text-gray-500">
            Coba kata kunci lain, longgarkan rentang harga, atau pilih kategori berbeda.
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-md bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            Reset Filter
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} showButton />
          ))}
        </div>
      )}

      {/* Butuh bantuan */}
      <div className="mt-10 flex flex-col items-center justify-between gap-3 rounded-lg bg-navy-800 px-5 py-5 text-center sm:flex-row sm:text-left">
        <div>
          <p className="font-bold text-white">Butuh bantuan memilih produk?</p>
          <p className="mt-0.5 text-sm text-navy-200">
            Tanya stok, harga grosir, atau rekomendasi lewat WhatsApp.
          </p>
        </div>
        <a
          href={`https://wa.me/${waNumber()}`}
          className="rounded-md bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          Konsultasi Sekarang
        </a>
      </div>

      <Testimonials testimonials={testimonials} />
    </div>
  );
}
