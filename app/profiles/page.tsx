import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileSelector from "@/components/auth/ProfileSelector";

export default async function ProfilesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("account_id", user.id)
    .order("created_at");

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.5) 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <div
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, rgba(236,72,153,0.5) 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="relative z-10">
        <ProfileSelector profiles={profiles || []} />
      </div>
    </div>
  );
}
