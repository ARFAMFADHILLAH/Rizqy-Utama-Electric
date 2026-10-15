"use client";

import { useAllProducts } from "@/lib/api";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import DataError from "@/components/DataError";
import LoadingBlock from "@/components/LoadingBlock";

export default function CheckoutPage() {
  const { data: products, error, isLoading, mutate } = useAllProducts();

  if (error) return <DataError onRetry={() => void mutate()} />;
  if (isLoading) return <LoadingBlock label="Memuat data checkout…" />;

  return <CheckoutForm products={products ?? []} />;
}
