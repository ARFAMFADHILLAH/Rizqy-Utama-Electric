import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deploy ke Cloudflare Pages sebagai HTML statis murni (folder `out/`).
  output: "export",

  // Static export tidak punya server image optimizer bawaan Next.
  images: { unoptimized: true },

  // Cloudflare Pages menyajikan `/rute/index.html` untuk `/rute`.
  trailingSlash: true,
};

export default nextConfig;
