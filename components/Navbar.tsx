import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border-default bg-surface/80 backdrop-blur-md px-6 md:px-12">
      <div className="flex items-center gap-2">
        <Link href={session ? "/dashboard" : "/"} className="text-xl font-extrabold tracking-tighter text-white">
          Resume <span className="text-text-muted">AI.</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span className="text-sm font-medium text-text-muted hidden md:inline-block">
              Welcome, {session.user?.name?.split(" ")[0]}
            </span>
            <LogoutButton />
            <Link
              href="/dashboard"
              className="rounded-full bg-white/10 border border-white/10 hover:bg-white/20 px-5 py-2 text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
            >
              Dashboard
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm font-semibold text-text-muted hover:text-white transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-white text-space-950 px-5 py-2 text-sm font-bold transition-transform hover:scale-105 active:scale-95"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
