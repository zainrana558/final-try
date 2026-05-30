"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Chrome as Home, Film, Tv, Heart, Search, LogOut, LogIn, User, ChevronDown, Sparkles, History } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const genreLinks = [
  { href: "/anime",   label: "Anime", accent: "#ff006e" },
  { href: "/cartoon", label: "Cartoon", accent: "#f97316" },
  { href: "/horror",  label: "Horror", accent: "#8b0000" },
  { href: "/comedy",  label: "Comedy", accent: "#fbbf24" },
  { href: "/action",  label: "Action", accent: "#f97316" },
  { href: "/romance", label: "Romance", accent: "#be185d" },
  { href: "/scifi",   label: "Sci-Fi", accent: "#00f0ff" },
];

const mainLinks = [
  { href: "/browse",  icon: Home,    label: "Home" },
  { href: "/movies",  icon: Film,    label: "Movies" },
  { href: "/tv",      icon: Tv,      label: "TV Shows" },
  { href: "/my-list", icon: Heart,   label: "My List",  authOnly: true },
  { href: "/search",  icon: Search,  label: "Search" },
  { href: "/history", icon: History, label: "History",  authOnly: true },
];

interface SidebarProps {
  isGuest?: boolean;
}

export default function Sidebar({ isGuest = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [genreOpen, setGenreOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside
      className="fixed left-0 top-0 z-50 hidden h-screen w-[260px] flex-col md:flex"
      style={{
        background: "linear-gradient(180deg, #000000 0%, #050505 40%, #000000 100%)",
        borderRight: "1px solid #1f1f1f",
        boxShadow: "4px 0 32px rgba(0,0,0,0.9)",
      }}
    >
      {/* Logo Section */}
      <div className="relative z-10 px-6 pt-8 pb-6">
        <Link href="/browse" className="flex items-center gap-3 group">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm"
            style={{
              background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
              border: "1px solid #3a3a3a",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.7)"
            }}
          >
            <Film className="h-4 w-4 text-white" />
          </div>
          <div>
            <span
              className="block text-lg font-bold tracking-tighter leading-none"
              style={{
                background: "linear-gradient(90deg, #fafafa, #a3a3a3)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              LUMINA
            </span>
            <span className="block text-[9px] tracking-widest uppercase text-zinc-600 mt-0.5">
              Cinema
            </span>
          </div>
        </Link>
      </div>

      {/* Divider */}
      <div className="relative z-10 mx-6 mb-5 h-px bg-gradient-to-r from-transparent via-[#1f1f1f] to-transparent" />

      {/* Search Shortcut */}
      <div className="relative z-10 px-5 mb-5">
        <Link
          href="/search"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all group"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid #1f1f1f",
            color: "#737373",
          }}
        >
          <div
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <Search className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm">Search titles…</span>
          <span
            className="ml-auto rounded px-1.5 py-0.5 text-[9px] tracking-widest font-medium uppercase"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #2a2a2a", color: "#525252" }}
          >
            /
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex-1 overflow-y-auto px-5 space-y-0.5 scrollbar-hide">
        <p className="px-3 pb-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
          Navigate
        </p>

        {mainLinks
          .filter((l) => !(isGuest && l.authOnly))
          .filter((l) => l.href !== "/search")
          .map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== "/browse" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group"
                style={{
                  color: active ? "#fafafa" : "#737373",
                  background: active ? "rgba(255,255,255,0.05)" : "transparent",
                  border: "1px solid transparent",
                }}
              >
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-all"
                  style={{
                    background: active
                      ? "linear-gradient(135deg, #fafafa 0%, #d4d4d4 100%)"
                      : "rgba(255,255,255,0.05)",
                    boxShadow: active
                      ? "0 4px 16px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)"
                      : "none"
                  }}
                >
                  <Icon className="h-4 w-4" style={{ color: active ? "#000" : "#737373" }} />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="block leading-none">{label}</span>
                  {active && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="block text-[9px] tracking-widest uppercase mt-0.5 text-zinc-500"
                    >
                      Now Viewing
                    </motion.span>
                  )}
                </div>

                {active && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: "#fafafa", boxShadow: "0 0 8px rgba(255,255,255,0.5)" }}
                  />
                )}
              </Link>
            );
          })}

        {/* Genres Section */}
        <div className="pt-5">
          <div className="mb-4 mx-3 h-px bg-gradient-to-r from-transparent via-[#1f1f1f] to-transparent" />

          <p className="px-3 pb-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Genres
          </p>

          <button
            onClick={() => setGenreOpen(!genreOpen)}
            className="flex w-full items-center gap-3.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all"
            style={{ color: "#737373" }}
          >
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <Sparkles className="h-4 w-4" />
            </div>
            <span>All Genres</span>
            <motion.div
              animate={{ rotate: genreOpen ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <ChevronDown className="ml-auto h-3.5 w-3.5" />
            </motion.div>
          </button>

          <AnimatePresence>
            {genreOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="mt-1 ml-4 space-y-0.5 border-l pl-4 overflow-hidden"
                style={{ borderColor: "#1f1f1f" }}
              >
                {genreLinks.map(({ href, label, accent }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-all"
                      style={{
                        color: active ? "#fafafa" : "#737373",
                        background: active ? "rgba(255,255,255,0.05)" : "transparent",
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: accent }}
                      />
                      {label}
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Divider */}
      <div className="relative z-10 mx-6 my-3 h-px bg-gradient-to-r from-transparent via-[#1f1f1f] to-transparent" />

      {/* User Section */}
      <div className="relative z-10 px-5 pb-6">
        {isGuest ? (
          <Link
            href="/login"
            className="flex items-center gap-3.5 rounded-lg px-4 py-3 text-sm font-semibold text-black transition-all"
            style={{
              background: "linear-gradient(135deg, #fafafa 0%, #d4d4d4 100%)",
              boxShadow: "0 4px 16px rgba(255,255,255,0.15), inset 0 1px 0 rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.2)"
            }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/10">
              <LogIn className="h-4 w-4" />
            </div>
            <span>Sign In</span>
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex w-full items-center gap-3.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all"
              style={{ color: "#737373" }}
            >
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
                  border: "1px solid #3a3a3a"
                }}
              >
                <User className="h-3.5 w-3.5 text-white" />
              </div>
              <span>My Account</span>
              <motion.div
                animate={{ rotate: userMenuOpen ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <ChevronDown className="ml-auto h-3.5 w-3.5" />
              </motion.div>
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute bottom-full left-0 mb-2 w-full rounded-lg p-1 shadow-2xl"
                  style={{
                    background: "#0a0a0a",
                    border: "1px solid #1f1f1f",
                    boxShadow: "0 -8px 32px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05)"
                  }}
                >
                  <Link
                    href="/profiles"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <User className="h-4 w-4" />
                    Switch Profile
                  </Link>
                  <Link
                    href="/history"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <Film className="h-4 w-4" />
                    Watch History
                  </Link>
                  <div className="my-1 mx-2 h-px bg-[#1f1f1f]" />
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </aside>
  );
}
