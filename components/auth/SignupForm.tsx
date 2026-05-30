"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Github, Mail, Loader as Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/profiles");
      router.refresh();
    }
  }

  async function handleOAuth(provider: "google" | "github") {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
  }

  return (
    <div className="w-full max-w-sm space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="text-4xl font-bold tracking-tighter leading-none"
          style={{
            background: "linear-gradient(135deg, #fafafa 0%, #a3a3a3 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          LUMINA
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-zinc-500 tracking-wide"
        >
          Create your account
        </motion.p>
      </div>

      {/* Form */}
      <form onSubmit={handleSignup} className="space-y-6">
        {/* Email Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.05 }}
        >
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              required
              className="w-full bg-transparent border-none border-b border-[#2a2a2a] py-3 text-white placeholder-transparent focus:outline-none focus:border-white transition-all peer"
              placeholder="Email"
            />
            <label
              className={`absolute left-0 transition-all pointer-events-none ${
                email || focusedField === "email"
                  ? "-top-2 text-[10px] uppercase tracking-widest text-zinc-500"
                  : "top-3 text-sm text-zinc-600"
              }`}
            >
              Email
            </label>
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-px bg-white"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: focusedField === "email" ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </div>
        </motion.div>

        {/* Password Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.1 }}
        >
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              required
              className="w-full bg-transparent border-none border-b border-[#2a2a2a] py-3 text-white placeholder-transparent focus:outline-none focus:border-white transition-all peer"
              placeholder="Password"
            />
            <label
              className={`absolute left-0 transition-all pointer-events-none ${
                password || focusedField === "password"
                  ? "-top-2 text-[10px] uppercase tracking-widest text-zinc-500"
                  : "top-3 text-sm text-zinc-600"
              }`}
            >
              Password
            </label>
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-px bg-white"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: focusedField === "password" ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </div>
        </motion.div>

        {/* Confirm Password Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.15 }}
        >
          <div className="relative">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocusedField("confirmPassword")}
              onBlur={() => setFocusedField(null)}
              required
              className="w-full bg-transparent border-none border-b border-[#2a2a2a] py-3 text-white placeholder-transparent focus:outline-none focus:border-white transition-all peer"
              placeholder="Confirm Password"
            />
            <label
              className={`absolute left-0 transition-all pointer-events-none ${
                confirmPassword || focusedField === "confirmPassword"
                  ? "-top-2 text-[10px] uppercase tracking-widest text-zinc-500"
                  : "top-3 text-sm text-zinc-600"
              }`}
            >
              Confirm Password
            </label>
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-px bg-white"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: focusedField === "confirmPassword" ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="text-xs text-red-400 text-center"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.2 }}
        >
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-white text-black font-semibold py-3.5 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              boxShadow: "0 4px 16px rgba(255,255,255,0.15), inset 0 1px 0 rgba(255,255,255,0.5)"
            }}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Create Account
              </>
            )}
          </button>
        </motion.div>
      </form>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="relative"
      >
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#1f1f1f]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-black px-4 text-[10px] uppercase tracking-widest text-zinc-600">
            or continue with
          </span>
        </div>
      </motion.div>

      {/* OAuth Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.3 }}
        className="grid grid-cols-2 gap-3"
      >
        <button
          type="button"
          onClick={() => handleOAuth("google")}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#1f1f1f] py-3 text-sm text-zinc-300 hover:bg-white/5 hover:border-zinc-700 transition-all"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>
        <button
          type="button"
          onClick={() => handleOAuth("github")}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#1f1f1f] py-3 text-sm text-zinc-300 hover:bg-white/5 hover:border-zinc-700 transition-all"
        >
          <Github className="h-4 w-4" />
          GitHub
        </button>
      </motion.div>

      {/* Guest Access */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="relative"
      >
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#1f1f1f]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-black px-4 text-[10px] uppercase tracking-widest text-zinc-600">or</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.4 }}
      >
        <Link
          href="/browse"
          className="flex items-center justify-center gap-2 rounded-lg border border-[#1f1f1f] py-3 text-sm text-zinc-400 hover:bg-white/5 hover:border-zinc-700 transition-all"
        >
          Continue as Guest
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </motion.div>

      {/* Sign In Link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="text-center text-xs text-zinc-600"
      >
        Already have an account?{" "}
        <Link href="/login" className="text-white hover:underline font-medium">
          Sign in
        </Link>
      </motion.p>
    </div>
  );
}
