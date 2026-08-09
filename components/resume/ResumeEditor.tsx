"use client";

export function ResumeEditor() {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-zinc-900">Resume editor</h2>
      <textarea
        className="mt-4 min-h-[280px] w-full rounded-xl border border-zinc-200 p-4 text-sm text-zinc-700 outline-none"
        placeholder="Paste your resume content or draft your summary here..."
      />
    </section>
  );
}
