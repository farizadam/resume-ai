"use client";

import React, { useState } from "react";
import { Menu, Bell, User as UserIcon, ChevronDown } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TopNav({ onMenuClick }: { onMenuClick: () => void }) {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/dashboard/resumes") return "My Resumes";
    if (pathname === "/dashboard/settings") return "Settings";
    if (pathname === "/dashboard/ats") return "ATS Checker";
    return "Dashboard";
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const initials = getInitials(session?.user?.name);

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-glass-border bg-surface/50 backdrop-blur-xl px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-text-muted hover:text-white lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-glass-border lg:hidden" aria-hidden="true" />
      
      <div className="flex flex-1 justify-between items-center">
        <h1 className="text-lg font-semibold text-white flex items-center">{getPageTitle()}</h1>
        
        <div className="flex items-center gap-4 relative">
          <button className="p-2 text-text-muted hover:text-white transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="-m-1.5 flex items-center p-1.5 hover:bg-glass-hover rounded-full transition-colors"
            >
              <span className="sr-only">Open user menu</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-space-800 border border-glass-border text-sm font-medium text-white shadow-sm">
                {initials}
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-semibold leading-6 text-text-primary" aria-hidden="true">
                  {session?.user?.name || "User"}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 text-text-muted" aria-hidden="true" />
              </span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-xl bg-space-900 border border-glass-border py-2 shadow-2xl backdrop-blur-xl ring-1 ring-white/5 focus:outline-none">
                <Link
                  href="/dashboard/profile"
                  className="block px-4 py-2 text-sm text-text-secondary hover:bg-glass-hover hover:text-white transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="block px-4 py-2 text-sm text-text-secondary hover:bg-glass-hover hover:text-white transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  Settings
                </Link>
                <div className="my-1 border-t border-glass-border" />
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full text-left px-4 py-2 text-sm text-rose-500 hover:bg-glass-hover hover:text-rose-400 transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
