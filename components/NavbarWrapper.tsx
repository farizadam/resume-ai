"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide the global navbar on these routes because they have their own specific navbars
  const hiddenRoutes = ["/dashboard", "/interview", "/builder"];
  const isHidden = hiddenRoutes.some(route => pathname?.startsWith(route));
  
  if (isHidden) return null;
  
  return <>{children}</>;
}
