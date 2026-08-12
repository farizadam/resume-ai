"use client";

import { ResumeEditor } from "@/components/resume/ResumeEditor";
import dynamic from "next/dynamic";
const ResumePreview = dynamic(() => import("@/components/resume/ResumePreview").then(mod => mod.ResumePreview), { ssr: false });

export default function ResumePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-6 py-10">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500">
          Resume Builder
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900">Draft and refine your resume</h1>
        <p className="max-w-2xl text-zinc-600">
          Capture your experience, adjust your summary, and preview the final document in real time.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <ResumeEditor />
        <ResumePreview />
      </div>
    </main>
  );
}
