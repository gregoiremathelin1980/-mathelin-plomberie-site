/** Placeholder discret pour sections chargées en différé (évite CLS brutal, garde le SEO en SSR). */
export default function HomeBelowFoldFallback({
  minHeightClass = "min-h-[280px]",
  label,
}: {
  minHeightClass?: string;
  label: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-4xl rounded-2xl bg-gray-50 ${minHeightClass}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    />
  );
}
