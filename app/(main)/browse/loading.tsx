import SkeletonRow from "@/components/browse/SkeletonRow";

export default function BrowseLoading() {
  return (
    <div style={{ background: "#050505" }}>
      {/* Hero skeleton */}
      <div
        className="skeleton-shimmer w-full"
        style={{ height: "85vh", minHeight: 500 }}
      />
      <div className="relative z-10 -mt-16 pb-12 space-y-0">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    </div>
  );
}
