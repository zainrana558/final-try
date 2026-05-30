import SkeletonRow from "@/components/browse/SkeletonRow";

export default function BrowseLoading() {
  return (
    <div>
      {/* Hero Skeleton */}
      <div className="h-[70vh] w-full md:h-[85vh] relative overflow-hidden" style={{ background: "#0e0c0a" }}>
        <div className="absolute inset-0 skeleton-shimmer" />
      </div>
      <div className="-mt-16 relative z-10 space-y-8 pb-12">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    </div>
  );
}
