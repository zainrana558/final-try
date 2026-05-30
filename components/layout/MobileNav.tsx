"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Film, Tv, Heart, Sparkles } from "lucide-react";

// LUMINA: Mobile navigation links
const mobileLinks = [
  { href: "/browse", icon: Home, label: "Home" },
  { href: "/movies", icon: Film, label: "Movies" },
  { href: "/tv", icon: Tv, label: "TV Shows" },
  { href: "/my-list", icon: Heart, label: "My List" },
  { href: "/browse", icon: Sparkles, label: "Genres" },
];

interface MobileNavProps {
  isGuest?: boolean;
  accentColor?: string;
}

export default function MobileNav({ isGuest = false, accentColor = "#E50914" }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 z-50 w-full md:hidden"
      style={{
        height: "60px",
        background: "var(--sidebar-bg)",
        borderTop: "1px solid #1A1A1A",
      }}
    >
      <div className="flex items-center justify-around h-full px-4">
        {mobileLinks.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/browse" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 transition-all duration-100"
              style={{
                opacity: active ? 1 : 0.6,
              }}
            >
              <Icon
                className="w-5 h-5"
                style={{ 
                  color: active ? accentColor : "var(--text-secondary)",
                }}
              />
              <span
                className="text-xs font-medium"
                style={{ 
                  color: active ? accentColor : "var(--text-secondary)",
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
