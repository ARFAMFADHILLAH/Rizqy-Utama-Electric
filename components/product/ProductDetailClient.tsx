"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useProduct, useProductMedia, useRelatedProducts } from "@/lib/api";
import { formatCompact, formatRp, storeName, waLink } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import AddToCartWidget from "@/components/AddToCartWidget";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import Stars from "@/components/Stars";
import DataError from "@/components/DataError";

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8" aria-hidden>
      <div className="mb-6 h-4 w-64 animate-pulse rounded bg-gray-100" />
      <div className="grid gap-6 rounded-md border border-gray-200 bg-white p-4 sm:p-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-8 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:gap-3">
          <div className="hidden h-[520px] w-20 flex-col gap-2 lg:flex">
            <div className="h-20 w-20 animate-pulse rounded-md bg-gray-100" />
            <div className="h-20 w-20 animate-pulse rounded-md bg-gray-100" />
            <div className="h-20 w-20 animate-pulse rounded-md bg-gray-100" />
          </div>
          <div className="aspect-square w-full animate-pulse rounded-md bg-gray-100" />
        </div>
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
          <div className="h-7 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-9 w-40 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
          <div className="mt-6 h-12 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

function NotFoundBlock({ missingSlug }: { missingSlug: boolean }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-md border border-dashed border-gray-300 bg-white py-20 text-center">
        <p className="font-semibold text-navy-900">
          {missingSlug ? "Produk tidak dipilih" : "Produk tidak ditemukan"}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {missingSlug
            ? "Buka halaman produk dari katalog untuk melihat detailnya."
            : "Produk mungkin sudah tidak tersedia atau tautannya berubah."}
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-brand-500 px-6 py-2.5 font-semibold text-white shadow-sm transition hover:bg-brand-600"
        >
          Lihat Semua Produk
        </Link>
      </div>
    </div>
  );
}

export default function ProductDetailClient() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const { data: product, error, isLoading, mutate } = useProduct(slug);
  const { data: media } = useProductMedia(product?.id ?? null);
  const { data: related } = useRelatedProducts(
    product?.category_id ?? null,
    product?.id ?? null,
  );

  useEffect(() => {
    if (product) document.title = `${product.name} · ${storeName()}`;
  }, [product]);

  if (!slug) return <NotFoundBlock missingSlug />;
  if (error) return <DataError onRetry={() => void mutate()} />;
  if (isLoading) return <ProductDetailSkeleton />;
  if (!product) return <NotFoundBlock missingSlug={false} />;

  const inquiry = waLink(
    `Halo ${storeName()}, saya tertarik dengan produk:\n\n• ${product.name}\n   Harga: ${formatRp(product.price)}\n${product.sku ? `   SKU: ${product.sku}\n` : ""}\nApakah masih tersedia?`,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand-600">Beranda</Link>
        <span className="mx-2">/</span>
        {product.category_is_active === false ? (
          <span>{product.category_name}</span>
        ) : (
          <Link
            href={`/?kategori=${product.category_slug}`}
            className="hover:text-brand-600"
          >
            {product.category_name}
          </Link>
        )}
        <span className="mx-2">/</span>
        <span className="font-semibold text-navy-900">{product.name}</span>
      </nav>

      <div className="grid gap-6 rounded-md border border-gray-200 bg-white p-4 sm:p-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-8 lg:p-8">
        {/* Galeri foto & video */}
        <ProductGallery
          media={media ?? []}
          name={product.name}
          fallbackImage={product.image}
        />

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

          <ProductInfo product={product} />

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

      {related && related.length > 0 && (
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
