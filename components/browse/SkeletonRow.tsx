export default function SkeletonRow() {
  return (
    <div className="mb-10 px-4 md:px-8">
      {/* Title skeleton */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-4 w-[2px] rounded-full" style={{ background: "#1f1f1f" }} />
        <div className="skeleton-shimmer h-4 w-36 rounded-lg" />
      </div>
      {/* Cards */}
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="skeleton-shimmer flex-shrink-0 rounded-xl"
            style={{ width: 148, aspectRatio: "2/3", animationDelay: `${i * 0.08}s` }}
          />
        ))}
      </div>
    </div>
  );
}
