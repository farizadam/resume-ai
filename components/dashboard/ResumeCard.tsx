import React, { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { 
  FileText, 
  MoreVertical, 
  Edit3, 
  Download, 
  Copy, 
  Trash2,
  FileCheck2,
  Sparkles
} from "lucide-react";

interface ResumeCardProps {
  resume: {
    _id: string;
    interviewId?: string;
    title: string;
    targetRole: string;
    updatedAt: string;
    atsScore?: number;
    status: "draft" | "completed";
  };
  onDelete: (id: string) => void;
}

export function ResumeCard({ resume, onDelete }: ResumeCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this resume? This action cannot be undone.")) {
      onDelete(resume._id);
    }
    setShowMenu(false);
  };

  const formattedDate = resume.updatedAt 
    ? formatDistanceToNow(new Date(resume.updatedAt), { addSuffix: true })
    : "Recently";

  return (
    <div className="group relative flex flex-col justify-between rounded-[2rem] border border-glass-border bg-gradient-to-b from-glass-bg to-transparent backdrop-blur-md p-6 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.15)] hover:border-glass-focus overflow-hidden">
      {/* Subtle background glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-ai-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="absolute right-4 top-4 z-20">
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="rounded-full p-2 text-text-muted transition-colors hover:bg-white/10 hover:text-white focus:outline-none backdrop-blur-md"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-12 z-30 w-48 rounded-2xl bg-space-900/90 border border-glass-border py-2 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 focus:outline-none overflow-hidden">
            <Link 
              href={`/builder?id=${resume._id}`}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-white/5 hover:text-white transition-colors"
            >
              <Edit3 className="h-4 w-4 text-white" /> Edit
            </Link>
            <a 
              href={`/api/interview/${resume.interviewId || resume._id}/compile`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-white/5 hover:text-white transition-colors"
            >
              <Download className="h-4 w-4 text-white" /> Download PDF
            </a>
            <button 
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-white/5 hover:text-white text-left transition-colors"
              onClick={() => {
                alert("Duplicate functionality coming soon!");
                setShowMenu(false);
              }}
            >
              <Copy className="h-4 w-4 text-white" /> Duplicate
            </button>
            <div className="my-1 border-t border-glass-border" />
            <button 
              onClick={handleDelete}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 text-left transition-colors"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="relative z-10">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] backdrop-blur-md group-hover:border-white/20 transition-all duration-300">
          <FileText className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-500" />
        </div>
        
        <Link href={`/builder?id=${resume._id}`} className="block group-hover:text-white transition-colors">
          <h3 className="text-2xl font-black tracking-tight text-white line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all duration-300">{resume.title}</h3>
        </Link>
        <p className="mt-2 text-sm font-medium text-text-muted line-clamp-1 flex items-center gap-1.5">
          {resume.targetRole || "General Application"}
        </p>
      </div>

      <div className="mt-8 flex items-end justify-between border-t border-glass-border/50 pt-5 relative z-10">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted/70">Last Edited</span>
          <span className="text-xs font-medium text-text-secondary">{formattedDate}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {resume.atsScore ? (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
              <FileCheck2 className="h-3.5 w-3.5" />
              {resume.atsScore}% ATS
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-medium text-text-secondary">
              {resume.status === 'completed' ? (
                <><Sparkles className="h-3 w-3 text-ai-primary" /> Ready</>
              ) : (
                'Drafting...'
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
