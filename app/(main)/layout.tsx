import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Sidebar from "@/components/layout/Sidebar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen" style={{ background: "#080605" }}>
      {/* Warm ambient background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(212,168,83,0.03) 0%, transparent 50%)",
        }}
      />

      {/* Desktop sidebar */}
      <Sidebar isGuest={!user} />

      {/* Mobile top navbar */}
      <div className="md:hidden">
        <Navbar isGuest={!user} />
      </div>

      {/* Main content — offset on desktop */}
      <main className="relative z-[1] pb-20 pt-16 md:pb-0 md:pt-0 md:ml-[260px]">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <MobileNav isGuest={!user} />
    </div>
  );
}
