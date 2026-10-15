"use client";

import { useAllProducts } from "@/lib/api";
import CartView from "@/components/cart/CartView";
import DataError from "@/components/DataError";
import LoadingBlock from "@/components/LoadingBlock";

export default function CartPage() {
  const { data: products, error, isLoading, mutate } = useAllProducts();

  if (error) return <DataError onRetry={() => void mutate()} />;
  if (isLoading) return <LoadingBlock label="Memuat keranjang…" />;

  return <CartView products={products ?? []} />;
}
