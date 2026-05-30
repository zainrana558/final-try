import { createClient } from "@/lib/supabase/server";
import MobileNav from "@/components/layout/MobileNav";
import Sidebar from "@/components/layout/Sidebar";

// LUMINA: Accent color mapping for each page/route
const accentColors: Record<string, string> = {
  "/browse": "#E50914",      // Home - red
  "/anime": "#FF6B9D",       // Anime - sakura pink
  "/cartoon": "#FFB800",     // Cartoon - amber
  "/horror": "#8B00FF",      // Horror - void purple
  "/comedy": "#FF8C00",      // Comedy - warm orange
  "/romance": "#FF4D8B",     // Romance - rose
  "/scifi": "#00D4FF",       // Sci-Fi - electric cyan
  "/action": "#E50914",      // Action - red (default)
  "/movies": "#E50914",      // Movies - red (default)
  "/tv": "#E50914",          // TV - red (default)
  "/my-list": "#E50914",     // My List - red (default)
  "/search": "#E50914",      // Search - red (default)
};

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: "var(--page-bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* LUMINA: Desktop sidebar */}
      <Sidebar isGuest={!user} />

      {/* LUMINA: Main content — offset on desktop */}
      <main
        className="pb-20 md:pb-0 md:ml-[220px]"
        style={{
          transition: "margin-left 200ms ease-in-out",
        }}
      >
        {children}
      </main>

      {/* LUMINA: Mobile bottom nav */}
      <MobileNav isGuest={!user} />
    </div>
  );
}
