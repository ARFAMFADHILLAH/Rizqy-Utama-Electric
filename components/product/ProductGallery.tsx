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

  if (items.length === 0) {
    return (
      <div className="aspect-square overflow-hidden rounded-md border border-gray-200 bg-white">
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
      </div>
    );
  }

  const renderThumbnails = (vertical: boolean) => (
    <div
      className={
        vertical
          ? "hidden max-h-[520px] flex-col gap-2 overflow-y-auto pr-1 lg:flex lg:shrink-0"
          : "mt-3 flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory lg:hidden"
      }
    >
      {items.map((item, index) => (
        <button
          key={`${item.type}-${item.url}-${index}`}
          type="button"
          onClick={() => setActive(index)}
          aria-label={`Media ${index + 1}`}
          className={`relative shrink-0 overflow-hidden rounded-md border-2 bg-white transition ${
            vertical ? "h-20 w-20" : "h-16 w-16 snap-start"
          } ${
            index === active
              ? "border-brand-500 shadow-sm"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          {item.type === "video" ? (
            <span className="grid h-full w-full place-items-center bg-navy-900 text-lg text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.url}
              alt={`${name} - media ${index + 1}`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:gap-3">
        {renderThumbnails(true)}
        <div className="relative aspect-square w-full overflow-hidden rounded-md border border-gray-200 bg-white">
          {current.type === "video" ? (
            youtubeId(current.url) ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId(current.url)}?rel=0`}
                title={name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            ) : (
              <video
                src={current.url}
                controls
                playsInline
                className="h-full w-full bg-black object-contain"
              />
            )
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.url}
              alt={name}
              className="h-full w-full object-cover"
              loading="eager"
            />
          )}
        </div>
      </div>

      {renderThumbnails(false)}
    </div>
  );
}
