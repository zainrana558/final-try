export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "#080605" }}
    >
      {/* Warm ambient radial gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(212,168,83,0.06) 0%, transparent 55%)",
        }}
      />

      {/* Subtle bottom glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-64"
        style={{
          background: "radial-gradient(ellipse at 50% 100%, rgba(212,168,83,0.04) 0%, transparent 60%)",
        }}
      />

      {/* Auth card container with warm border */}
      <div
        className="relative w-full max-w-sm"
        style={{
          padding: "1px",
          background: "linear-gradient(135deg, rgba(212,168,83,0.25) 0%, rgba(42,37,32,0.5) 50%, rgba(212,168,83,0.1) 100%)",
          borderRadius: "16px",
        }}
      >
        <div
          className="relative p-8"
          style={{
            background: "#12100e",
            borderRadius: "15px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          {/* Inner warm glow */}
          <div
            className="absolute inset-0 rounded-[15px] pointer-events-none overflow-hidden"
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24"
              style={{
                background: "radial-gradient(ellipse at 50% 0%, rgba(212,168,83,0.06) 0%, transparent 70%)",
              }}
            />
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
