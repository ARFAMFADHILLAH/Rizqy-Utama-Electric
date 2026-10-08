type Props = {
  value: number;
  size?: number;
  showValue?: boolean;
  count?: number;
};

/** Tampilan bintang rating (bisa sebagian) tanpa dependensi eksternal. */
export default function Stars({ value, size = 14, showValue = false, count }: Props) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));

  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap">
      <span
        className="relative inline-block leading-none"
        style={{ fontSize: size }}
        aria-label={`Rating ${value} dari 5`}
      >
        <span className="text-gray-300">★★★★★</span>
        <span
          className="absolute inset-0 overflow-hidden text-brand-500"
          style={{ width: `${pct}%` }}
        >
          ★★★★★
        </span>
      </span>
      {showValue && (
        <span className="text-xs font-semibold text-navy-900">{value.toFixed(1)}</span>
      )}
      {typeof count === "number" && (
        <span className="text-xs text-gray-400">({count})</span>
      )}
    </span>
  );
}
