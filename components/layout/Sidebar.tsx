"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Film, Tv, Heart, Search, LogOut, LogIn,
  User, ChevronDown, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// LUMINA: Navigation links configuration
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
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  isGuest?: boolean;
  accentColor?: string;
}

export default function Sidebar({ 
  isCollapsed = false, 
  onToggle, 
  isGuest = false,
  accentColor = "#E50914"
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [genreOpen, setGenreOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(isCollapsed);

  // LUMINA: Persist sidebar state to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("lumina_sidebar");
    if (saved !== null) {
      setCollapsed(saved === "collapsed");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lumina_sidebar", collapsed ? "collapsed" : "expanded");
    onToggle?.();
  }, [collapsed, onToggle]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  // LUMINA: Tooltip component for collapsed state
  const Tooltip = ({ children, label }: { children: React.ReactNode; label: string }) => (
    <div className="relative group">
      {children}
      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#1A1A1A] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
        {label}
      </div>
    </div>
  );

  return (
    <aside
      className="fixed left-0 top-0 z-50 hidden md:flex h-screen flex-col transition-all duration-200 ease-in-out"
      style={{
        width: collapsed ? "64px" : "220px",
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* LUMINA: Logo */}
      <div className="px-4 pt-6 pb-4 flex items-center justify-between">
        <Link href="/browse" className="flex items-center gap-2">
          {!collapsed ? (
            <span className="text-lg font-bold" style={{ color: accentColor }}>
              ◈ LUMINA
            </span>
          ) : (
            <span className="text-lg font-bold" style={{ color: accentColor }}>
              L
            </span>
          )}
        </Link>
        
        {/* LUMINA: Collapse toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-150"
          style={{ background: "#1A1A1A" }}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-white" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-white" />
          )}
        </button>
      </div>

      {/* LUMINA: Search */}
      {!collapsed && (
        <div className="px-4 mb-4">
          <Link
            href="/search"
            className="flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-100 rounded"
            style={{
              background: "var(--card-bg)",
              color: "var(--text-secondary)",
            }}
          >
            <Search className="w-4 h-4 flex-shrink-0" />
            <span>Search titles</span>
          </Link>
        </div>
      )}

      {/* LUMINA: Main navigation */}
      <nav className="flex-1 overflow-y-auto px-2">
        {!collapsed && (
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#555555" }}>
            Menu
          </p>
        )}

        {mainLinks
          .filter((l) => !(isGuest && l.authOnly))
          .map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== "/browse" && pathname.startsWith(href));
            const NavItem = (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-100 rounded"
                style={{
                  background: active ? "var(--elevated-surface)" : "transparent",
                  borderLeft: active ? `2px solid ${accentColor}` : "2px solid transparent",
                  color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  paddingLeft: active ? "calc(0.75rem - 2px)" : "0.75rem",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "var(--text-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }
                }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            );

            return collapsed ? (
              <Tooltip key={href} label={label}>
                {NavItem}
              </Tooltip>
            ) : (
              NavItem
            );
          })}

        {/* LUMINA: Genres section */}
        {!collapsed && (
          <div className="pt-4">
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#555555" }}>
              Genres ─────────
            </p>
            <button
              onClick={() => setGenreOpen(!genreOpen)}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-100 rounded"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
            >
              <span className="text-lg">✦</span>
              <span>All Genres</span>
              <ChevronDown
                className={`ml-auto w-3.5 h-3.5 transition-transform duration-100 ${genreOpen ? "rotate-180" : ""}`}
              />
            </button>
            {genreOpen && (
              <div className="mt-1 ml-3 space-y-0.5">
                {genreLinks.map(({ href, label }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className="block px-3 py-1.5 text-xs transition-all duration-100 rounded"
                      style={{
                        color: active ? "var(--text-primary)" : "#666666",
                      }}
                      onMouseEnter={(e) => {
                        if (!active) e.currentTarget.style.color = "var(--text-primary)";
                      }}
                      onMouseLeave={(e) => {
                        if (!active) e.currentTarget.style.color = "#666666";
                      }}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* LUMINA: User section */}
      <div className="px-2 py-4" style={{ borderTop: "1px solid #1A1A1A" }}>
        {isGuest ? (
          <Link
            href="/login"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-100 rounded"
            style={{ color: "var(--text-primary)" }}
          >
            <LogIn className="w-4 h-4" />
            {!collapsed && <span>Sign In</span>}
          </Link>
        ) : (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-100 rounded"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
            >
              <div className="flex w-6 h-6 items-center justify-center rounded-full bg-[#1A1A1A]">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              {!collapsed && <span>My Account</span>}
              {!collapsed && (
                <ChevronDown
                  className={`ml-auto w-3.5 h-3.5 transition-transform duration-100 ${userMenuOpen ? "rotate-180" : ""}`}
                />
              )}
            </button>

            {userMenuOpen && !collapsed && (
              <div
                className="absolute bottom-full left-0 mb-2 w-full rounded p-1"
                style={{
                  background: "var(--elevated-surface)",
                  border: "1px solid var(--border)",
                  boxShadow: "rgba(0,0,0,0.6)",
                }}
              >
                <Link
                  href="/profiles"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm transition-all duration-100 rounded"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
                >
                  <User className="w-4 h-4" />
                  Switch Profile
                </Link>
                <Link
                  href="/history"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm transition-all duration-100 rounded"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
                >
                  <Film className="w-4 h-4" />
                  Watch History
                </Link>
                <div className="my-1" style={{ borderTop: "1px solid var(--border)" }} />
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm transition-all duration-100 rounded"
                  style={{ color: "#ef4444" }}
                >
                  <LogOut className="w-4 h-4" />
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
