import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatCompact, formatRp } from "@/lib/format";
import Stars from "./Stars";
import AddToCartWidget from "./AddToCartWidget";

type Props = {
  product: Product;
  showButton?: boolean;
};

export default function ProductCard({ product, showButton = false }: Props) {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white transition-shadow hover:shadow-md">
      <Link href={`/produk/${product.slug}`} className="group flex flex-col">
        <div className="relative aspect-square bg-white">
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-gray-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.2}
                stroke="currentColor"
                className="h-10 w-10 text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0 0 21.75 19.5V4.5A1.5 1.5 0 0 0 20.25 3H3.75A1.5 1.5 0 0 0 2.25 4.5v15A1.5 1.5 0 0 0 3.75 21Z"
                />
              </svg>
            </div>
          )}
          {product.featured && (
            <span className="absolute left-2 top-2 rounded-sm bg-navy-900 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              Unggulan
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-3">
          <span className="text-[11px] text-gray-400">{product.category_name}</span>
          <h3 className="mt-0.5 text-sm font-medium leading-snug text-navy-900 line-clamp-2">
            {product.name}
          </h3>
          {product.rating > 0 && (
            <div className="mt-1 flex items-center gap-1">
              <Stars value={product.rating} size={11} />
              <span className="text-[10px] text-gray-400">
                {product.rating.toFixed(1)} · {formatCompact(product.sold)} terjual
              </span>
            </div>
          )}
          <div className="mt-auto pt-2">
            <p className="text-base font-bold text-navy-900">{formatRp(product.price)}</p>
            <p
              className={`mt-0.5 text-[11px] ${
                product.stock > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {product.stock > 0
                ? `Stok ${product.stock.toLocaleString("id-ID")}`
                : "Stok habis"}
            </p>
          </div>
        </div>
      </Link>

      {showButton && (
        <div className="px-3 pb-3">
          <AddToCartWidget productId={product.id} stock={product.stock} />
        </div>
      )}
    </div>
  );
}