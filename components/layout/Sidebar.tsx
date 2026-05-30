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

const genreLinks = [
  { href: "/anime",   label: "Anime" },
  { href: "/cartoon", label: "Cartoon" },
  { href: "/horror",  label: "Horror" },
  { href: "/comedy",  label: "Comedy" },
  { href: "/action",  label: "Action" },
  { href: "/romance", label: "Romance" },
  { href: "/scifi",   label: "Sci-Fi" },
];

const mainLinks = [
  { href: "/browse",  icon: Home,       label: "Home" },
  { href: "/movies",  icon: Film,       label: "Movies" },
  { href: "/tv",      icon: Tv,         label: "TV Shows" },
  { href: "/my-list", icon: Heart,      label: "My List",   authOnly: true },
  { href: "/search",  icon: Search,     label: "Search" },
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
      className="fixed left-0 top-0 z-50 hidden h-screen w-[240px] flex-col md:flex"
      style={{
        background: "#0a0a0a",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div className="px-6 pt-7 pb-8">
        <Link
          href="/browse"
          className="flex items-center gap-2 group"
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
          >
            <Clapperboard className="h-4 w-4 text-white" />
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ background: "linear-gradient(90deg, #a78bfa, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            Lumina
          </span>
        </Link>
      </div>

      {/* Search shortcut */}
      <div className="px-4 mb-6">
        <Link
          href="/search"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "#a1a1aa",
          }}
        >
          <Search className="h-4 w-4 flex-shrink-0" />
          <span>Search titles…</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-0.5">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
          Menu
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
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "text-white"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
                style={active ? {
                  background: "linear-gradient(90deg, rgba(124,58,237,0.25), rgba(236,72,153,0.1))",
                  borderLeft: "2px solid #7c3aed",
                  paddingLeft: "calc(0.75rem - 2px)",
                } : {}}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}

        {/* Genres collapsible */}
        <div className="pt-4">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
            Genres
          </p>
          <button
            onClick={() => setGenreOpen(!genreOpen)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <Sparkles className="h-4 w-4 flex-shrink-0" />
            <span>All Genres</span>
            <ChevronDown
              className={cn("ml-auto h-3.5 w-3.5 transition-transform duration-200", genreOpen && "rotate-180")}
            />
          </button>
          {genreOpen && (
            <div className="mt-0.5 ml-3 space-y-0.5 border-l border-white/5 pl-4">
              {genreLinks.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "block rounded-md px-2 py-1.5 text-xs transition-all duration-200",
                      active ? "text-purple-400 font-medium" : "text-zinc-500 hover:text-zinc-200"
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* User section */}
      <div className="border-t border-white/5 px-4 py-4">
        {isGuest ? (
          <Link
            href="/login"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition-all duration-200"
            style={{ background: "linear-gradient(90deg, #7c3aed, #a855f7)" }}
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <div
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
                style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
              >
                <User className="h-3.5 w-3.5 text-white" />
              </div>
              <span>My Account</span>
              <ChevronDown className={cn("ml-auto h-3.5 w-3.5 transition-transform duration-200", userMenuOpen && "rotate-180")} />
            </button>

            {userMenuOpen && (
              <div
                className="absolute bottom-full left-0 mb-2 w-full rounded-lg p-1 shadow-2xl"
                style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Link
                  href="/profiles"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-all duration-200"
                >
                  <User className="h-4 w-4" />
                  Switch Profile
                </Link>
                <Link
                  href="/history"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-all duration-200"
                >
                  <Film className="h-4 w-4" />
                  Watch History
                </Link>
                <hr className="my-1 border-white/5" />
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-white/5 transition-all duration-200"
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
