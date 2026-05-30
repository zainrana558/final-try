"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, User, LogOut, LogIn, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  isGuest?: boolean;
}

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
  { href: "/browse", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV Shows" },
];

export default function Navbar({ isGuest = false }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [genreOpen, setGenreOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="fixed top-0 z-50 w-full bg-black border-b border-[#1f1f1f]">
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <Link
            href="/browse"
            className="text-xl font-bold tracking-tighter leading-none"
            style={{
              background: "linear-gradient(135deg, #fafafa 0%, #a3a3a3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            LUMINA
          </Link>

          {/* Main Navigation with Layout Morphing */}
          <div className="hidden items-center gap-1 md:flex">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {link.label}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px bg-white"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hoveredLink === link.href ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              </Link>
            ))}

            {!isGuest && (
              <Link
                href="/my-list"
                className="relative px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                onMouseEnter={() => setHoveredLink("/my-list")}
                onMouseLeave={() => setHoveredLink(null)}
              >
                My List
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px bg-white"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hoveredLink === "/my-list" ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              </Link>
            )}

            {/* Genres Dropdown */}
            <div className="relative">
              <button
                onClick={() => setGenreOpen(!genreOpen)}
                onBlur={() => setTimeout(() => setGenreOpen(false), 150)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Genres
                <ChevronDown className="h-3 w-3" />
              </button>

              <AnimatePresence>
                {genreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute left-0 top-full mt-2 w-48 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-1 shadow-2xl"
                    style={{
                      boxShadow: "0 8px 32px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05)"
                    }}
                  >
                    {genreLinks.map(({ href, label, accent }) => (
                      <Link
                        key={href}
                        href={href}
                        className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 transition-all group"
                        onClick={() => setGenreOpen(false)}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full transition-all group-hover:scale-150"
                          style={{ background: accent }}
                        />
                        {label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <AnimatePresence mode="wait">
            {searchOpen ? (
              <motion.form
                key="search-input"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleSearch}
                className="flex items-center relative"
              >
                <Input
                  type="text"
                  placeholder="Titles, people, genres"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-56 md:w-72 bg-[#0a0a0a] border-[#1f1f1f] focus:border-white text-white placeholder-zinc-500"
                  style={{
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)"
                  }}
                  autoFocus
                  onBlur={() => !searchQuery && setSearchOpen(false)}
                />
              </motion.form>
            ) : (
              <motion.button
                key="search-button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSearchOpen(true)}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <Search className="h-5 w-5" />
              </motion.button>
            )}
          </AnimatePresence>

          {isGuest ? (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                boxShadow: "0 4px 16px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,1)"
              }}
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
          ) : (
            <>
              <button className="p-2 text-zinc-400 hover:text-white transition-colors relative">
                <Bell className="h-5 w-5" />
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-black" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 p-2 text-zinc-400 hover:text-white transition-colors"
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{
                      background: "linear-gradient(135deg, #2a2a2a, #1a1a1a)",
                      border: "1px solid #2a2a2a"
                    }}
                  >
                    <User className="h-4 w-4" />
                  </div>
                  <ChevronDown className="h-3 w-3" />
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-[#1f1f1f] bg-[#0a0a0a] p-1.5 shadow-2xl"
                      style={{
                        boxShadow: "0 8px 32px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05)"
                      }}
                    >
                      <Link
                        href="/profiles"
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 transition-all"
                        onClick={() => setMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Switch Profile
                      </Link>
                      <Link
                        href="/history"
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 transition-all"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Bell className="h-4 w-4" />
                        Watch History
                      </Link>
                      <div className="my-1 mx-2 h-px bg-[#1f1f1f]" />
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Genre Scroll */}
      <div className="md:hidden overflow-x-auto scrollbar-hide border-t border-[#1f1f1f] bg-black">
        <div className="flex gap-2 px-4 py-3" style={{ width: "max-content" }}>
          {genreLinks.map(({ href, label, accent }) => (
            <Link
              key={href}
              href={href}
              className="flex-shrink-0 rounded-lg px-4 py-2 text-xs font-medium text-zinc-300 border border-[#1f1f1f] hover:border-zinc-600 transition-all"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
