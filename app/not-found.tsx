import Link from "next/link";
import { Film } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ background: "#080605" }}
    >
      <div className="text-center space-y-6 relative z-10">
        {/* Icon */}
        <div className="flex justify-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              background: "linear-gradient(135deg, #d4a853 0%, #b8883a 100%)",
              boxShadow: "0 8px 32px rgba(212,168,83,0.2)",
            }}
          >
            <Film className="h-8 w-8" style={{ color: "#080605" }} />
          </div>
        </div>

        <div className="space-y-2">
          <h1
            className="text-6xl font-bold tracking-tighter"
            style={{ color: "#f5f0eb" }}
          >
            404
          </h1>
          <h2 className="text-xl font-semibold" style={{ color: "#9c948a" }}>
            Page Not Found
          </h2>
        </div>

        <p style={{ color: "#5a544a" }}>
          The page you&apos;re looking for doesn&apos;t exist.
        </p>

        <Link
          href="/browse"
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #f5f0eb 0%, #d4a853 100%)",
            color: "#080605",
            boxShadow: "0 4px 16px rgba(212,168,83,0.2)",
          }}
        >
          Go Home
        </Link>
      </div>

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(212,168,83,0.04) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}
