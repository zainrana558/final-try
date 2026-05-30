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
  { href: "/anime",   label: "Anime", accent: "#e85d8a" },
  { href: "/cartoon", label: "Cartoon", accent: "#e8943c" },
  { href: "/horror",  label: "Horror", accent: "#a04030" },
  { href: "/comedy",  label: "Comedy", accent: "#e8c468" },
  { href: "/action",  label: "Action", accent: "#e8943c" },
  { href: "/romance", label: "Romance", accent: "#c85878" },
  { href: "/scifi",   label: "Sci-Fi", accent: "#5bc4c4" },
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
        background: "linear-gradient(180deg, #0e0c0a 0%, #12100e 40%, #0e0c0a 100%)",
        borderRight: "1px solid #2a2520",
        boxShadow: "4px 0 32px rgba(0,0,0,0.85)",
      }}
    >
      {/* Warm ambient top glow */}
      <div
        className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(212,168,83,0.06) 0%, transparent 60%)",
        }}
      />

      {/* Logo Section */}
      <div className="relative z-10 px-6 pt-8 pb-6">
        <Link href="/browse" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm"
            style={{
              background: "linear-gradient(135deg, #d4a853 0%, #b8883a 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 16px rgba(212,168,83,0.25)",
            }}
          >
            <Film className="h-4 w-4 text-[#080605]" />
          </motion.div>
          <div>
            <span
              className="block text-lg font-bold tracking-tighter leading-none"
              style={{
                background: "linear-gradient(90deg, #f5f0eb, #d4a853)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              LUMINA
            </span>
            <span className="block text-[9px] tracking-widest uppercase mt-0.5" style={{ color: "#6a6054" }}>
              Cinema
            </span>
          </div>
        </Link>
      </div>

      {/* Divider */}
      <div className="relative z-10 mx-6 mb-5 h-px" style={{ background: "linear-gradient(to right, transparent, #2a2520, transparent)" }} />

      {/* Search Shortcut */}
      <div className="relative z-10 px-5 mb-5">
        <Link
          href="/search"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all group card-warm-hover"
          style={{
            background: "rgba(245,240,235,0.03)",
            border: "1px solid #2a2520",
            color: "#7a7168",
          }}
        >
          <div
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
            style={{ background: "rgba(245,240,235,0.05)" }}
          >
            <Search className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm">Search titles…</span>
          <span
            className="ml-auto rounded px-1.5 py-0.5 text-[9px] tracking-widest font-medium uppercase"
            style={{ background: "rgba(245,240,235,0.05)", border: "1px solid #2a2520", color: "#5a544a" }}
          >
            /
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex-1 overflow-y-auto px-5 space-y-0.5 scrollbar-hide">
        <p className="px-3 pb-3 text-[9px] font-semibold uppercase tracking-[0.18em]" style={{ color: "#5a544a" }}>
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
                className="flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all group"
                style={{
                  color: active ? "#f5f0eb" : "#7a7168",
                  background: active ? "rgba(212,168,83,0.08)" : "transparent",
                  border: active ? "1px solid rgba(212,168,83,0.15)" : "1px solid transparent",
                }}
              >
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-all"
                  style={{
                    background: active
                      ? "linear-gradient(135deg, #d4a853 0%, #b8883a 100%)"
                      : "rgba(245,240,235,0.05)",
                    boxShadow: active
                      ? "0 4px 16px rgba(212,168,83,0.2), inset 0 1px 0 rgba(255,255,255,0.2)"
                      : "none",
                  }}
                >
                  <Icon className="h-4 w-4 transition-colors" style={{ color: active ? "#080605" : "#7a7168" }} />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="block leading-none">{label}</span>
                  {active && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="block text-[9px] tracking-widest uppercase mt-0.5"
                      style={{ color: "#9c948a" }}
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
                    style={{ background: "#d4a853", boxShadow: "0 0 8px rgba(212,168,83,0.5)" }}
                  />
                )}
              </Link>
            );
          })}

        {/* Genres Section */}
        <div className="pt-5">
          <div className="mb-4 mx-3 h-px" style={{ background: "linear-gradient(to right, transparent, #2a2520, transparent)" }} />

          <p className="px-3 pb-3 text-[9px] font-semibold uppercase tracking-[0.18em]" style={{ color: "#5a544a" }}>
            Genres
          </p>

          <button
            onClick={() => setGenreOpen(!genreOpen)}
            className="flex w-full items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-[rgba(245,240,235,0.03)]"
            style={{ color: "#7a7168" }}
          >
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
              style={{ background: "rgba(245,240,235,0.05)" }}
            >
              <Sparkles className="h-4 w-4" />
            </div>
            <span>All Genres</span>
            <motion.div
              animate={{ rotate: genreOpen ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="ml-auto"
            >
              <ChevronDown className="h-3.5 w-3.5" />
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
                style={{ borderColor: "#2a2520" }}
              >
                {genreLinks.map(({ href, label, accent }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-all hover:bg-[rgba(245,240,235,0.03)]"
                      style={{
                        color: active ? "#f5f0eb" : "#7a7168",
                        background: active ? "rgba(245,240,235,0.05)" : "transparent",
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: accent,
                          boxShadow: active ? `0 0 6px ${accent}` : "none",
                        }}
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
      <div className="relative z-10 mx-6 my-3 h-px" style={{ background: "linear-gradient(to right, transparent, #2a2520, transparent)" }} />

      {/* User Section */}
      <div className="relative z-10 px-5 pb-6">
        {isGuest ? (
          <Link
            href="/login"
            className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all"
            style={{
              background: "linear-gradient(135deg, #f5f0eb 0%, #d4a853 100%)",
              color: "#080605",
              boxShadow: "0 4px 16px rgba(212,168,83,0.2), inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "rgba(8,6,5,0.15)" }}>
              <LogIn className="h-4 w-4" />
            </div>
            <span>Sign In</span>
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex w-full items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-[rgba(245,240,235,0.03)]"
              style={{ color: "#7a7168" }}
            >
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: "linear-gradient(135deg, #2a2520 0%, #1a1612 100%)",
                  border: "1px solid #3a352e",
                }}
              >
                <User className="h-3.5 w-3.5" style={{ color: "#d4a853" }} />
              </div>
              <span>My Account</span>
              <motion.div
                animate={{ rotate: userMenuOpen ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="ml-auto"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </motion.div>
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute bottom-full left-0 mb-2 w-full rounded-xl p-1.5"
                  style={{
                    background: "#12100e",
                    border: "1px solid #2a2520",
                    boxShadow: "0 -8px 32px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05)",
                  }}
                >
                  <Link
                    href="/profiles"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-[rgba(245,240,235,0.05)]"
                    style={{ color: "#9c948a" }}
                  >
                    <User className="h-4 w-4" />
                    Switch Profile
                  </Link>
                  <Link
                    href="/history"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-[rgba(245,240,235,0.05)]"
                    style={{ color: "#9c948a" }}
                  >
                    <Film className="h-4 w-4" />
                    Watch History
                  </Link>
                  <div className="my-1 mx-2 h-px" style={{ background: "#2a2520" }} />
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-[rgba(199,92,58,0.1)]"
                    style={{ color: "#c75c3a" }}
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
