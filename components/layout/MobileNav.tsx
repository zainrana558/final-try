"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Film, Tv, Heart, Search, LogIn } from "lucide-react";
import { motion } from "framer-motion";

const allLinks = [
  { href: "/browse",  icon: Home,   label: "Home",    guestVisible: true },
  { href: "/movies",  icon: Film,   label: "Movies",  guestVisible: true },
  { href: "/tv",      icon: Tv,     label: "TV",      guestVisible: true },
  { href: "/search",  icon: Search, label: "Search",  guestVisible: true },
  { href: "/my-list", icon: Heart,  label: "My List", guestVisible: false },
];

interface MobileNavProps { isGuest?: boolean; }

export default function MobileNav({ isGuest = false }: MobileNavProps) {
  const pathname = usePathname();

  const links = isGuest
    ? [...allLinks.filter((l) => l.guestVisible), { href: "/login", icon: LogIn, label: "Sign In", guestVisible: true }]
    : allLinks;

  return (
    <nav
      className="fixed bottom-0 left-0 z-50 w-full md:hidden"
      style={{
        background: "rgba(6,6,6,0.98)",
        borderTop: "1px solid #141414",
      }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {links.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/browse" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-3 py-1 relative"
            >
              <div className="relative">
                <Icon
                  className="h-5 w-5 transition-colors duration-200"
                  style={{ color: active ? "#a78bfa" : "#444" }}
                />
                {active && (
                  <motion.div
                    layoutId="mobile-nav-dot"
                    className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                    style={{ background: "#7c3aed" }}
                  />
                )}
              </div>
              <span
                className="text-[10px] font-medium tracking-wide transition-colors duration-200"
                style={{ color: active ? "#a78bfa" : "#333" }}
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
