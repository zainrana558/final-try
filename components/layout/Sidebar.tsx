"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Film, Tv, Heart, Search, LogOut, LogIn,
  User, ChevronDown, Clapperboard, Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const genreLinks = [
  { href: "/anime",   label: "Anime",   accent: "#ff6b9d" },
  { href: "/cartoon", label: "Cartoon", accent: "#fbbf24" },
  { href: "/horror",  label: "Horror",  accent: "#ef4444" },
  { href: "/comedy",  label: "Comedy",  accent: "#facc15" },
  { href: "/action",  label: "Action",  accent: "#38bdf8" },
  { href: "/romance", label: "Romance", accent: "#fb7185" },
  { href: "/scifi",   label: "Sci-Fi",  accent: "#a78bfa" },
];

const mainLinks = [
  { href: "/browse",  icon: Home,   label: "Home" },
  { href: "/movies",  icon: Film,   label: "Movies" },
  { href: "/tv",      icon: Tv,     label: "TV Shows" },
  { href: "/my-list", icon: Heart,  label: "My List",  authOnly: true },
  { href: "/search",  icon: Search, label: "Search" },
];

interface SidebarProps { isGuest?: boolean; }

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
      className="fixed left-0 top-0 z-50 hidden h-screen w-[220px] flex-col md:flex"
      style={{
        background: "#060606",
        borderRight: "1px solid #141414",
        boxShadow: "4px 0 24px rgba(0,0,0,0.6)",
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-7 pb-7">
        <Link href="/browse" className="flex items-center gap-2.5 group">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              boxShadow: "0 0 16px rgba(124,58,237,0.5)",
            }}
          >
            <Clapperboard className="h-4 w-4 text-white" />
          </div>
          <span
            className="text-lg font-bold tracking-tight"
            style={{
              fontFamily: "var(--font-display, Syne, sans-serif)",
              background: "linear-gradient(90deg, #c4b5fd, #f9a8d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Lumina
          </span>
        </Link>
      </div>

      {/* Search shortcut */}
      <div className="px-4 mb-5">
        <Link
          href="/search"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-200 group"
          style={{
            background: "#0f0f0f",
            border: "1px solid #1f1f1f",
            color: "#666",
          }}
        >
          <Search className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="text-xs tracking-wide" style={{ fontFamily: "var(--font-mono)" }}>Search…</span>
          <span
            className="ml-auto rounded px-1 text-[9px] tracking-widest uppercase"
            style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#444" }}
          >
            /
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5 no-scrollbar">
        <p className="px-2 pb-2 text-[9px] font-semibold uppercase tracking-[0.15em]" style={{ color: "#333" }}>
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
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 relative group",
                  active ? "text-white" : "text-zinc-500 hover:text-zinc-200"
                )}
                style={active ? {
                  background: "linear-gradient(90deg, rgba(124,58,237,0.18), rgba(236,72,153,0.06))",
                  borderLeft: "2px solid #7c3aed",
                  paddingLeft: "calc(0.75rem - 2px)",
                } : {}}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="text-[13px]">{label}</span>
                {active && (
                  <div
                    className="absolute right-3 h-1 w-1 rounded-full"
                    style={{ background: "#7c3aed", boxShadow: "0 0 6px #7c3aed" }}
                  />
                )}
              </Link>
            );
          })}

        {/* Genres */}
        <div className="pt-5">
          <p className="px-2 pb-2 text-[9px] font-semibold uppercase tracking-[0.15em]" style={{ color: "#333" }}>
            Genres
          </p>
          <button
            onClick={() => setGenreOpen(!genreOpen)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-200 transition-all duration-200"
          >
            <Sparkles className="h-4 w-4 flex-shrink-0" />
            <span className="text-[13px]">All Genres</span>
            <motion.div
              className="ml-auto"
              animate={{ rotate: genreOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-3 w-3" />
            </motion.div>
          </button>

          <AnimatePresence>
            {genreOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="overflow-hidden ml-3 mt-0.5 border-l pl-4"
                style={{ borderColor: "#1a1a1a" }}
              >
                {genreLinks.map(({ href, label, accent }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[12px] font-medium transition-all duration-150 group"
                      style={{ color: active ? accent : "#4a4a4a" }}
                    >
                      <div
                        className="h-1.5 w-1.5 rounded-full flex-shrink-0 transition-all"
                        style={{ background: active ? accent : "#2a2a2a" }}
                      />
                      <span className="group-hover:text-zinc-200 transition-colors">{label}</span>
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Divider */}
      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #1f1f1f 30%, #1f1f1f 70%, transparent)" }} />

      {/* User section */}
      <div className="px-3 py-4">
        {isGuest ? (
          <Link
            href="/login"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-white transition-all duration-200 relative overflow-hidden group"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              boxShadow: "0 4px 20px rgba(124,58,237,0.3)",
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(135deg, #6d28d9, #9333ea)" }}
            />
            <LogIn className="h-4 w-4 relative z-10" />
            <span className="relative z-10 text-[13px]">Sign In</span>
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-all duration-200 hover:bg-white/[0.03]"
            >
              <div
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
                style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
              >
                <User className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[13px]">My Account</span>
              <motion.div className="ml-auto" animate={{ rotate: userMenuOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="h-3 w-3" />
              </motion.div>
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute bottom-full left-0 mb-2 w-full rounded-xl p-1.5 shadow-2xl"
                  style={{ background: "#0f0f0f", border: "1px solid #1f1f1f" }}
                >
                  <Link
                    href="/profiles"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] text-zinc-400 hover:bg-white/[0.04] hover:text-white transition-all duration-150"
                  >
                    <User className="h-3.5 w-3.5" /> Switch Profile
                  </Link>
                  <Link
                    href="/history"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] text-zinc-400 hover:bg-white/[0.04] hover:text-white transition-all duration-150"
                  >
                    <Film className="h-3.5 w-3.5" /> Watch History
                  </Link>
                  <div style={{ height: "1px", background: "#1a1a1a", margin: "4px 0" }} />
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] text-red-500 hover:bg-red-500/10 transition-all duration-150"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign Out
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
