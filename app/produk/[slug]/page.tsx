import Link from "next/link";
import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import type { Product, ProductMedia } from "@/lib/types";
import { formatCompact, formatRp, waLink, storeName } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import AddToCartWidget from "@/components/AddToCartWidget";
import ProductGallery from "@/components/product/ProductGallery";
import Stars from "@/components/Stars";

// =========================================================================
// FUNCTION TAMBAHAN AGAR BISA DI-EXPORT STATIS OLEH CLOUDFLARE
// =========================================================================
export async function generateStaticParams() {
  try {
    // Mengambil daftar slug produk yang aktif dari database Supabase saat build
    const products = await query<Product[]>(
      "SELECT slug FROM products WHERE is_active = TRUE"
    );
    
    // Jika driver database mengembalikan array langsung
    if (Array.isArray(products)) {
      return products.map((product) => ({
        slug: product.slug,
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Gagal mengambil data untuk generateStaticParams:", error);
    return [];
  }
}
// =========================================================================

type Params = Promise<{ slug: string }>;

export default async function ProductDetail({ params }: { params: Params }) {
  const { slug } = await params;

  const products = await query<Product[]>(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       JOIN categories c ON c.id = p.category_id
      WHERE p.slug = ? AND p.is_active = TRUE
      LIMIT 1`,
    [slug],
  );

  const product = products[0];
  if (!product) notFound();

  const media = await query<ProductMedia[]>(
    `SELECT id, product_id, type, url, sort
       FROM product_media
      WHERE product_id = ?
      ORDER BY CASE WHEN type = 'video' THEN 1 ELSE 0 END, sort ASC, id ASC`,
    [product.id],
  );

  const related = await query<Product[]>(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       JOIN categories c ON c.id = p.category_id
      WHERE p.category_id = ? AND p.id <> ? AND p.is_active = TRUE
      ORDER BY p.featured DESC, p.id DESC
      LIMIT 4`,
    [product.category_id, product.id],
  );

  const inquiry = waLink(
    `Halo ${storeName()}, saya tertarik dengan produk:\n\n• ${product.name}\n   Harga: ${formatRp(product.price)}\n${product.sku ? `   SKU: \${product.sku}\n` : ""}\nApakah masih tersedia?`,
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
        {/* Galeri foto & video */}
        <ProductGallery media={media} name={product.name} fallbackImage={product.image} />

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {product.category_name}
          </p>
          <h1 className="mt-1 text-xl font-bold text-navy-900 sm:text-2xl">
            {product.name}
          </h1>

          {product.rating > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Stars value={product.rating} size={16} showValue />
              <span className="text-gray-400">·</span>
              <span className="text-gray-500">{product.rating_count} ulasan</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-500">{formatCompact(product.sold)} terjual</span>
            </div>
          )}

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