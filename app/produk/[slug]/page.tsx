import Link from "next/link";
import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import type { Product } from "@/lib/types";
import { formatRp, waLink, storeName } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import AddToCartWidget from "@/components/AddToCartWidget";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export default async function ProductDetail({ params }: { params: Params }) {
  const { slug } = await params;

  const products = await query<Product[]>(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       JOIN categories c ON c.id = p.category_id
      WHERE p.slug = ? AND p.is_active = 1
      LIMIT 1`,
    [slug],
  );

  const product = products[0];
  if (!product) notFound();

  const related = await query<Product[]>(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       JOIN categories c ON c.id = p.category_id
      WHERE p.category_id = ? AND p.id <> ? AND p.is_active = 1
      ORDER BY p.featured DESC, p.id DESC
      LIMIT 4`,
    [product.category_id, product.id],
  );

  const inquiry = waLink(
    `Halo ${storeName()}, saya tertarik dengan produk:\n\n• ${product.name}\n   Harga: ${formatRp(product.price)}\n${product.sku ? `   SKU: ${product.sku}\n` : ""}\nApakah masih tersedia?`,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand-600">Beranda</Link>
        <span className="mx-2">/</span>
        <Link href={`/?kategori=${product.category_slug}`} className="hover:text-brand-600">
          {product.category_name}
        </Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-navy-900">{product.name}</span>
      </nav>

      <div className="grid gap-6 rounded-md border border-gray-200 bg-white p-4 sm:p-6 lg:grid-cols-2 lg:gap-10 lg:p-8">
        {/* Foto */}
        <div className="aspect-square overflow-hidden rounded-md border border-gray-200 bg-white">
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.2}
                stroke="currentColor"
                className="h-16 w-16 text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0 0 21.75 19.5V4.5A1.5 1.5 0 0 0 20.25 3H3.75A1.5 1.5 0 0 0 2.25 4.5v15A1.5 1.5 0 0 0 3.75 21Z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {product.category_name}
          </p>
          <h1 className="mt-1 text-xl font-bold text-navy-900 sm:text-2xl">
            {product.name}
          </h1>

          {product.sku && <p className="mt-1 text-sm text-gray-400">SKU: {product.sku}</p>}

          <p className="mt-4 text-3xl font-bold text-navy-900">{formatRp(product.price)}</p>
          <p
            className={`mt-1.5 text-sm font-medium ${
              product.stock > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {product.stock > 0
              ? `Stok: ${product.stock.toLocaleString("id-ID")}`
              : "Stok sementara habis"}
          </p>

          {product.description && (
            <p className="mt-4 leading-relaxed whitespace-pre-line text-gray-700">
              {product.description}
            </p>
          )}

          <div className="mt-6 max-w-md">
            <AddToCartWidget productId={product.id} stock={product.stock} big />
            <a
              href={inquiry}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block w-full rounded-md border border-navy-800 px-5 py-2.5 text-center font-semibold text-navy-800 transition hover:bg-navy-800 hover:text-white"
            >
              Beli / Tanya via WhatsApp
            </a>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-bold text-navy-900">Produk Sejenis</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}