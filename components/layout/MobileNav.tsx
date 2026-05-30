"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Film, Tv, Heart, Search, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

const allLinks = [
  { href: "/browse", icon: Home, label: "Home", guestVisible: true },
  { href: "/movies", icon: Film, label: "Movies", guestVisible: true },
  { href: "/tv", icon: Tv, label: "TV", guestVisible: true },
  { href: "/search", icon: Search, label: "Search", guestVisible: true },
  { href: "/my-list", icon: Heart, label: "My List", guestVisible: false },
];

interface MobileNavProps {
  isGuest?: boolean;
}

export default function MobileNav({ isGuest = false }: MobileNavProps) {
  const pathname = usePathname();

  const links = isGuest
    ? [...allLinks.filter((l) => l.guestVisible), { href: "/login", icon: LogIn, label: "Sign In", guestVisible: true }]
    : allLinks;

  return (
    <nav
      className="fixed bottom-0 left-0 z-50 w-full md:hidden"
      style={{
        borderTop: "1px solid #2a2520",
        background: "#0e0c0a",
      }}
    >
      <div className="flex items-center justify-around py-2">
        {links.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 text-xs transition-all rounded-lg",
                active ? "text-[#d4a853]" : "text-[#5a544a]"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-lg transition-all",
                active && "bg-[rgba(212,168,83,0.1)]"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px]">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
