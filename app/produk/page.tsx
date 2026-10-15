import { Suspense } from "react";
import ProductDetailClient, {
  ProductDetailSkeleton,
} from "@/components/product/ProductDetailClient";

export const metadata = { title: "Detail Produk" };

// Konten produk diambil di browser via parameter ?slug= (lihat ProductDetailClient).
export default function ProductDetailPage() {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailClient />
    </Suspense>
  );
}
