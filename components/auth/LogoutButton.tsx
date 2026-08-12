"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-sm font-semibold text-slate-500 hover:text-navy-900 transition-colors"
    >
      Log Out
    </button>
  );
}
