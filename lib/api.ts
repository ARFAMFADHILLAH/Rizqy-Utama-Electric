import useSWR from "swr";
import type {
  Banner,
  Category,
  Product,
  ProductMedia,
  Testimonial,
} from "@/lib/types";
import { supabase } from "@/lib/supabase";

// Produk di-join dengan kategori lewat resource embedding PostgREST:
// select("*, categories(name, slug)") -> { ..., categories: { name, slug } }
type ProductRow = Omit<Product, "category_name" | "category_slug"> & {
  categories: { name: string; slug: string } | null;
};

const PRODUCT_SELECT = "*, categories(name, slug)";

function mapProduct(row: ProductRow): Product {
  const { categories, ...rest } = row;
  return {
    ...rest,
    category_name: categories?.name,
    category_slug: categories?.slug,
  };
}

async function fetchBanners(): Promise<Banner[]> {
  const { data, error } = await supabase()
    .from("banners")
    .select("id, title, subtitle, image_url, link_url, sort")
    .eq("is_active", true)
    .order("sort", { ascending: true })
    .order("id", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Banner[];
}

async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase()
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Category[];
}

async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase()
    .from("testimonials")
    .select("id, name, city, rating, message, avatar_url")
    .eq("is_active", true)
    .order("id", { ascending: true })
    .limit(6);
  if (error) throw error;
  return (data ?? []) as Testimonial[];
}

async function fetchActiveProducts(): Promise<Product[]> {
  const { data, error } = await supabase()
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("featured", { ascending: false })
    .order("id", { ascending: false })
    .limit(60);
  if (error) throw error;
  return ((data ?? []) as ProductRow[]).map(mapProduct);
}

async function fetchAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase()
    .from("products")
    .select(PRODUCT_SELECT)
    .order("id", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as ProductRow[]).map(mapProduct);
}

async function fetchProduct(slug: string): Promise<Product | null> {
  const { data, error } = await supabase()
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProduct(data as ProductRow) : null;
}

async function fetchProductMedia(productId: number): Promise<ProductMedia[]> {
  // Urut type ASC = gambar dulu lalu video, setara CASE WHEN type='video' THEN 1 ELSE 0.
  const { data, error } = await supabase()
    .from("product_media")
    .select("id, product_id, type, url, sort")
    .eq("product_id", productId)
    .order("type", { ascending: true })
    .order("sort", { ascending: true })
    .order("id", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ProductMedia[];
}

async function fetchRelatedProducts(
  categoryId: number,
  productId: number,
): Promise<Product[]> {
  const { data, error } = await supabase()
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("category_id", categoryId)
    .neq("id", productId)
    .eq("is_active", true)
    .order("featured", { ascending: false })
    .order("id", { ascending: false })
    .limit(4);
  if (error) throw error;
  return ((data ?? []) as ProductRow[]).map(mapProduct);
}

export type CategoryRow = Category & { product_count: number };

async function fetchCategoryCounts(): Promise<CategoryRow[]> {
  // Setara LEFT JOIN + GROUP BY COUNT(p.id): hitung produk aktif per kategori di client.
  const [categories, products] = await Promise.all([
    supabase().from("categories").select("id, name, slug").order("name", { ascending: true }),
    supabase().from("products").select("category_id").eq("is_active", true),
  ]);
  if (categories.error) throw categories.error;
  if (products.error) throw products.error;

  const counts = new Map<number, number>();
  for (const row of (products.data ?? []) as { category_id: number }[]) {
    counts.set(row.category_id, (counts.get(row.category_id) ?? 0) + 1);
  }

  return ((categories.data ?? []) as Category[]).map((category) => ({
    ...category,
    product_count: counts.get(category.id) ?? 0,
  }));
}

export function useBanners() {
  return useSWR("banners", fetchBanners);
}

export function useCategories() {
  return useSWR("categories", fetchCategories);
}

export function useTestimonials() {
  return useSWR("testimonials", fetchTestimonials);
}

export function useActiveProducts() {
  return useSWR("products:active", fetchActiveProducts);
}

export function useAllProducts() {
  return useSWR("products:all", fetchAllProducts);
}

export function useCategoryCounts() {
  return useSWR("category-counts", fetchCategoryCounts);
}

export function useProduct(slug: string | null) {
  return useSWR(slug ? ["product", slug] : null, () => fetchProduct(slug as string));
}

export function useProductMedia(productId: number | null) {
  return useSWR(productId ? ["product-media", productId] : null, () =>
    fetchProductMedia(productId as number),
  );
}

export function useRelatedProducts(categoryId: number | null, productId: number | null) {
  return useSWR(
    categoryId && productId ? ["related-products", categoryId, productId] : null,
    () => fetchRelatedProducts(categoryId as number, productId as number),
  );
}
