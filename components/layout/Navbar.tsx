"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, User, LogOut, LogIn, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  isGuest?: boolean;
}

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
    <nav
      className="fixed top-0 z-50 w-full"
      style={{
        background: "#0e0c0a",
        borderBottom: "1px solid #2a2520",
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <Link
            href="/browse"
            className="text-xl font-bold tracking-tighter leading-none"
            style={{
              background: "linear-gradient(135deg, #f5f0eb 0%, #d4a853 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            LUMINA
          </Link>

          {/* Main Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium transition-colors"
                style={{ color: "#7a7168" }}
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <span className="transition-colors" style={{ color: hoveredLink === link.href ? "#f5f0eb" : "#7a7168" }}>
                  {link.label}
                </span>
                <motion.div
                  className="absolute bottom-0 left-4 right-4 h-px"
                  style={{ background: "#d4a853" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hoveredLink === link.href ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              </Link>
            ))}

            {!isGuest && (
              <Link
                href="/my-list"
                className="relative px-4 py-2 text-sm font-medium transition-colors"
                onMouseEnter={() => setHoveredLink("/my-list")}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <span style={{ color: hoveredLink === "/my-list" ? "#f5f0eb" : "#7a7168" }}>My List</span>
                <motion.div
                  className="absolute bottom-0 left-4 right-4 h-px"
                  style={{ background: "#d4a853" }}
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
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors"
                style={{ color: "#7a7168" }}
              >
                <span>Genres</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              <AnimatePresence>
                {genreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute left-0 top-full mt-2 w-48 rounded-xl p-1"
                    style={{
                      background: "#12100e",
                      border: "1px solid #2a2520",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05)",
                    }}
                  >
                    {genreLinks.map(({ href, label, accent }) => (
                      <Link
                        key={href}
                        href={href}
                        className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-all hover:bg-[rgba(245,240,235,0.05)]"
                        onClick={() => setGenreOpen(false)}
                        style={{ color: "#9c948a" }}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full transition-all"
                          style={{ background: accent }}
                        />
                        <span style={{ color: "#b8b0a4" }}>{label}</span>
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
                <input
                  type="text"
                  placeholder="Titles, people, genres"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-56 md:w-72 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#5a544a] outline-none transition-all"
                  style={{
                    background: "#12100e",
                    border: "1px solid #2a2520",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
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
                className="p-2 transition-colors"
                style={{ color: "#7a7168" }}
              >
                <Search className="h-5 w-5" />
              </motion.button>
            )}
          </AnimatePresence>

          {isGuest ? (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #f5f0eb 0%, #d4a853 100%)",
                color: "#080605",
                boxShadow: "0 4px 16px rgba(212,168,83,0.2), inset 0 1px 0 rgba(255,255,255,0.3)",
              }}
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
          ) : (
            <>
              <button className="p-2 transition-colors relative" style={{ color: "#7a7168" }}>
                <Bell className="h-5 w-5" />
                <div
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2"
                  style={{ background: "#c75c3a", borderColor: "#0e0c0a" }}
                />
              </button>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 p-2 transition-colors"
                  style={{ color: "#7a7168" }}
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{
                      background: "linear-gradient(135deg, #2a2520, #1a1612)",
                      border: "1px solid #3a352e",
                    }}
                  >
                    <User className="h-4 w-4" style={{ color: "#d4a853" }} />
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
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl p-1.5"
                      style={{
                        background: "#12100e",
                        border: "1px solid #2a2520",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05)",
                      }}
                    >
                      <Link
                        href="/profiles"
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all hover:bg-[rgba(245,240,235,0.05)]"
                        onClick={() => setMenuOpen(false)}
                        style={{ color: "#9c948a" }}
                      >
                        <User className="h-4 w-4" />
                        Switch Profile
                      </Link>
                      <Link
                        href="/history"
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all hover:bg-[rgba(245,240,235,0.05)]"
                        onClick={() => setMenuOpen(false)}
                        style={{ color: "#9c948a" }}
                      >
                        <Bell className="h-4 w-4" />
                        Watch History
                      </Link>
                      <div className="my-1 mx-2 h-px" style={{ background: "#2a2520" }} />
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all hover:bg-[rgba(199,92,58,0.1)]"
                        style={{ color: "#c75c3a" }}
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
      <div
        className="md:hidden overflow-x-auto scrollbar-hide"
        style={{
          borderTop: "1px solid #2a2520",
          background: "#0e0c0a",
        }}
      >
        <div className="flex gap-2 px-4 py-3" style={{ width: "max-content" }}>
          {genreLinks.map(({ href, label, accent }) => (
            <Link
              key={href}
              href={href}
              className="flex-shrink-0 rounded-xl px-4 py-2 text-xs font-medium transition-all"
              style={{
                color: "#b8b0a4",
                border: "1px solid #2a2520",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
