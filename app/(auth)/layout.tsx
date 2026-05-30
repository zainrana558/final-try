export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute top-0 left-1/4 h-96 w-96 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)", filter: "blur(60px)" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%)", filter: "blur(60px)" }}
      />
      {/* Fine grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </div>
  );
}
