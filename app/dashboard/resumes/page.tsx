"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ResumeCard } from "@/components/dashboard/ResumeCard";
import { PlusCircle, Search } from "lucide-react";

export default function ResumesPage() {
  const { data: session } = useSession();
  const [resumes, setResumes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await fetch("/api/resumes");
        if (res.ok) {
          const data = await res.json();
          setResumes(data.resumes || []);
        }
      } catch (error) {
        console.error("Failed to fetch resumes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumes();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/resumes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setResumes(resumes.filter((r) => r._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete resume", error);
    }
  };

  const filteredResumes = resumes.filter((resume) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    const titleMatch = resume.title?.toLowerCase().includes(search);
    const roleMatch = resume.targetRole?.toLowerCase().includes(search);
    return titleMatch || roleMatch;
  });

  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <section className="flex flex-col gap-6 border-b border-glass-border pb-8 md:flex-row md:items-end md:justify-between animate-stagger-reveal delay-100">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mb-2">
            Library
          </p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-white">
            My Resumes
          </h2>
          <p className="mt-3 text-lg text-text-muted max-w-xl">
            Browse, edit, and manage all your AI-generated resumes.
          </p>
        </div>
        <Link
          href="/interview"
          className="group relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-sm font-bold text-space-950 transition-all hover:bg-slate-200 hover:scale-105"
        >
          <PlusCircle className="h-4 w-4 relative z-10" />
          <span className="relative z-10">Create new resume</span>
        </Link>
      </section>

      {/* Search Bar */}
      <section className="animate-stagger-reveal delay-200">
        <div className="relative max-w-xl">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="h-5 w-5 text-text-muted" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-glass-bg border border-glass-border text-white text-sm rounded-full focus:ring-ai-primary focus:border-ai-primary block pl-12 p-4 placeholder-text-muted transition-all"
            placeholder="Search by job title or company..."
          />
        </div>
      </section>

      {/* Resumes Grid */}
      <section className="animate-stagger-reveal delay-300">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-[280px] animate-pulse rounded-[2rem] border border-glass-border bg-glass-bg p-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="h-14 w-14 rounded-2xl bg-glass-hover" />
                  <div className="h-6 w-2/3 rounded-md bg-glass-hover" />
                  <div className="h-4 w-1/2 rounded-md bg-glass-hover" />
                </div>
                <div className="mt-8 space-y-3 border-t border-glass-border/50 pt-5">
                  <div className="flex justify-between items-end">
                     <div className="h-6 w-1/3 rounded-md bg-glass-hover" />
                     <div className="h-6 w-1/4 rounded-full bg-glass-hover" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredResumes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredResumes.map((resume, idx) => (
              <div key={resume._id} className={`animate-stagger-reveal delay-${Math.min((idx + 4) * 100, 500)}`}>
                <ResumeCard resume={resume} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="flex flex-col gap-8 rounded-[2rem] border border-glass-border bg-gradient-to-b from-glass-bg to-transparent backdrop-blur-sm p-12 md:flex-row md:items-center md:justify-between relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-ai-primary opacity-10 blur-[100px] rounded-full pointer-events-none" />
            <div className="max-w-xl border-l-4 border-ai-primary pl-6 relative z-10">
              <h4 className="text-3xl font-black text-white tracking-tight">
                Your library is empty
              </h4>
              <p className="mt-4 text-lg text-text-secondary leading-relaxed">
                You haven't created any resumes yet. Start an AI interview to generate your first ATS-optimized resume.
              </p>
            </div>
            <Link
              href="/interview"
              className="group relative inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-base font-bold text-space-950 transition-all hover:scale-105 z-10 hover:bg-slate-200"
            >
              <PlusCircle className="h-5 w-5" />
              Start Building
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="h-12 w-12 text-glass-border mb-4" />
            <h4 className="text-2xl font-bold text-white mb-2">No results found</h4>
            <p className="text-text-muted">
              We couldn't find any resumes matching "{searchQuery}".
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
