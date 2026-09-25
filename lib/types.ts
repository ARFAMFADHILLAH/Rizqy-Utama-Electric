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
  category_name?: string;
  category_slug?: string;
};