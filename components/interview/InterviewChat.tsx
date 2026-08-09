"use client";

import React, { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

type Role = "user" | "assistant";

interface Message {
  role: Role;
  content: string;
}

export default function InterviewChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"collecting" | "complete">("collecting");
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, status]);

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

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong. Please try sending your message again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-gray-800">AI Resume Builder</h1>
        {status === "complete" && (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
            Completed
          </span>
        )}
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full max-w-4xl mx-auto flex flex-col">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700">Ready to build your resume?</h2>
            <p className="text-center max-w-md">
              Say hello to start the interview. The AI will ask you a few questions to gather your professional information.
            </p>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {messages.map((msg, index) => (
              <MessageBubble key={index} role={msg.role} content={msg.content} />
            ))}
            
            {isLoading && (
              <div className="flex w-full mb-4 justify-start">
                <div className="bg-white text-gray-500 border border-gray-100 rounded-2xl rounded-bl-none px-5 py-3 shadow-sm flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-center my-2">
                <span className="text-sm text-red-500 bg-red-50 px-3 py-1 rounded-md border border-red-100">
                  {error}
                </span>
              </div>
            )}
            
            {status === "complete" && (
              <div className="flex flex-col items-center justify-center my-8 p-6 bg-green-50 border border-green-200 rounded-2xl text-center space-y-3 shadow-sm">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-green-800">Interview complete</h3>
                <p className="text-sm text-green-700 max-w-sm">
                  Your information has been collected successfully. Your resume is ready to be generated.
                </p>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {status !== "complete" && (
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      )}
    </div>
  );
}
