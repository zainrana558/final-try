"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProfile, deleteProfile } from "@/actions/profiles";
import { Plus, Trash2, User, Loader2, LogOut, Check, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #7c3aed, #ec4899)",
  "linear-gradient(135deg, #2563eb, #06b6d4)",
  "linear-gradient(135deg, #059669, #10b981)",
  "linear-gradient(135deg, #d97706, #ef4444)",
  "linear-gradient(135deg, #6366f1, #8b5cf6)",
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
    if (result.error) { alert(result.error); }
    else { setNewName(""); setShowCreate(false); router.refresh(); }
    setLoading(false);
  }

  async function handleDelete(profileId: string) {
    if (!confirm("Delete this profile? This cannot be undone.")) return;
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
    <div className="w-full max-w-xl text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: "#444" }}>
          Lumina
        </p>
        <h1
          className="mb-10 text-3xl font-bold tracking-tight text-white"
          style={{ fontFamily: "var(--font-display, Syne, sans-serif)" }}
        >
          Who&apos;s watching?
        </h1>
      </motion.div>

      <motion.div
        className="flex flex-wrap justify-center gap-5"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
      >
        {profiles.map((profile, i) => (
          <motion.div
            key={profile.id}
            className="group relative"
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ ease: [0.25, 0.46, 0.45, 0.94], duration: 0.4 }}
          >
            <motion.button
              onClick={() => !managing && selectProfile(profile.id)}
              className="flex flex-col items-center gap-3 p-3 rounded-2xl transition-all duration-200"
              style={{ cursor: managing ? "default" : "pointer" }}
              whileHover={!managing ? { y: -4 } : {}}
              whileTap={!managing ? { scale: 0.97 } : {}}
            >
              <div
                className="relative flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-lg"
                style={{
                  background: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length],
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                }}
              >
                {profile.name.charAt(0).toUpperCase()}
                {/* Selection ring */}
                {!managing && (
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ border: "2px solid rgba(255,255,255,0.3)" }}
                  />
                )}
              </div>
              <span className="text-[13px] font-medium" style={{ color: "#666" }}>
                {profile.name}
              </span>
            </motion.button>

            <AnimatePresence>
              {managing && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  onClick={() => handleDelete(profile.id)}
                  className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full shadow-lg"
                  style={{ background: "#ef4444" }}
                >
                  <Trash2 className="h-3 w-3 text-white" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {/* Add profile */}
        {profiles.length < 5 && !showCreate && (
          <motion.button
            onClick={() => setShowCreate(true)}
            className="flex flex-col items-center gap-3 p-3 rounded-2xl group"
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
          >
            <div
              className="flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-200 group-hover:border-purple-500"
              style={{ border: "2px dashed #2a2a2a", background: "#0a0a0a" }}
            >
              <Plus className="h-8 w-8 text-zinc-700 group-hover:text-purple-400 transition-colors" />
            </div>
            <span className="text-[13px] font-medium" style={{ color: "#444" }}>Add Profile</span>
          </motion.button>
        )}
      </motion.div>

      {/* Create form */}
      <AnimatePresence>
        {showCreate && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleCreate}
            className="mx-auto mt-8 flex max-w-xs items-center gap-2 overflow-hidden"
          >
            <div
              className="flex-1 overflow-hidden rounded-xl"
              style={{ background: "#0a0a0a", border: "1px solid #2a2a2a" }}
            >
              <input
                placeholder="Profile name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                maxLength={20}
                autoFocus
                className="w-full bg-transparent px-4 py-2.5 text-[13px] text-white outline-none placeholder:text-zinc-700"
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
              whileTap={{ scale: 0.93 }}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <Check className="h-4 w-4 text-white" />}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setShowCreate(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "#111", border: "1px solid #1f1f1f" }}
              whileTap={{ scale: 0.93 }}
            >
              <X className="h-4 w-4 text-zinc-600" />
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Bottom actions */}
      <div className="mt-10 flex justify-center gap-3">
        <motion.button
          onClick={() => setManaging(!managing)}
          className="rounded-xl px-4 py-2 text-[12px] font-medium transition-all"
          style={{
            background: managing ? "rgba(124,58,237,0.12)" : "#0a0a0a",
            border: `1px solid ${managing ? "rgba(124,58,237,0.3)" : "#1f1f1f"}`,
            color: managing ? "#c4b5fd" : "#666",
          }}
          whileTap={{ scale: 0.97 }}
        >
          {managing ? "Done" : "Manage Profiles"}
        </motion.button>
        <motion.button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-[12px] font-medium"
          style={{ background: "#0a0a0a", border: "1px solid #1f1f1f", color: "#666" }}
          whileHover={{ color: "#f87171", borderColor: "rgba(239,68,68,0.2)" }}
          whileTap={{ scale: 0.97 }}
        >
          <LogOut className="h-3.5 w-3.5" /> Sign Out
        </motion.button>
      </div>
    </div>
  );
}
