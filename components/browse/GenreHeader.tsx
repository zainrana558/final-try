interface GenreHeaderProps {
  title: string;
  tagline?: string;
  accentColor: string;
}

export default function GenreHeader({ title, tagline, accentColor }: GenreHeaderProps) {
  return (
    <div
      className="w-full relative"
      style={{ height: "80px" }}
    >
      {/* LUMINA: Accent-colored left border stripe */}
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{ width: "4px", background: accentColor }}
      />

      {/* LUMINA: Content */}
      <div className="flex items-center h-full px-12">
        <div className="space-y-1">
          <h1
            className="text-3xl font-bold uppercase tracking-widest"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "0.2em",
            }}
          >
            {title}
          </h1>
          {tagline && (
            <p
              className="text-sm"
              style={{ color: "#555555" }}
            >
              {tagline}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
