import Link from "next/link";

export default function BuilderPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold text-zinc-900">Builder workspace</h1>
      <p className="mt-3 max-w-2xl text-zinc-600">
        This page acts as a placeholder builder entry point for the app structure you requested.
      </p>
      <div className="mt-6 flex gap-4">
        <Link href="/resume" className="rounded-full bg-zinc-900 px-5 py-3 text-sm font-medium text-white">
          Open resume builder
        </Link>
        <Link href="/interview" className="rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-700">
          Open interview mode
        </Link>
      </div>
    </main>
  );
}
