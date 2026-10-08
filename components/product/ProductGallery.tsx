"use client";

import { useState } from "react";
import type { ProductMedia } from "@/lib/types";

type Props = {
  media: ProductMedia[];
  name: string;
  fallbackImage: string | null;
};

function youtubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/,
  );
  return match ? match[1] : null;
}

export default function ProductGallery({ media, name, fallbackImage }: Props) {
  const items: ProductMedia[] =
    media.length > 0
      ? media
      : fallbackImage
        ? [{ id: 0, product_id: 0, type: "image", url: fallbackImage, sort: 0 }]
        : [];

  const [active, setActive] = useState(0);
  const current = items[active];

  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-md border border-gray-200 bg-white">
        {!current ? (
          <div className="grid h-full w-full place-items-center bg-gray-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.2}
              stroke="currentColor"
              className="h-16 w-16 text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0 0 21.75 19.5V4.5A1.5 1.5 0 0 0 20.25 3H3.75A1.5 1.5 0 0 0 2.25 4.5v15A1.5 1.5 0 0 0 3.75 21Z"
              />
            </svg>
          </div>
        ) : current.type === "video" ? (
          youtubeId(current.url) ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId(current.url)}`}
              title={name}
              allowFullScreen
              className="h-full w-full"
            />
          ) : (
            <video src={current.url} controls className="h-full w-full bg-black object-contain" />
          )
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current.url} alt={name} className="h-full w-full object-cover" />
        )}
      </div>

      {items.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {items.map((item, index) => (
            <button
              key={`${item.type}-${item.url}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Media ${index + 1}`}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 bg-white transition ${
                index === active ? "border-brand-500" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {item.type === "video" ? (
                <>
                  <span className="grid h-full w-full place-items-center bg-navy-900 text-lg text-white">
                    ▶
                  </span>
                </>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={name} loading="lazy" className="h-full w-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
