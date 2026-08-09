"use client";

import React, { useState, useRef, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"collecting" | "complete">("collecting");
  const [error, setError] = useState<string | null>(null);
  const [candidateData, setCandidateData] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, status]);

  const progress = Math.min(messages.length / 10, 1);

  const handleSendMessage = async (content: string) => {
    if (status === "complete") return;

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
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      if (!interviewId && data.interviewId) {
        setInterviewId(data.interviewId);
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
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 px-6 py-3 shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h1 className="text-base font-semibold text-slate-800">AI Resume Builder</h1>
          </div>

          <div className="hidden sm:flex items-center gap-3 flex-1 justify-center">
            {STEPS.map((step, i) => {
              const stepProgress = (i + 1) / STEPS.length;
              const isActive = progress >= stepProgress - 1 / STEPS.length && progress < stepProgress;
              const isDone = progress >= stepProgress || status === "complete";
              return (
                <React.Fragment key={step}>
                  <div className="flex items-center gap-2 transition-opacity duration-300">
                    <span
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${isDone ? "bg-blue-600" : isActive ? "bg-blue-400 ring-2 ring-blue-100" : "bg-slate-200"
                        }`}
                    />
                    <span
                      className={`text-xs font-medium transition-colors duration-300 ${isDone ? "text-slate-800" : isActive ? "text-blue-700" : "text-slate-400"
                        }`}
                    >
                      {step}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && <div className={`w-6 h-[2px] rounded-full transition-colors duration-300 ${isDone ? "bg-blue-100" : "bg-slate-100"}`} />}
                </React.Fragment>
              );
            })}
          </div>

          <div className="shrink-0 w-[120px] flex justify-end">
            {status === "complete" && (
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold uppercase tracking-wider rounded-full shadow-sm">
                Completed
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-0 lg:gap-8 relative">
        <main className="min-h-0 h-full overflow-y-auto p-4 md:p-8 flex flex-col custom-scrollbar scroll-smooth">
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
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-4 shadow-sm flex items-center space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-center my-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 px-4 py-2.5 rounded-lg border border-rose-200 shadow-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              {status === "complete" && (
                <div className="flex flex-col items-center justify-center my-10 p-8 bg-emerald-50/50 border border-emerald-200/60 rounded-3xl text-center space-y-4 shadow-sm">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-1 shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-emerald-800 mb-1">Interview Complete!</h3>
                    <p className="text-sm text-emerald-700 max-w-md mx-auto leading-relaxed">
                      All your information has been successfully collected. Your professional resume is now ready to be generated and reviewed.
                    </p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} className="h-1" />
            </div>
          )}
        </main>

        <aside className="hidden lg:block py-8 pr-4 min-h-0">
          <div className="flex flex-col h-full">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-5 shrink-0 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Pro Tips
            </h3>

            <div className="flex flex-col gap-5">
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

      {status !== "complete" && (
        <div className="z-20">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      )}
    </div>
  );
}

function TipCard({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="group">
      <h4 className="font-semibold text-slate-700 flex items-center gap-2 mb-1 text-[13px]">
        <span className="flex items-center justify-center bg-blue-100 text-blue-700 w-5 h-5 rounded-full text-[10px] font-bold">
          {number}
        </span>
        {title}
      </h4>
      <p className="text-slate-500 text-[12.5px] leading-relaxed pl-7">
        {desc}
      </p>
    </div>
  );
}

function EmptyState({ onQuickStart }: { onQuickStart: () => void }) {
  return (
    <div className="flex flex-col items-center text-center max-w-md mx-auto p-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100 rotate-3">
        <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      </div>

      <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-3">
        Let's build your resume.
      </h2>
      <p className="text-slate-500 leading-relaxed mb-8 text-lg">
        Answer a few questions about your work history. The preview builds on the side as we chat, and you can edit everything later.
      </p>

      <button
        onClick={onQuickStart}
        className="rounded-full bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-200 mb-10"
      >
        Start the interview
      </button>

      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-left w-full relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400"></div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
          First Question
        </p>
        <p className="text-sm font-medium text-slate-700 italic">
          "What's your name, and what role are you building this resume for?"
        </p>
      </div>
    </div>
  );
}