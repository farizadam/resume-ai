"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ResumeEditor } from "@/components/resume/ResumeEditor";
import dynamic from "next/dynamic";
const ResumePreview = dynamic(() => import("@/components/resume/ResumePreview").then(mod => mod.ResumePreview), { ssr: false });

function BuilderContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No interview ID provided in URL.");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        let isResumeApi = false;
        let res = await fetch(`/api/resumes/${id}`);
        
        if (res.ok) {
          isResumeApi = true;
        } else {
          res = await fetch(`/api/interview/${id}`);
        }
        
        if (!res.ok) throw new Error("Failed to load resume data");
        const json = await res.json();
        
        // If it came from the resumes API, the data is under `json.resume.candidateData`
        if (isResumeApi && json.resume) {
          setData(json.resume.candidateData || {});
        } else {
          setData(json.candidateData || {});
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSave = async () => {
    if (!id || !data) return;
    setIsSaving(true);
    try {
      // Try saving to resume API first, if it fails (404), fallback to interview API
      let res = await fetch(`/api/resumes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateData: data }),
      });
      
      if (!res.ok && res.status === 404) {
        res = await fetch(`/api/interview/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidateData: data }),
        });
      }
      
      if (!res.ok) throw new Error("Failed to save changes");
      // Optional: show a success toast here
    } catch (err: any) {
      alert(err.message || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    if (!id) return;
    window.open(`/api/interview/${id}/compile`, "_blank");
  };


  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-text-primary">
        <div className="w-12 h-12 rounded-full border-4 border-space-800 border-t-ai-primary animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-text-primary">
        <div className="text-error font-medium">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-text-primary font-sans relative">
      <div className="fixed inset-0 z-0 bg-grid-pattern opacity-60 mix-blend-screen pointer-events-none" />
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-glass-border bg-surface/50 backdrop-blur-xl px-6 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xl font-extrabold tracking-tighter text-white">
            Resume AI.
          </Link>
          <span className="text-text-muted">|</span>
          <h1 className="text-sm font-semibold text-text-secondary">Builder Workspace</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm font-medium text-text-muted transition-colors hover:text-white mr-2">
            Back to Dashboard
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-lg px-4 py-2 text-sm font-medium text-text-primary bg-glass-bg hover:bg-glass-hover transition-colors border border-glass-border disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleDownload}
            className="rounded-lg px-5 py-2 text-sm font-semibold text-white bg-ai-primary hover:bg-ai-primary/90 transition-colors shadow-sm"
          >
            Download PDF
          </button>
        </div>
      </header>

      {/* Split Workspace */}
      <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-0 z-10 relative">
        <div 
          className="h-full overflow-y-auto border-r border-glass-border bg-space-950/50 backdrop-blur-md custom-scrollbar p-6"
          data-lenis-prevent
        >
          <ResumeEditor data={data} onChange={setData} />
        </div>
        <div className="h-full bg-space-900 overflow-hidden relative hidden lg:block">
          <ResumePreview data={data} />
        </div>
      </main>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background text-text-primary">
        <div className="w-12 h-12 rounded-full border-4 border-space-800 border-t-ai-primary animate-spin"></div>
      </div>
    }>
      <BuilderContent />
    </Suspense>
  );
}
