"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  CheckCircle,
  Settings,
} from "lucide-react";

export function Sidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Resumes", href: "/dashboard/resumes", icon: FileText },
    { name: "Create Resume", href: "/interview", icon: PlusCircle },
    { name: "ATS Checker", href: "/dashboard/ats", icon: CheckCircle },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className={`flex h-full w-64 flex-col bg-surface backdrop-blur-xl border-r border-glass-border ${className}`}>
      <div className="flex h-16 items-center px-6 border-b border-glass-border relative overflow-hidden">
        <Link href="/dashboard" className="text-xl font-extrabold tracking-tighter text-white relative z-10 flex items-center gap-2">
          Resume <span className="text-text-muted">AI.</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="flex flex-col gap-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-glass-hover text-white border border-glass-focus"
                    : "text-text-muted hover:bg-glass-hover hover:text-white border border-transparent"
                }`}
              >
                <Icon className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : "text-space-600 group-hover:text-white"}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
