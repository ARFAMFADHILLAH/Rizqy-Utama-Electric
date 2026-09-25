<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project notes — Rizqy Utama Electric

- Next.js 16 App Router + TypeScript + Tailwind v4 + `mysql2` (tanpa ORM, tanpa Prisma).
- Database: MySQL portable di `127.0.0.1:3306`, db `rizqyutamaelectric`, user `root`, tanpa password. Tabel tidak dimigrate — dipakai existing.
- Akses DB hanya lewat `lib/db.ts` → `query<T>(sql, params)`. Halaman data wajib `export const dynamic = "force-dynamic"`.
- `params`/`searchParams` di halaman adalah Promise → harus `await`.
- Semua komponen yang memakai `useCart()` harus "use client". Keranjang = `localStorage` via `context/CartContext.tsx`.
- Nomor WA toko: `NEXT_PUBLIC_WA_NUMBER` (format 628…). Helpers di `lib/format.ts`.
- Commands: `npm run dev`, `npm run build`, `npm run lint`.
