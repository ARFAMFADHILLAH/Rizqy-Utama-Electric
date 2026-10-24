"use client";

import { useMemo, useState } from "react";
import type { Product, ProductSpec } from "@/lib/types";
import ProductDescription from "@/components/product/ProductDescription";

type Tab = "deskripsi" | "spesifikasi";

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`-mb-px border-b-2 px-1 pb-2 text-sm font-semibold transition ${
        active
          ? "border-brand-500 text-brand-600"
          : "border-transparent text-gray-500 hover:text-navy-900"
      }`}
    >
      {children}
    </button>
  );
}

export default function ProductInfo({ product }: { product: Product }) {
  const hasDescription = Boolean(product.description?.trim());

  const specs = useMemo<ProductSpec[]>(() => {
    const rows: ProductSpec[] = [];
    const push = (label: string, value?: string | null) => {
      const clean = value?.trim();
      if (clean) rows.push({ label, value: clean });
    };

    if (Array.isArray(product.specs)) {
      for (const spec of product.specs) {
        if (spec && typeof spec.label === "string" && typeof spec.value === "string") {
          push(spec.label, spec.value);
        }
      }
    }

    push("SKU", product.sku);
    push("Kategori", product.category_name);
    push("Kondisi", "Baru");

    return rows;
  }, [product]);

  const [tab, setTab] = useState<Tab>(hasDescription ? "deskripsi" : "spesifikasi");
  const [prevId, setPrevId] = useState(product.id);

  if (prevId !== product.id) {
    setPrevId(product.id);
    setTab(hasDescription ? "deskripsi" : "spesifikasi");
  }

  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <div role="tablist" aria-label="Informasi produk" className="flex gap-6 border-b border-gray-200">
        {hasDescription && (
          <TabButton active={tab === "deskripsi"} onClick={() => setTab("deskripsi")}>
            Deskripsi
          </TabButton>
        )}
        <TabButton active={tab === "spesifikasi"} onClick={() => setTab("spesifikasi")}>
          Spesifikasi
        </TabButton>
      </div>

      <div className="pt-4">
        {tab === "deskripsi" && hasDescription ? (
          <ProductDescription content={product.description} />
        ) : (
          <div className="overflow-hidden rounded-md border border-gray-200">
            <table className="w-full border-collapse text-sm">
              <tbody>
                {specs.map((spec, index) => (
                  <tr
                    key={`${spec.label}-${index}`}
                    className={index % 2 === 1 ? "bg-gray-50" : "bg-white"}
                  >
                    <th className="w-2/5 border-b border-gray-100 px-4 py-2.5 text-left font-medium text-gray-500 last:border-0">
                      {spec.label}
                    </th>
                    <td className="border-b border-gray-100 px-4 py-2.5 text-navy-900 last:border-0">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
