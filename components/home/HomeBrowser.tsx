"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { FilterState } from "@/lib/types";
import { filterProducts } from "@/lib/filter";
import {
  useActiveProducts,
  useBanners,
  useCategories,
  useTestimonials,
} from "@/lib/api";
import HomeView from "@/components/home/HomeView";
import HomeSkeleton from "@/components/home/HomeSkeleton";
import DataError from "@/components/DataError";

const VALID_SORTS = new Set(["unggulan", "terbaru", "terlaris", "termurah", "termahal"]);

export default function HomeBrowser() {
  const searchParams = useSearchParams();

  const banners = useBanners();
  const categories = useCategories();
  const testimonials = useTestimonials();
  const products = useActiveProducts();

  const filter = useMemo<FilterState>(() => {
    const sortParam = searchParams.get("sort") ?? "unggulan";
    return {
      kategori: (searchParams.get("kategori") ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      q: (searchParams.get("q") ?? "").trim(),
      min: searchParams.get("min") ?? "",
      max: searchParams.get("max") ?? "",
      sort: VALID_SORTS.has(sortParam) ? sortParam : "unggulan",
    };
  }, [searchParams]);

  const visible = useMemo(
    () => filterProducts(products.data ?? [], filter),
    [products.data, filter],
  );

  const error =
    banners.error ?? categories.error ?? testimonials.error ?? products.error;
  const isLoading =
    banners.isLoading ||
    categories.isLoading ||
    testimonials.isLoading ||
    products.isLoading;

  if (error) {
    return (
      <DataError
        onRetry={() => {
          void Promise.all([
            banners.mutate(),
            categories.mutate(),
            testimonials.mutate(),
            products.mutate(),
          ]);
        }}
      />
    );
  }

  if (isLoading) return <HomeSkeleton />;

  return (
    <HomeView
      banners={banners.data ?? []}
      categories={categories.data ?? []}
      testimonials={testimonials.data ?? []}
      products={visible}
      filter={filter}
      initialOpenFilter={searchParams.get("filter") === "1"}
    />
  );
}
