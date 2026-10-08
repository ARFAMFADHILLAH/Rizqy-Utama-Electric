import { Suspense } from "react";
import { query } from "@/lib/db";
import type { Banner, Category, FilterState, Product, Testimonial } from "@/lib/types";
import HomeBrowser from "@/components/home/HomeBrowser";
import HomeView from "@/components/home/HomeView";

// Halaman dirender penuh saat `next build` (static export Cloudflare).
export const dynamic = "force-static";

const DEFAULT_FILTER: FilterState = {
  kategori: [],
  q: "",
  min: "",
  max: "",
  sort: "unggulan",
};

export default async function Home() {
  const [banners, categories, testimonials, products] = await Promise.all([
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
    query<Product[]>(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
         FROM products p
         JOIN categories c ON c.id = p.category_id
        WHERE p.is_active = TRUE
        ORDER BY p.featured DESC, p.id DESC
        LIMIT 60`,
    ),
  ]);

  return (
    <Suspense
      fallback={
        <HomeView
          banners={banners}
          categories={categories}
          testimonials={testimonials}
          products={products}
          filter={DEFAULT_FILTER}
        />
      }
    >
      <HomeBrowser
        banners={banners}
        categories={categories}
        testimonials={testimonials}
        products={products}
      />
    </Suspense>
  );
}
