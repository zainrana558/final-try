"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Bell, User, LogOut, LogIn, ChevronDown, X, Clapperboard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps { isGuest?: boolean; }

const genreLinks = [
  { href: "/anime",   label: "Anime" },
  { href: "/cartoon", label: "Cartoon" },
  { href: "/horror",  label: "Horror" },
  { href: "/comedy",  label: "Comedy" },
  { href: "/action",  label: "Action" },
  { href: "/romance", label: "Romance" },
  { href: "/scifi",   label: "Sci-Fi" },
];

export default function Navbar({ isGuest = false }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [genreOpen, setGenreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

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

  const navLinks = [
    { href: "/browse", label: "Home" },
    { href: "/movies", label: "Movies" },
    { href: "/tv",     label: "TV Shows" },
    ...(!isGuest ? [{ href: "/my-list", label: "My List" }] : []),
  ];

  return (
    <nav
      className="fixed top-0 z-50 w-full transition-all duration-500"
      style={{
        background: scrolled
          ? "rgba(5,5,5,0.98)"
          : "linear-gradient(to bottom, rgba(5,5,5,0.9) 0%, transparent 100%)",
        borderBottom: scrolled ? "1px solid #141414" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(0px)" : "none",
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/browse" className="flex items-center gap-2 group md:hidden">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
            >
              <Clapperboard className="h-3.5 w-3.5 text-white" />
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

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || (href !== "/browse" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative px-3 py-1.5 text-[13px] font-medium transition-colors duration-200"
                  style={{ color: active ? "#fff" : "#666" }}
                >
                  {label}
                  {active && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute bottom-0 left-1/2 h-px w-4 -translate-x-1/2"
                      style={{ background: "linear-gradient(90deg, transparent, #7c3aed, transparent)" }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Genres dropdown */}
            <div className="relative">
              <button
                onClick={() => setGenreOpen(!genreOpen)}
                onBlur={() => setTimeout(() => setGenreOpen(false), 150)}
                className="flex items-center gap-1 px-3 py-1.5 text-[13px] font-medium transition-colors duration-200"
                style={{ color: "#666" }}
              >
                Genres
                <motion.div animate={{ rotate: genreOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="h-3 w-3" />
                </motion.div>
              </button>
              <AnimatePresence>
                {genreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-40 rounded-xl p-1.5 shadow-2xl"
                    style={{ background: "#0a0a0a", border: "1px solid #1f1f1f" }}
                  >
                    {genreLinks.map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        className="block rounded-lg px-3 py-2 text-[12px] font-medium text-zinc-400 hover:bg-white/[0.05] hover:text-white transition-all duration-150"
                        onClick={() => setGenreOpen(false)}
                      >
                        {label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <AnimatePresence mode="wait">
            {searchOpen ? (
              <motion.form
                key="search-form"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 220, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                onSubmit={handleSearch}
                className="flex items-center overflow-hidden rounded-lg"
                style={{ background: "#0f0f0f", border: "1px solid #2a2a2a" }}
              >
                <Search className="ml-2.5 h-3.5 w-3.5 flex-shrink-0 text-zinc-500" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search titles…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent px-2 py-2 text-[12px] text-white outline-none placeholder:text-zinc-600"
                  style={{ fontFamily: "var(--font-mono)" }}
                />
                <button
                  type="button"
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  className="mr-2 text-zinc-600 hover:text-zinc-300 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.form>
            ) : (
              <motion.button
                key="search-btn"
                onClick={() => setSearchOpen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 hover:bg-white/[0.05]"
                style={{ color: "#666" }}
                whileHover={{ color: "#fff" }}
                whileTap={{ scale: 0.9 }}
              >
                <Search className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>

          {isGuest ? (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                boxShadow: "0 2px 12px rgba(124,58,237,0.3)",
              }}
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign In
            </Link>
          ) : (
            <>
              <motion.button
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 hover:bg-white/[0.05]"
                style={{ color: "#666" }}
                whileHover={{ color: "#fff" }}
                whileTap={{ scale: 0.9 }}
              >
                <Bell className="h-4 w-4" />
              </motion.button>

              <div className="relative">
                <motion.button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1 transition-all duration-200 hover:bg-white/[0.05]"
                  whileTap={{ scale: 0.96 }}
                >
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
                  >
                    <User className="h-3.5 w-3.5 text-white" />
                  </div>
                  <motion.div animate={{ rotate: menuOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="h-3 w-3 text-zinc-500" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-44 rounded-xl p-1.5 shadow-2xl"
                      style={{ background: "#0a0a0a", border: "1px solid #1f1f1f" }}
                    >
                      <Link
                        href="/profiles"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] text-zinc-400 hover:bg-white/[0.04] hover:text-white transition-all duration-150"
                        onClick={() => setMenuOpen(false)}
                      >
                        <User className="h-3.5 w-3.5" /> Switch Profile
                      </Link>
                      <Link
                        href="/history"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] text-zinc-400 hover:bg-white/[0.04] hover:text-white transition-all duration-150"
                        onClick={() => setMenuOpen(false)}
                      >
                        Watch History
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
            </>
          )}
        </div>
      </div>

      {/* Mobile genre scroll */}
      <div
        className="md:hidden overflow-x-auto no-scrollbar"
        style={{ borderTop: "1px solid #0f0f0f" }}
      >
        <div className="flex gap-1 px-4 py-2" style={{ width: "max-content" }}>
          {genreLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="flex-shrink-0 rounded-full px-3 py-1 text-[11px] font-medium tracking-wide transition-all duration-200"
              style={{
                background: pathname === href ? "rgba(124,58,237,0.2)" : "#0f0f0f",
                border: `1px solid ${pathname === href ? "#7c3aed" : "#1f1f1f"}`,
                color: pathname === href ? "#c4b5fd" : "#555",
                minHeight: 28,
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
