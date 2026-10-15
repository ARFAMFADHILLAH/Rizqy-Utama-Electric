"use client";

type Props = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export default function DataError({
  title = "Gagal memuat data",
  message = "Tidak dapat terhubung ke server. Periksa koneksi internet lalu coba lagi.",
  onRetry,
}: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-md border border-dashed border-gray-300 bg-white py-16 text-center">
        <p className="font-semibold text-navy-900">{title}</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-6 rounded-md bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
          >
            Coba lagi
          </button>
        )}
      </div>
    </div>
  );
}
