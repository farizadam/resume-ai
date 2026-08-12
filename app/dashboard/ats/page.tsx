"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, Loader2, Target, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ATSCheckerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ score: number; improvements: string[] } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type === "application/pdf") {
        setFile(selected);
        setError(null);
      } else {
        setError("Please upload a valid PDF file.");
        setFile(null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      if (selected.type === "application/pdf") {
        setFile(selected);
        setError(null);
      } else {
        setError("Please upload a valid PDF file.");
      }
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please upload your resume PDF.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please enter the job description.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const res = await fetch("/api/ats", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze resume");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to determine score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success border-success/30 bg-success/10";
    if (score >= 60) return "text-warning border-warning/30 bg-warning/10";
    return "text-error border-error/30 bg-error/10";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-stagger-reveal">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          ATS Resume Checker
        </h1>
        <p className="mt-2 text-lg text-text-secondary">
          Upload your resume and a target job description to get an AI-powered match score and actionable feedback.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Column */}
        <div className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-text-secondary">
              Upload Resume (PDF)
            </label>
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer
                ${file ? "border-ai-primary/50 bg-ai-primary/5" : "border-glass-border hover:border-glass-focus hover:bg-glass-hover bg-glass-bg"}
              `}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div className="w-12 h-12 rounded-full bg-space-800 border border-glass-border flex items-center justify-center mb-4 text-text-muted">
                {file ? <FileText className="h-6 w-6 text-ai-primary" /> : <UploadCloud className="h-6 w-6" />}
              </div>
              {file ? (
                <>
                  <p className="text-sm font-medium text-white">{file.name}</p>
                  <p className="text-xs text-text-muted mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Click to replace
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-white">Click or drag PDF here</p>
                  <p className="text-xs text-text-muted mt-1">Maximum file size 5MB</p>
                </>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-text-secondary">
              Target Job Description
            </label>
            <textarea
              className="w-full h-48 rounded-2xl border border-glass-border bg-glass-bg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition focus:border-glass-focus focus:ring-2 focus:ring-glass-focus/20 custom-scrollbar resize-none backdrop-blur-sm"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-error-border bg-error-light/10 px-4 py-3 text-sm text-error backdrop-blur-sm">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || !file || !jobDescription.trim()}
            className="group relative w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ai-primary to-space-700 px-4 py-3.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing Match...
                </>
              ) : (
                <>
                  <Target className="h-5 w-5" />
                  Analyze Resume
                </>
              )}
            </span>
          </button>
        </div>

        {/* Results Column */}
        <div className="h-full">
          {!result && !isLoading ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-2xl border border-glass-border bg-glass-bg/50 backdrop-blur-sm p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-space-800 border border-glass-border flex items-center justify-center mb-4 text-text-muted/50">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Awaiting Input</h3>
              <p className="text-sm text-text-muted max-w-xs mx-auto">
                Upload your resume and enter a job description to see how well you match the role.
              </p>
            </div>
          ) : isLoading ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-2xl border border-glass-border bg-glass-bg/50 backdrop-blur-sm p-8 text-center">
              <div className="w-16 h-16 rounded-full border-4 border-space-800 border-t-ai-primary animate-spin mb-6"></div>
              <h3 className="text-lg font-medium text-white animate-pulse">Running AI Analysis...</h3>
              <p className="text-sm text-text-muted mt-2">Simulating Applicant Tracking System algorithms</p>
            </div>
          ) : result ? (
            <div className="h-full rounded-2xl border border-glass-border bg-glass-bg/80 backdrop-blur-md p-6 flex flex-col">
              {/* Score Section */}
              <div className="flex flex-col items-center justify-center mb-8 pt-4">
                <div className="relative flex items-center justify-center">
                  {/* Decorative outer ring */}
                  <div className={`absolute inset-0 rounded-full border-4 opacity-20 ${getScoreColor(result.score).split(" ")[1]}`} />
                  <div className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border-4 shadow-xl ${getScoreColor(result.score)}`}>
                    <span className="text-4xl font-extrabold">{result.score}</span>
                    <span className="text-xs font-semibold uppercase tracking-wider opacity-80 mt-1">/ 100</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mt-6 mb-1">Match Score</h3>
                <p className="text-sm text-text-secondary text-center">
                  {result.score >= 80 ? "Great match! You have a high chance of passing the ATS." : 
                   result.score >= 60 ? "Good potential, but needs some optimization." : 
                   "Significant gaps found compared to the job description."}
                </p>
              </div>

              {/* Improvements Section */}
              <div className="flex-1">
                <h4 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4 border-b border-glass-border pb-2">
                  Actionable Improvements
                </h4>
                {result.improvements && result.improvements.length > 0 ? (
                  <ul className="space-y-4">
                    {result.improvements.map((improvement, index) => (
                      <li key={index} className="flex gap-3 items-start">
                        <CheckCircle2 className="h-5 w-5 text-ai-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-text-primary leading-relaxed">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-text-secondary text-center py-4">
                    No further improvements suggested. Your resume aligns perfectly!
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
