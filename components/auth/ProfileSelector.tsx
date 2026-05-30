"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProfile, deleteProfile } from "@/actions/profiles";
import { Plus, Trash2, User, Loader2, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

const AVATAR_COLORS = [
  { bg: "linear-gradient(135deg, #8b6bb0 0%, #c85878 100%)", shadow: "rgba(200,88,120,0.3)" },
  { bg: "linear-gradient(135deg, #4a80b8 0%, #5bc4c4 100%)", shadow: "rgba(91,196,196,0.3)" },
  { bg: "linear-gradient(135deg, #5a9848 0%, #7ab868 100%)", shadow: "rgba(122,184,104,0.3)" },
  { bg: "linear-gradient(135deg, #b87030 0%, #e8943c 100%)", shadow: "rgba(232,148,60,0.3)" },
  { bg: "linear-gradient(135deg, #6a58a0 0%, #8b6bb0 100%)", shadow: "rgba(139,107,176,0.3)" },
];

export default function ProfileSelector({ profiles }: { profiles: Profile[] }) {
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [managing, setManaging] = useState(false);
  const router = useRouter();

  function selectProfile(profileId: string) {
    document.cookie = `profile_id=${profileId}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.push("/browse");
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setLoading(true);

    const formData = new FormData();
    formData.set("name", newName.trim());

    const result = await createProfile(formData);
    if (result.error) {
      alert(result.error);
    } else {
      setNewName("");
      setShowCreate(false);
      router.refresh();
    }
    setLoading(false);
  }

  async function handleDelete(profileId: string) {
    if (!confirm("Delete this profile? This action cannot be undone.")) return;
    await deleteProfile(profileId);
    router.refresh();
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    document.cookie = "profile_id=; path=/; max-age=0";
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="w-full max-w-2xl space-y-10 relative z-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(135deg, #d4a853 0%, #b8883a 100%)",
              boxShadow: "0 4px 16px rgba(212,168,83,0.25)",
            }}
          >
            <span className="text-lg font-bold" style={{ color: "#080605" }}>L</span>
          </div>
          <h1
            className="text-3xl font-bold tracking-tighter leading-none"
            style={{
              background: "linear-gradient(135deg, #f5f0eb 0%, #d4a853 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            LUMINA
          </h1>
        </div>
        <h2 className="text-xl font-semibold" style={{ color: "#f5f0eb" }}>
          Who&apos;s watching?
        </h2>
      </div>

      {/* Profiles Grid */}
      <div className="flex flex-wrap justify-center gap-6">
        <AnimatePresence>
          {profiles.map((profile, i) => {
            const colors = AVATAR_COLORS[i % AVATAR_COLORS.length];
            return (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25, delay: i * 0.06 }}
                className="group relative"
              >
                <button
                  onClick={() => !managing && selectProfile(profile.id)}
                  className="flex flex-col items-center gap-3 rounded-2xl p-4 transition-all"
                >
                  <motion.div
                    whileHover={{ scale: 1.06, y: -2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex h-24 w-24 items-center justify-center rounded-2xl text-3xl font-bold"
                    style={{
                      background: colors.bg,
                      boxShadow: `0 8px 24px ${colors.shadow}`,
                      color: "#f5f0eb",
                    }}
                  >
                    {profile.name.charAt(0).toUpperCase()}
                  </motion.div>
                  <span className="text-sm transition-colors" style={{ color: "#7a7168" }}>
                    {profile.name}
                  </span>
                </button>
                {managing && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => handleDelete(profile.id)}
                    className="absolute -right-2 -top-2 rounded-full p-1.5 shadow-lg transition-all hover:scale-110"
                    style={{
                      background: "#c75c3a",
                      boxShadow: "0 4px 12px rgba(199,92,58,0.4)",
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-white" />
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Add Profile Button */}
        {profiles.length < 5 && !showCreate && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={() => setShowCreate(true)}
            className="flex flex-col items-center gap-3 rounded-2xl p-4 transition-all"
          >
            <motion.div
              whileHover={{ scale: 1.06, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed transition-all"
              style={{
                borderColor: "#2a2520",
                color: "#5a544a",
              }}
            >
              <Plus className="h-10 w-10" />
            </motion.div>
            <span className="text-sm" style={{ color: "#5a544a" }}>Add Profile</span>
          </motion.button>
        )}
      </div>

      {/* Create Profile Form */}
      <AnimatePresence>
        {showCreate && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onSubmit={handleCreate}
            className="mx-auto flex max-w-xs gap-2"
          >
            <input
              placeholder="Profile name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              maxLength={20}
              autoFocus
              className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
              style={{
                background: "rgba(245,240,235,0.05)",
                border: "1px solid #2a2520",
                color: "#f5f0eb",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl px-4 py-2.5 transition-all"
              style={{
                background: "linear-gradient(135deg, #d4a853 0%, #b8883a 100%)",
                color: "#080605",
              }}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <User className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="rounded-xl px-4 py-2.5 text-sm transition-all"
              style={{
                border: "1px solid #2a2520",
                color: "#7a7168",
              }}
            >
              Cancel
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setManaging(!managing)}
          className="rounded-xl px-5 py-2.5 text-sm font-medium transition-all"
          style={{
            border: managing ? "1px solid rgba(212,168,83,0.3)" : "1px solid #2a2520",
            color: managing ? "#d4a853" : "#7a7168",
            background: managing ? "rgba(212,168,83,0.08)" : "transparent",
          }}
        >
          {managing ? "Done" : "Manage Profiles"}
        </button>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm transition-all"
          style={{
            border: "1px solid #2a2520",
            color: "#c75c3a",
          }}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
