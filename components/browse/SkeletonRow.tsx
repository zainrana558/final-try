export default function SkeletonRow() {
  return (
    <div className="space-y-4 px-4 md:px-12 mb-10">
      {/* Title Skeleton */}
      <div className="flex items-center gap-4">
        <div
          className="w-1 h-6 rounded-full"
          style={{ background: "#2a2520" }}
        />
        <div
          className="h-6 w-40 rounded-lg"
          style={{ background: "#1a1612" }}
        />
        <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, #2a2520, transparent)" }} />
      </div>

      {/* Cards Skeleton */}
      <div className="flex gap-3 overflow-hidden py-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 rounded-xl overflow-hidden"
            style={{
              width: 156,
              aspectRatio: "2/3",
              background: "#1a1612",
            }}
          >
            <div className="relative w-full h-full" style={{ overflow: "hidden" }}>
              <div
                className="absolute inset-0 skeleton-shimmer"
                style={{ background: "#1a1612" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.025) 35%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.025) 65%, transparent 100%)",
                  animation: "shimmer 1.5s linear infinite",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
