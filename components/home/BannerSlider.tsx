"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Banner } from "@/lib/types";

type Props = {
  banners: Banner[];
};

const ROTATE_MS = 5000;

export default function BannerSlider({ banners }: Props) {
  const [active, setActive] = useState(0);

  const go = useCallback(
    (index: number) => {
      setActive((index + banners.length) % banners.length);
    },
    [banners.length],
  );

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = window.setInterval(() => go(active + 1), ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [active, banners.length, go]);

  if (banners.length === 0) {
    return (
      <div className="grid h-44 place-items-center rounded-lg bg-navy-800 px-6 text-center sm:h-60 lg:h-72">
        <div>
          <p className="text-xl font-bold text-white sm:text-2xl">Material Listrik Lengkap</p>
          <p className="mt-1 text-sm text-navy-200">
            Kabel, MCB, saklar, lampu LED, hingga alat ukur — original & harga grosir.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-lg bg-navy-900">
      <div className="relative h-44 w-full sm:h-60 lg:h-72">
        {banners.map((banner, index) => {
          const slide = (
            <>
              {banner.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-navy-900 to-navy-700" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-navy-900/55 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-10">
                <p className="max-w-md text-lg font-extrabold leading-tight text-white sm:text-2xl lg:text-3xl">
                  {banner.title}
                </p>
                {banner.subtitle && (
                  <p className="mt-1.5 max-w-sm text-xs text-navy-100 sm:text-sm">
                    {banner.subtitle}
                  </p>
                )}
                {banner.link_url && (
                  <span className="mt-3 inline-block w-fit rounded-md bg-brand-500 px-4 py-2 text-xs font-semibold text-white sm:text-sm">
                    Lihat Produk
                  </span>
                )}
              </div>
            </>
          );

          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === active ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {banner.link_url ? (
                <Link href={banner.link_url} className="block h-full w-full">
                  {slide}
                </Link>
              ) : (
                slide
              )}
            </div>
          );
        })}
      </div>

      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label="Banner sebelumnya"
            className="absolute left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-navy-900 transition hover:bg-white sm:grid"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label="Banner berikutnya"
            className="absolute right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-navy-900 transition hover:bg-white sm:grid"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {banners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => go(index)}
                aria-label={`Ke banner ${index + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  index === active ? "w-5 bg-brand-500" : "w-1.5 bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
