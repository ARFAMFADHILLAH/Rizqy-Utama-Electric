import type { Product } from "@/lib/types";

export function formatRp(value: number): string {
  return "Rp " + new Intl.NumberFormat("id-ID").format(value);
}

/** Angka ringkas ala e-commerce: 1.200 → "1,2 rb", 1.500.000 → "1,5 jt". */
export function formatCompact(value: number): string {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(".", ",") + " jt";
  if (value >= 1_000) return (value / 1_000).toFixed(1).replace(".", ",") + " rb";
  return String(value);
}

export function formatSold(value: number): string {
  return `${formatCompact(value)} terjual`;
}

export function waNumber(): string {
  return process.env.NEXT_PUBLIC_WA_NUMBER ?? "";
}

export function storeName(): string {
  return process.env.NEXT_PUBLIC_STORE_NAME ?? "Rizqy Utama Electric";
}

export function waLink(message: string): string {
  return `https://wa.me/${waNumber()}?text=${encodeURIComponent(message)}`;
}

export type CartItem = {
  product: Product;
  qty: number;
};

/** Ringkasan "qty × produk" untuk pesan WhatsApp. */
export function orderLines(items: CartItem[]): string[] {
  const lines: string[] = [];
  for (const item of items) {
    const subtotal = item.product.price * item.qty;
    lines.push(
      `• ${item.product.name}\n   ${item.qty} × ${formatRp(item.product.price)} = ${formatRp(subtotal)}`,
    );
  }
  return lines;
}

export function buildOrderMessage(
  items: CartItem[],
  buyer: { name: string; phone: string; address: string; notes: string },
): string {
  const total = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  const sections = [
    `*Order Baru — ${storeName()}*`,
    "",
    "*Detail Pesanan:*",
    ...orderLines(items),
    "",
    `*Total: ${formatRp(total)}*`,
    "",
    "*Data Pemesan:*",
    `Nama: ${buyer.name}`,
    `No. HP: ${buyer.phone}`,
    `Alamat: ${buyer.address || "-"}`,
    `Catatan: ${buyer.notes || "-"}`,
  ];

  return sections.join("\n");
}