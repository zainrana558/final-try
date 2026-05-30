import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import Sidebar from "@/components/layout/Sidebar";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen" style={{ background: "#050505" }}>
      {/* Desktop sidebar */}
      <Sidebar isGuest={!user} />

      {/* Mobile top navbar */}
      <div className="md:hidden">
        <Navbar isGuest={!user} />
      </div>

      {/* Main content */}
      <main className="pb-20 pt-16 md:pb-0 md:pt-0 md:ml-[220px]">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <MobileNav isGuest={!user} />
    </div>
  );
}
