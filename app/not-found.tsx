import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ background: "#050505" }}
    >
      <div className="text-center space-y-4">
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-4"
          style={{ color: "#333", fontFamily: "var(--font-mono, monospace)" }}
        >
          Error
        </p>
        <h1
          className="text-8xl font-bold tracking-tighter"
          style={{
            fontFamily: "var(--font-display, Syne, sans-serif)",
            background: "linear-gradient(90deg, #7c3aed, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </h1>
        <h2 className="text-xl font-semibold text-white tracking-tight">Page Not Found</h2>
        <p className="text-[13px]" style={{ color: "#555" }}>
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 mt-4 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white transition-all"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            boxShadow: "0 4px 20px rgba(124,58,237,0.3)",
          }}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
