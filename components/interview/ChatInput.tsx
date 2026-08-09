"use client";

import React, { useRef, useState, useLayoutEffect, FormEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Type your answer...",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // useLayoutEffect prevents flickering during textarea resize
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [value]);

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setValue("");

    // Immediately reset height when text is cleared
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0 z-10">
      <div className="max-w-5xl mx-auto lg:pr-[344px]">
        {/* Semantic form wrapper for better a11y and standard submission */}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-end bg-gray-50 rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all shadow-sm"
        >
          {/* Decorative accent bar */}
          <div className="w-1 self-stretch rounded-l-xl bg-blue-100" aria-hidden="true" />

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={disabled ? "Please wait..." : placeholder}
            aria-label="Chat message input"
            className="w-full bg-transparent border-transparent focus:border-transparent focus:ring-0 outline-none focus:outline-none resize-none py-4 px-4 max-h-[150px] text-sm text-gray-800 disabled:opacity-50 min-h-[52px]"
            rows={1}
          />

          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className="mb-2 mr-2 shrink-0 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-gray-50"
            aria-label="Send message"
          >
            Send
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-2 px-2 select-none">
          Press <kbd className="font-sans font-medium px-1 bg-gray-100 rounded">Enter</kbd> to send, <kbd className="font-sans font-medium px-1 bg-gray-100 rounded">Shift + Enter</kbd> for a new line.
        </p>
      </div>
    </div>
  );
}