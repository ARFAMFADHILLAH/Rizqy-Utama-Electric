import { query } from "@/lib/db";
import type { Product } from "@/lib/types";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const products = await query<Product[]>(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       JOIN categories c ON c.id = p.category_id
      ORDER BY p.id DESC`,
  );

  return <CheckoutForm products={products} />;
}