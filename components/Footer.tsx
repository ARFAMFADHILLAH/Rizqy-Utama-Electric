import Link from "next/link";
import { storeName, waNumber } from "@/lib/format";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 bg-navy-900 text-navy-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="text-base font-extrabold text-white">{storeName()}</p>
          <p className="mt-1 text-sm text-navy-300">
            Material listrik, kabel, dan saklar terpercaya.
          </p>
          <nav className="mt-4 flex gap-5 text-sm">
            <Link href="/" className="text-navy-200 transition hover:text-brand-400">
              Katalog
            </Link>
            <Link href="/kategori" className="text-navy-200 transition hover:text-brand-400">
              Kategori
            </Link>
          </nav>
        </div>
        <div className="text-sm">
          <p className="text-navy-300">Order & konsultasi via WhatsApp</p>
          <p className="mt-1 text-lg font-bold text-white">+{waNumber()}</p>
        </div>
        <p className="text-xs text-navy-400 sm:pt-1">
          © {new Date().getFullYear()} {storeName()}. Semua hak dilindungi.
        </p>
      </div>
    </footer>
  );
}