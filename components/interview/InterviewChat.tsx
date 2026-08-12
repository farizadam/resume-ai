"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

type Role = "user" | "assistant";

interface Message {
  role: Role;
  content: string;
}

const STEPS = ["Contact", "Experience", "Skills", "Summary"];

export default function InterviewChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"collecting" | "complete">("collecting");
  const [error, setError] = useState<string | null>(null);
  const [candidateData, setCandidateData] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionMessage, setCompletionMessage] = useState("Finalizing candidate profile...");

  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "complete" || status === ("completed" as any)) {
      setIsCompleted(true);
      
      const step1 = setTimeout(() => {
        setCompletionMessage("Running ATS keyword optimization & STAR formatting...");
      }, 1000);

      const step2 = setTimeout(() => {
        setCompletionMessage("Generating resume preview...");
      }, 2000);

      const step3 = setTimeout(() => {
        if (resumeId) {
          router.push(`/builder?id=${resumeId}`);
        } else if (interviewId) {
          router.push(`/builder?id=${interviewId}`);
        } else {
          router.push("/builder");
        }
      }, 3000);

      return () => {
        clearTimeout(step1);
        clearTimeout(step2);
        clearTimeout(step3);
      };
    }
  }, [status, interviewId, resumeId, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, status]);

  const progress = Math.min(messages.length / 10, 1);

  const handleSendMessage = async (content: string) => {
    if (status === "complete" || isCompleted) return;

    const newUserMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const payload: any = { message: content };
      if (interviewId) {
        payload.interviewId = interviewId;
      }

      const res = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      if (!interviewId && data.interviewId) {
        setInterviewId(data.interviewId);
      }

      if (data.resumeId) {
        setResumeId(data.resumeId);
      }

      if (data.status) {
        setStatus(data.status);
      }

      if (data.candidateData) {
        setCandidateData(data.candidateData);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch (err: any) {
      console.error(err);
      setError("We encountered an issue sending your message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen bg-space-950 font-sans text-white">
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-glass-border bg-surface/50 backdrop-blur-xl px-6 md:px-12">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="text-xl font-extrabold tracking-tighter text-white">
            Resume <span className="text-text-muted">AI.</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium text-text-muted transition-colors hover:text-white">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="flex-1 min-h-0 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-0 lg:gap-8 relative">
        <main 
          className="min-h-0 h-full overflow-y-auto p-4 md:p-8 flex flex-col custom-scrollbar scroll-smooth"
          data-lenis-prevent
        >
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center pb-12">
              <EmptyState onQuickStart={() => handleSendMessage("Hi, I'm ready to start.")} />
            </div>
          ) : (
            <div className="flex flex-col space-y-4 pb-4">
              {messages.map((msg, index) => (
                <MessageBubble key={index} role={msg.role} content={msg.content} />
              ))}

              {isLoading && (
                <div className="flex w-full mb-4 justify-start animate-pulse">
                  <div className="bg-glass-bg border border-glass-border rounded-2xl rounded-bl-none px-4 py-4 shadow-sm flex items-center space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-center my-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-2 text-sm text-rose-400 bg-rose-500/10 px-4 py-2.5 rounded-lg border border-rose-500/20 shadow-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} className="h-1" />
            </div>
          )}
        </main>

        <aside className="hidden lg:block py-6 pr-4 min-h-0">
          <div className="flex flex-col h-full">
            <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-4 shrink-0 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Pro Tips
            </h3>

            <div className="flex flex-col gap-3">
              <TipCard
                number="1"
                title="Use the STAR Method"
                desc="Describe the Situation, Task, Action, and Result you achieved."
              />
              <TipCard
                number="2"
                title="Include Real Numbers"
                desc="Say 'reduced load times by 40%' instead of 'improved performance'."
              />
              <TipCard
                number="3"
                title="Drop Keywords & Tools"
                desc="Mention specific software (e.g., React, Agile). The AI will weave these in."
              />
            </div>
          </div>
        </aside>
      </div>

      {!isCompleted && (
        <div className="z-20">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      )}

      {isCompleted && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-space-950/60 backdrop-blur-md transition-all duration-300">
          <div className="flex flex-col items-center bg-surface border border-glass-border p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 text-center animate-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-full border-4 border-space-800 border-t-white animate-spin mb-6 shadow-sm"></div>
            <h3 className="text-2xl font-extrabold text-white mb-3">Interview Complete!</h3>
            <p className="text-text-muted font-medium animate-pulse">{completionMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function TipCard({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="group border border-glass-border bg-glass-bg backdrop-blur-sm rounded-xl p-3">
      <h4 className="font-semibold text-white flex items-center gap-2 mb-1.5 text-xs">
        <span className="flex items-center justify-center bg-space-800 border border-glass-border text-white w-5 h-5 rounded-full text-[10px] font-bold shrink-0">
          {number}
        </span>
        {title}
      </h4>
      <p className="text-text-secondary text-[11px] leading-relaxed pl-7">
        {desc}
      </p>
    </div>
  );
}

function EmptyState({ onQuickStart }: { onQuickStart: () => void }) {
  return (
    <div className="flex flex-col items-center text-center max-w-md mx-auto p-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-12 h-12 bg-space-800 border border-glass-border rounded-2xl flex items-center justify-center mb-4 shadow-sm rotate-3 shrink-0">
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      </div>

      <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
        Let's build your resume.
      </h2>
      <p className="text-text-muted leading-relaxed mb-6 text-sm">
        Answer a few questions about your work history. The preview builds on the side as we chat, and you can edit everything later.
      </p>

      <button
        onClick={onQuickStart}
        className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-space-950 transition-all duration-200 mb-8 hover:bg-slate-200 hover:scale-105"
      >
        Start the interview
      </button>

      <div className="bg-glass-bg backdrop-blur-md border border-glass-border p-4 rounded-xl shadow-sm text-left w-full relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white"></div>
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">
          First Question
        </p>
        <p className="text-xs font-medium text-white italic">
          "What's your name, and what role are you building this resume for?"
        </p>
      </div>
    </div>
  );
}