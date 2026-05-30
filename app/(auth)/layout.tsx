export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Subtle ambient radial gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 50%)"
        }}
      />

      {/* Auth card container with subtle border animation */}
      <div
        className="relative w-full max-w-sm"
        style={{
          padding: "3px",
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)",
          borderRadius: "12px"
        }}
      >
        <div className="bg-black rounded-[10px] p-8 relative" style={{ boxShadow: "0 16px 64px rgba(0,0,0,0.9)" }}>
          {/* Inner subtle glow */}
          <div
            className="absolute inset-0 rounded-[10px] pointer-events-none"
            style={{
              background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 50%)"
            }}
          />

          {children}
        </div>
      </div>
    </div>
  );
}
