export default function SkeletonRow() {
  return (
    <div className="space-y-4 px-4 md:px-12 mb-10">
      {/* Title Skeleton */}
      <div className="flex items-center gap-4">
        <div className="w-1 h-6 rounded-full bg-zinc-900" />
        <div className="h-6 w-40 bg-zinc-900 rounded" />
        <div className="flex-1 h-px bg-gradient-to-r from-[#1f1f1f] to-transparent" />
      </div>

      {/* Cards Skeleton */}
      <div className="flex gap-3 overflow-hidden py-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 rounded-lg overflow-hidden"
            style={{
              width: 156,
              aspectRatio: "2/3",
              background: "#1a1a1a"
            }}
          >
            {/* Hardware shimmer effect */}
            <div
              className="relative w-full h-full"
              style={{ overflow: "hidden" }}
            >
              <div
                className="absolute inset-0 skeleton-shimmer"
                style={{ background: "#1a1a1a" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.03) 35%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.03) 65%, transparent 100%)",
                  animation: "shimmer 1.5s linear infinite"
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
