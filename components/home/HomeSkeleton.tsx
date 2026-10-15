export default function HomeSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8" aria-hidden>
      <div className="h-40 w-full animate-pulse rounded-md bg-gray-200 sm:h-56" />

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-14 animate-pulse rounded-md bg-gray-100" />
        ))}
      </div>

      <div className="mt-6 flex gap-2 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-8 w-24 shrink-0 animate-pulse rounded-full bg-gray-100" />
        ))}
      </div>

      <div className="mt-5 h-6 w-48 animate-pulse rounded bg-gray-200" />

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-md border border-gray-200 bg-white">
            <div className="aspect-square animate-pulse bg-gray-100" />
            <div className="space-y-2 p-3">
              <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
