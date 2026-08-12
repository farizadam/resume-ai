import React from "react";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex w-full mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm border ${
          isUser
            ? "bg-white text-space-950 border-white rounded-br-none font-medium"
            : "bg-surface backdrop-blur-md text-text-primary border-glass-border rounded-bl-none"
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
