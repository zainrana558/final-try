"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ background: "#080605" }}
    >
      <div className="text-center space-y-6 relative z-10">
        <div className="flex justify-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              background: "rgba(199,92,58,0.1)",
              border: "1px solid rgba(199,92,58,0.2)",
            }}
          >
            <AlertTriangle className="h-8 w-8" style={{ color: "#c75c3a" }} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold" style={{ color: "#f5f0eb" }}>
            Something went wrong
          </h1>
          <p className="text-sm" style={{ color: "#5a544a" }}>
            An unexpected error occurred. Please try again.
          </p>
        </div>

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #f5f0eb 0%, #d4a853 100%)",
            color: "#080605",
            boxShadow: "0 4px 16px rgba(212,168,83,0.2)",
          }}
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(199,92,58,0.04) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}
