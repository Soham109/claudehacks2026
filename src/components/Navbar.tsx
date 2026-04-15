"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, Search, Calendar, Users, User, Utensils } from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/find-table", label: "Find Table", icon: Search },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/my-tables", label: "My Tables", icon: Users },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const name = session?.user?.name || "";

  return (
    <>
      <nav className="fixed top-0 z-50 hidden w-full glass border-b border-stone-200/60 md:block">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-2.5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-900">
              <Utensils className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-[14px] font-bold tracking-tight text-stone-900">ConnecTable</span>
          </Link>
          <div className="flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all duration-150 ${
                    active ? "bg-stone-100 text-stone-900" : "text-stone-500 hover:bg-stone-50 hover:text-stone-700"
                  }`}>
                  <link.icon className="h-3.5 w-3.5" />{link.label}
                </Link>
              );
            })}
          </div>
          <Link href="/profile"
            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-stone-500 transition-all hover:bg-stone-50 hover:text-stone-700">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-200 text-[11px] font-bold text-stone-600">
              {name?.[0]?.toUpperCase() || <User className="h-3 w-3" />}
            </div>
            <span className="max-w-[80px] truncate">{name || "Profile"}</span>
          </Link>
        </div>
      </nav>
      <nav className="fixed bottom-0 z-50 w-full glass border-t border-stone-200/60 md:hidden">
        <div className="flex items-center justify-around px-1 py-1.5">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition-all duration-150 ${active ? "text-stone-900" : "text-stone-400"}`}>
                <link.icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`} />
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>
            );
          })}
          <Link href="/profile"
            className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition-all duration-150 ${pathname === "/profile" ? "text-stone-900" : "text-stone-400"}`}>
            <User className={`h-5 w-5 ${pathname === "/profile" ? "stroke-[2.5]" : ""}`} />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
