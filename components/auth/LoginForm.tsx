"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Github, Mail, Loader2, Eye, EyeOff, Clapperboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message === "Invalid login credentials"
        ? "Invalid email or password."
        : error.message);
      setLoading(false);
    } else {
      router.push("/profiles");
      router.refresh();
    }
  }

  async function handleOAuth(provider: "google" | "github") {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
  }

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2.5 mb-6">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}
          >
            <Clapperboard className="h-4.5 w-4.5 text-white" />
          </div>
          <span
            className="text-2xl font-bold tracking-tight"
            style={{
              fontFamily: "var(--font-display, Syne, sans-serif)",
              background: "linear-gradient(90deg, #c4b5fd, #f9a8d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Lumina
          </span>
        </div>
        <h2 className="text-xl font-semibold text-white tracking-tight">Welcome back</h2>
        <p className="mt-1 text-[13px]" style={{ color: "#555" }}>Sign in to continue watching</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-3">
        {/* Email */}
        <div
          className="relative overflow-hidden rounded-xl transition-all duration-200 focus-within:ring-1"
          style={{
            background: "#0a0a0a",
            border: "1px solid #1f1f1f",
          }}
        >
          <label className="block px-4 pt-2.5 text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "#444" }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-transparent px-4 pb-3 pt-1 text-[13px] text-white outline-none placeholder:text-zinc-700"
            placeholder="you@example.com"
          />
        </div>

        {/* Password */}
        <div
          className="relative overflow-hidden rounded-xl transition-all duration-200"
          style={{ background: "#0a0a0a", border: "1px solid #1f1f1f" }}
        >
          <label className="block px-4 pt-2.5 text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "#444" }}>
            Password
          </label>
          <div className="flex items-center pr-3">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="flex-1 bg-transparent px-4 pb-3 pt-1 text-[13px] text-white outline-none placeholder:text-zinc-700"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="flex-shrink-0 transition-colors"
              style={{ color: "#444" }}
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-xl px-4 py-3 text-[12px]"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={loading}
          className="relative w-full overflow-hidden rounded-xl py-3 text-[13px] font-semibold text-white transition-all"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
          }}
          whileHover={{ boxShadow: "0 6px 28px rgba(124,58,237,0.5)" }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : (
            <span className="flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" /> Sign In
            </span>
          )}
        </motion.button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: "#1a1a1a" }} />
        <span className="text-[11px] uppercase tracking-[0.12em]" style={{ color: "#333" }}>or</span>
        <div className="flex-1 h-px" style={{ background: "#1a1a1a" }} />
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-3">
        {([
          { provider: "google" as const, label: "Google", icon: (
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          )},
          { provider: "github" as const, label: "GitHub", icon: <Github className="h-4 w-4" /> },
        ]).map(({ provider, label, icon }) => (
          <motion.button
            key={provider}
            onClick={() => handleOAuth(provider)}
            className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-[12px] font-medium text-zinc-400 transition-all"
            style={{ background: "#0a0a0a", border: "1px solid #1f1f1f" }}
            whileHover={{ color: "#fff", borderColor: "#2a2a2a" }}
            whileTap={{ scale: 0.97 }}
          >
            {icon} {label}
          </motion.button>
        ))}
      </div>

      <Link href="/browse">
        <motion.div
          className="w-full text-center rounded-xl py-2.5 text-[12px] font-medium transition-all"
          style={{ color: "#444" }}
          whileHover={{ color: "#888" }}
        >
          Continue as Guest →
        </motion.div>
      </Link>

      <p className="mt-5 text-center text-[12px]" style={{ color: "#444" }}>
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="transition-colors" style={{ color: "#7c3aed" }}>
          Sign up
        </Link>
      </p>
    </div>
  );
}
