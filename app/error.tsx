"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ background: "#050505" }}
    >
      <div className="text-center space-y-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: "#333", fontFamily: "var(--font-mono, monospace)" }}>
          Error
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-display, Syne, sans-serif)" }}>
          Something went wrong
        </h1>
        <p className="text-[13px]" style={{ color: "#555" }}>An unexpected error occurred. Please try again.</p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 mt-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 4px 20px rgba(124,58,237,0.3)" }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
