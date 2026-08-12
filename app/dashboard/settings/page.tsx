"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Settings, CreditCard, Target, FileText, MessageSquare, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";

interface UsageData {
  ats: { used: number; limit: number };
  resume: { used: number; limit: number };
  interview: { used: number; limit: number };
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const res = await fetch("/api/user/usage");
        if (!res.ok) throw new Error("Failed to load usage data");
        const data = await res.json();
        setUsage(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsage();
  }, []);

  const getPercentage = (used: number, limit: number) => {
    if (limit === 0) return 100;
    return Math.min(Math.round((used / limit) * 100), 100);
  };

  const getColorClass = (percentage: number) => {
    if (percentage >= 100) return "bg-error text-error";
    if (percentage >= 80) return "bg-warning text-warning";
    return "bg-ai-primary text-ai-primary";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-stagger-reveal pb-12">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-space-800 border border-glass-border shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <Settings className="w-6 h-6 text-ai-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Settings & Usage
          </h1>
        </div>
        <p className="mt-2 text-lg text-text-secondary">
          Manage your account preferences and monitor your feature credits.
        </p>
      </header>

      {/* User Info Section */}
      <div className="rounded-2xl border border-glass-border bg-glass-bg/50 backdrop-blur-md p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-text-muted" />
          Plan Details
        </h2>
        
        <div className="flex items-center justify-between p-4 rounded-xl border border-ai-primary/30 bg-ai-primary/5">
          <div>
            <p className="text-sm font-medium text-text-muted uppercase tracking-wider mb-1">Current Plan</p>
            <p className="text-2xl font-bold text-white flex items-center gap-2">
              Free Tier (5 Limits / Feature) <Sparkles className="w-5 h-5 text-ai-primary animate-pulse" />
            </p>
            <p className="text-sm text-text-secondary mt-1">Logged in as <span className="font-medium text-white">{session?.user?.email || "User"}</span></p>
          </div>
        </div>
      </div>

      {/* Usage Section */}
      <div className="rounded-2xl border border-glass-border bg-glass-bg/50 backdrop-blur-md p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-text-muted" />
          Credit Usage
        </h2>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-ai-primary mb-4" />
            <p className="text-text-muted">Loading your usage data...</p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl border border-error-border bg-error-light/10 text-error backdrop-blur-sm">
            {error}
          </div>
        ) : usage ? (
          <div className="space-y-6">
            
            {/* ATS Scoring */}
            <UsageBar 
              title="ATS Resumes Scored"
              icon={<Target className="w-5 h-5 text-ai-primary" />}
              used={usage.ats.used} 
              limit={usage.ats.limit} 
              colorClass={getColorClass(getPercentage(usage.ats.used, usage.ats.limit))} 
            />

            {/* Resumes */}
            <UsageBar 
              title="Resumes Generated"
              icon={<FileText className="w-5 h-5 text-success" />}
              used={usage.resume.used} 
              limit={usage.resume.limit} 
              colorClass={getColorClass(getPercentage(usage.resume.used, usage.resume.limit))} 
            />

            {/* Interviews */}
            <UsageBar 
              title="Mock Interviews"
              icon={<MessageSquare className="w-5 h-5 text-warning" />}
              used={usage.interview.used} 
              limit={usage.interview.limit} 
              colorClass={getColorClass(getPercentage(usage.interview.used, usage.interview.limit))} 
            />

          </div>
        ) : null}
      </div>
    </div>
  );
}

function UsageBar({ title, icon, used, limit, colorClass }: { title: string, icon: React.ReactNode, used: number, limit: number, colorClass: string }) {
  const percentage = limit === 0 ? 100 : Math.min(Math.round((used / limit) * 100), 100);
  const bgColor = colorClass.split(" ")[0]; // Get the bg class
  const textColor = colorClass.split(" ")[1]; // Get the text class

  return (
    <div className="p-5 rounded-xl border border-glass-border bg-space-900/50 hover:bg-space-800/50 transition">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-space-800 shadow-sm border border-glass-border">
            {icon}
          </div>
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        <div className="text-right">
          <p className={`text-xl font-bold ${textColor}`}>
            {used} <span className="text-text-muted text-sm font-medium">/ {limit}</span>
          </p>
        </div>
      </div>
      
      <div className="h-2.5 w-full bg-space-950 rounded-full overflow-hidden border border-glass-border">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${bgColor} ${textColor} shadow-[0_0_10px_currentColor]`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-2 text-xs text-text-muted flex justify-between">
        <span>{percentage}% Used</span>
        {percentage >= 100 && (
          <span className="text-error font-medium">Limit Reached</span>
        )}
      </div>
    </div>
  );
}
