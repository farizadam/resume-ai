"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ResumeCard } from "@/components/dashboard/ResumeCard";
import { PlusCircle, FileText, BarChart3, Activity, ArrowRight } from "lucide-react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function scoreTone(score: number) {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-rose-400";
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [resumes, setResumes] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    avgScore: 0,
  });

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await fetch("/api/resumes");
        if (res.ok) {
          const data = await res.json();
          setResumes(data.resumes || []);

          // Calculate stats
          const total = data.resumes.length;
          const completed = data.resumes.filter((r: any) => r.status === "completed").length;

          let totalScore = 0;
          let scoredCount = 0;
          data.resumes.forEach((r: any) => {
            if (r.atsScore) {
              totalScore += r.atsScore;
              scoredCount++;
            }
          });
          const avgScore = scoredCount > 0 ? Math.round(totalScore / scoredCount) : 0;

          setStats({ total, completed, avgScore });
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
        setStats((prev) => ({ ...prev, total: prev.total - 1 }));
      }
    } catch (error) {
      console.error("Failed to delete resume", error);
    }
  };

  const firstName = session?.user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <section className="flex flex-col gap-6 border-b border-glass-border pb-8 md:flex-row md:items-end md:justify-between animate-stagger-reveal delay-100">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mb-2">
            Dashboard
          </p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-white">
            {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-text-muted">{firstName}</span>
          </h2>
          <p className="mt-3 text-lg text-text-muted">Ready to build your next opportunity?</p>
        </div>
        <Link
          href="/interview"
          className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-sm font-bold text-space-950 transition-all hover:bg-slate-200 hover:scale-105"
        >
          <PlusCircle className="h-4 w-4 relative z-10" />
          <span className="relative z-10">Create new resume</span>
          <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
        </Link>
      </section>

      {/* Stats */}
      {stats.total > 0 && (
        <section className="grid grid-cols-1 divide-y divide-glass-border rounded-[2rem] border border-glass-border bg-gradient-to-b from-glass-bg to-transparent backdrop-blur-md sm:grid-cols-3 sm:divide-x sm:divide-y-0 animate-stagger-reveal delay-200 shadow-2xl">
          <div className="px-8 py-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 text-text-muted mb-4">
              <FileText className="h-5 w-5 text-white" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Total resumes</span>
            </div>
            <p className="text-5xl font-mono font-black text-white">{stats.total}</p>
          </div>

          <div className="px-8 py-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 text-text-muted mb-4">
              <BarChart3 className="h-5 w-5 text-white" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Avg. ATS score</span>
            </div>
            <p
              className={`text-5xl font-mono font-black ${stats.avgScore > 0 ? scoreTone(stats.avgScore) : "text-text-muted"}`}
            >
              {stats.avgScore > 0 ? `${stats.avgScore}%` : "—"}
            </p>
          </div>

          <div className="px-8 py-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 text-text-muted mb-4">
              <Activity className="h-5 w-5 text-white" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Completed</span>
            </div>
            <p className="text-5xl font-mono font-black text-white">{stats.completed}</p>
          </div>
        </section>
      )}

      {/* My Resumes */}
      <section className="animate-stagger-reveal delay-300">
        <div className="mb-8 flex items-center gap-4">
          <h3 className="text-2xl font-black tracking-tight text-white">My Resumes</h3>
          {stats.total > 0 && (
            <span className="rounded-full bg-glass-hover border border-glass-border px-3 py-1 text-xs font-mono font-bold text-text-secondary">
              {stats.total}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
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
        ) : resumes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume, idx) => (
              <div key={resume._id} className={`animate-stagger-reveal delay-${Math.min((idx + 4) * 100, 500)}`}>
                <ResumeCard resume={resume} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-8 rounded-[2rem] border border-glass-border bg-gradient-to-b from-glass-bg to-transparent backdrop-blur-sm p-12 md:flex-row md:items-center md:justify-between relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-ai-primary opacity-10 blur-[100px] rounded-full pointer-events-none" />
            <div className="max-w-xl border-l-4 border-ai-primary pl-6 relative z-10">
              <h4 className="text-3xl font-black text-white tracking-tight">
                You don&apos;t have a resume yet
              </h4>
              <p className="mt-4 text-lg text-text-secondary leading-relaxed">
                Answer a few questions and let AI turn your experience into a resume built to
                pass ATS screening. No generic templates, just precision engineering.
              </p>
            </div>
            <Link
              href="/interview"
              className="group relative inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-base font-bold text-space-950 transition-all hover:scale-105 z-10 hover:bg-slate-200"
            >
              <PlusCircle className="h-5 w-5" />
              Initialize AI Interview
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}