"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Film, Tv, Heart, Search, LogOut, LogIn,
  User, ChevronDown, Sparkles, History,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const genreLinks = [
  { href: "/anime",   label: "Anime",   emoji: "🌸" },
  { href: "/cartoon", label: "Cartoon", emoji: "🎨" },
  { href: "/horror",  label: "Horror",  emoji: "💀" },
  { href: "/comedy",  label: "Comedy",  emoji: "😂" },
  { href: "/action",  label: "Action",  emoji: "⚡" },
  { href: "/romance", label: "Romance", emoji: "❤️" },
  { href: "/scifi",   label: "Sci-Fi",  emoji: "🚀" },
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
        background: "linear-gradient(180deg, #0f0a00 0%, #110800 40%, #0a0500 100%)",
        borderRight: "1px solid rgba(180,120,40,0.12)",
        boxShadow: "4px 0 32px rgba(0,0,0,0.7)",
      }}
    >
      {/* Subtle star-field overlay */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ zIndex: 0 }}
      >
        {[...Array(28)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: i % 5 === 0 ? 2 : 1,
              height: i % 5 === 0 ? 2 : 1,
              top: `${(i * 37 + 11) % 100}%`,
              left: `${(i * 53 + 7) % 100}%`,
              background: "rgba(255,220,120,0.35)",
              boxShadow: i % 4 === 0 ? "0 0 3px rgba(255,200,80,0.5)" : "none",
              animation: `pulse ${2 + (i % 3)}s ease-in-out ${(i * 0.3) % 2}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          from { opacity: 0.2; }
          to   { opacity: 0.8; }
        }
      `}</style>

      {/* ── Logo ── */}
      <div className="relative z-10 px-6 pt-8 pb-7">
        <Link href="/browse" className="flex items-center gap-3 group">
          {/* Film-reel icon box with amber glow */}
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg"
            style={{
              background: "linear-gradient(135deg, #92400e, #b45309)",
              boxShadow: "0 0 18px rgba(180,83,9,0.55), inset 0 1px 0 rgba(255,200,80,0.2)",
            }}
          >
            🎬
          </div>
          <div>
            <span
              className="block text-lg font-bold leading-none"
              style={{
                background: "linear-gradient(90deg, #fbbf24, #f59e0b, #d97706)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.02em",
              }}
            >
              Lumina
            </span>
            <span className="block text-[10px] tracking-widest uppercase" style={{ color: "rgba(180,120,40,0.6)" }}>
              Cinema
            </span>
          </div>
        </Link>
      </div>

      {/* Ink divider */}
      <div className="relative z-10 mx-6 mb-5" style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(180,120,40,0.25), transparent)" }} />

      {/* ── Search shortcut ── */}
      <div className="relative z-10 px-5 mb-5">
        <Link
          href="/search"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 group"
          style={{
            background: "rgba(180,120,40,0.07)",
            border: "1px solid rgba(180,120,40,0.15)",
            color: "rgba(200,160,80,0.7)",
          }}
        >
          <div
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
            style={{ background: "rgba(180,120,40,0.15)" }}
          >
            <Search className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm">Search titles…</span>
          <span
            className="ml-auto rounded px-1.5 py-0.5 text-[9px] tracking-widest font-medium uppercase"
            style={{ background: "rgba(180,120,40,0.1)", border: "1px solid rgba(180,120,40,0.2)", color: "rgba(180,120,40,0.5)" }}
          >
            /
          </span>
        </Link>
      </div>

      {/* ── Nav ── */}
      <nav className="relative z-10 flex-1 overflow-y-auto px-5 space-y-1" style={{ scrollbarWidth: "none" }}>
        <p className="px-3 pb-3 text-[9px] font-semibold uppercase tracking-[0.18em]" style={{ color: "rgba(180,120,40,0.4)" }}>
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
                  "flex items-center gap-3.5 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 group",
                  active ? "text-amber-200" : "text-amber-900/70 hover:text-amber-300"
                )}
                style={active ? {
                  background: "linear-gradient(90deg, rgba(180,83,9,0.3), rgba(180,83,9,0.08))",
                  border: "1px solid rgba(180,120,40,0.25)",
                  boxShadow: "inset 0 1px 0 rgba(255,200,80,0.08)",
                } : {
                  border: "1px solid transparent",
                }}
              >
                {/* Icon box */}
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200"
                  style={active ? {
                    background: "linear-gradient(135deg, #92400e, #b45309)",
                    boxShadow: "0 0 12px rgba(180,83,9,0.5)",
                  } : {
                    background: "rgba(180,120,40,0.08)",
                  }}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="block leading-none">{label}</span>
                  {active && (
                    <span className="block text-[9px] tracking-widest uppercase mt-0.5" style={{ color: "rgba(251,191,36,0.5)" }}>
                      Now Viewing
                    </span>
                  )}
                </div>

                {active && (
                  <div
                    className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{ background: "#fbbf24", boxShadow: "0 0 6px rgba(251,191,36,0.8)" }}
                  />
                )}
              </Link>
            );
          })}

        {/* ── Genres collapsible ── */}
        <div className="pt-5">
          {/* Ink divider */}
          <div className="mb-4 mx-3" style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(180,120,40,0.2), transparent)" }} />

          <p className="px-3 pb-3 text-[9px] font-semibold uppercase tracking-[0.18em]" style={{ color: "rgba(180,120,40,0.4)" }}>
            Genres
          </p>

          <button
            onClick={() => setGenreOpen(!genreOpen)}
            className="flex w-full items-center gap-3.5 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200"
            style={{
              color: "rgba(200,160,80,0.7)",
              border: "1px solid transparent",
            }}
          >
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
              style={{ background: "rgba(180,120,40,0.08)" }}
            >
              <Sparkles className="h-4 w-4" />
            </div>
            <span>All Genres</span>
            <ChevronDown
              className={cn("ml-auto h-3.5 w-3.5 transition-transform duration-200", genreOpen && "rotate-180")}
            />
          </button>

          {genreOpen && (
            <div
              className="mt-1 ml-4 space-y-0.5 border-l pl-4"
              style={{ borderColor: "rgba(180,120,40,0.15)" }}
            >
              {genreLinks.map(({ href, label, emoji }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-all duration-200",
                      active ? "text-amber-300 font-medium" : "text-amber-900/60 hover:text-amber-300"
                    )}
                    style={active ? { background: "rgba(180,83,9,0.2)" } : {}}
                  >
                    <span className="text-base leading-none">{emoji}</span>
                    {label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* ── Ink divider ── */}
      <div className="relative z-10 mx-6 my-3" style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(180,120,40,0.2), transparent)" }} />

      {/* ── User section ── */}
      <div className="relative z-10 px-5 pb-6">
        {isGuest ? (
          <Link
            href="/login"
            className="flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-semibold text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #92400e, #b45309)",
              boxShadow: "0 4px 20px rgba(180,83,9,0.4)",
              border: "1px solid rgba(255,200,80,0.15)",
            }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "rgba(0,0,0,0.2)" }}>
              <LogIn className="h-4 w-4" />
            </div>
            <span>Sign In</span>
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex w-full items-center gap-3.5 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200"
              style={{ color: "rgba(200,160,80,0.8)", border: "1px solid transparent" }}
            >
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: "linear-gradient(135deg, #92400e, #b45309)",
                  boxShadow: "0 0 10px rgba(180,83,9,0.4)",
                }}
              >
                <User className="h-3.5 w-3.5 text-white" />
              </div>
              <span>My Account</span>
              <ChevronDown className={cn("ml-auto h-3.5 w-3.5 transition-transform duration-200", userMenuOpen && "rotate-180")} />
            </button>

            {userMenuOpen && (
              <div
                className="absolute bottom-full left-0 mb-2 w-full rounded-xl p-1.5 shadow-2xl"
                style={{
                  background: "#1a0f00",
                  border: "1px solid rgba(180,120,40,0.2)",
                  boxShadow: "0 -8px 32px rgba(0,0,0,0.6)",
                }}
              >
                <Link
                  href="/profiles"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all duration-200"
                  style={{ color: "rgba(200,160,80,0.8)" }}
                >
                  <User className="h-4 w-4" />
                  Switch Profile
                </Link>
                <Link
                  href="/history"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all duration-200"
                  style={{ color: "rgba(200,160,80,0.8)" }}
                >
                  <Film className="h-4 w-4" />
                  Watch History
                </Link>
                <div className="my-1 mx-2" style={{ height: 1, background: "rgba(180,120,40,0.15)" }} />
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-red-400 transition-all duration-200 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
