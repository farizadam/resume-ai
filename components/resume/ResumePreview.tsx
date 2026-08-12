"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePDF } from "@react-pdf/renderer";
import { ResumeTemplate } from "../pdf/ResumeTemplate";

export function ResumePreview({ data = {} }: { data?: any }) {
  const [debouncedData, setDebouncedData] = useState(data);
  const [isDebouncing, setIsDebouncing] = useState(false);

  // 1. Debounce form input changes to prevent rapid PDF recompilations
  useEffect(() => {
    setIsDebouncing(true);
    const timer = setTimeout(() => {
      setDebouncedData(data);
      setIsDebouncing(false);
    }, 600); // 600ms debounce delay

    return () => clearTimeout(timer);
  }, [data]);

  // 2. Memoize the document component tree so @react-pdf doesn't re-parse on unrelated renders
  const documentMemo = useMemo(
    () => <ResumeTemplate data={debouncedData} />,
    [debouncedData]
  );

  // 3. Generate PDF blob URL asynchronously in a background thread
  const [instance, updateInstance] = usePDF({ document: documentMemo });

  // Update PDF instance whenever debounced data changes
  useEffect(() => {
    updateInstance(documentMemo);
  }, [documentMemo, updateInstance]);

  const isLoading = instance.loading || isDebouncing;

  return (
    <div className="h-full w-full relative bg-slate-100 flex items-center justify-center overflow-hidden">
      {/* 4. Display Blob URL inside an iframe for smooth 60fps rendering */}
      {instance.url ? (
        <iframe
          src={`${instance.url}#toolbar=0&navpanes=0&scrollbar=0`}
          className="w-full h-full border-none shadow-lg"
          title="Resume Preview"
        />
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-blue-500 animate-spin" />
          <p className="text-sm font-medium text-slate-500 animate-pulse">
            Generating document...
          </p>
        </div>
      )}

      {/* Floating Status Indicator */}
      {isLoading && instance.url && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 shadow-md border border-slate-200 flex items-center gap-2 transition-all">
          <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-300 border-t-blue-500 animate-spin" />
          Updating...
        </div>
      )}

      {/* Error Fallback */}
      {instance.error && (
        <div className="absolute inset-0 bg-red-50/90 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-sm font-semibold text-red-600">Failed to render PDF preview</p>
          <p className="text-xs text-red-500 mt-1">{instance.error}</p>
        </div>
      )}
    </div>
  );
}