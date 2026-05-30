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
      className="flex min-h-screen items-center justify-center p-4 relative"
      style={{ background: "#080605" }}
    >
      {/* Warm ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(212,168,83,0.05) 0%, transparent 50%)",
        }}
      />

      <ProfileSelector profiles={profiles || []} />
    </div>
  );
}
