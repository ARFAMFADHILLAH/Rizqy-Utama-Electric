export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type Product = {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  sku: string | null;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  featured: boolean;
  is_active: boolean;
  rating: number;
  rating_count: number;
  sold: number;
  category_name?: string;
  category_slug?: string;
};

export type Banner = {
  id: number;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  link_url: string | null;
  sort: number;
};

export type Testimonial = {
  id: number;
  name: string;
  city: string | null;
  rating: number;
  message: string;
  avatar_url: string | null;
};

export type ProductMedia = {
  id: number;
  product_id: number;
  type: "image" | "video";
  url: string;
  sort: number;
};