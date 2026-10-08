"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { Banner, Category, FilterState, Product, Testimonial } from "@/lib/types";
import { filterProducts } from "@/lib/filter";
import HomeView from "@/components/home/HomeView";

type Props = {
  banners: Banner[];
  categories: Category[];
  testimonials: Testimonial[];
  products: Product[];
};

const VALID_SORTS = new Set(["unggulan", "terbaru", "terlaris", "termurah", "termahal"]);

export default function HomeBrowser({ banners, categories, testimonials, products }: Props) {
  const searchParams = useSearchParams();

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

  const visible = useMemo(() => filterProducts(products, filter), [products, filter]);

  return (
    <HomeView
      banners={banners}
      categories={categories}
      testimonials={testimonials}
      products={visible}
      filter={filter}
      initialOpenFilter={searchParams.get("filter") === "1"}
    />
  );
}
