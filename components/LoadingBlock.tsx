export default function LoadingBlock({ label = "Memuat data…" }: { label?: string }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <div
        className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand-500"
        aria-hidden
      />
      <p className="mt-3 text-sm text-gray-500">{label}</p>
    </div>
  );
}
