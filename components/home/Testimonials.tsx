import type { Testimonial } from "@/lib/types";
import Stars from "@/components/Stars";

type Props = {
  testimonials: Testimonial[];
};

export default function Testimonials({ testimonials }: Props) {
  if (testimonials.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-lg font-bold text-navy-900">Kata Pelanggan</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            Pengalaman pembeli yang sudah berbelanja di toko kami.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item) => (
          <figure
            key={item.id}
            className="flex flex-col rounded-lg border border-gray-200 bg-white p-4"
          >
            <Stars value={item.rating} />
            <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-gray-700">
              “{item.message}”
            </blockquote>
            <figcaption className="mt-3 flex items-center gap-3 border-t border-gray-100 pt-3">
              {item.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.avatar_url}
                  alt={item.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <span className="grid h-9 w-9 place-items-center rounded-full bg-navy-100 text-sm font-bold text-navy-700">
                  {item.name.charAt(0).toUpperCase()}
                </span>
              )}
              <div>
                <p className="text-sm font-semibold text-navy-900">{item.name}</p>
                {item.city && <p className="text-xs text-gray-400">{item.city}</p>}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
