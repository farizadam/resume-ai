"use client";

import React, { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  
  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if we're hovering over a clickable element
      const target = e.target as HTMLElement;
      const isClickable = 
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button";
        
      setIsPointer(isClickable);
    };

    window.addEventListener("mousemove", updateCursor);
    return () => window.removeEventListener("mousemove", updateCursor);
  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 w-4 h-4 bg-black rounded-full pointer-events-none z-[9999] mix-blend-difference transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${position.x - 8}px, ${position.y - 8}px, 0) scale(${isPointer ? 1.5 : 1})`,
          backgroundColor: "white", // Because of mix-blend-difference against light backgrounds
        }}
      />
      <div
        className="fixed top-0 left-0 w-10 h-10 border border-black rounded-full pointer-events-none z-[9998] mix-blend-difference transition-all duration-300 ease-out"
        style={{
          transform: `translate3d(${position.x - 20}px, ${position.y - 20}px, 0) scale(${isPointer ? 1.2 : 1})`,
          borderColor: "white", // Because of mix-blend-difference
          opacity: isPointer ? 0 : 1
        }}
      />
      {/* Hide the default cursor */}
      <style dangerouslySetInnerHTML={{ __html: `
        * {
          cursor: none !important;
        }
      `}} />
    </>
  );
}
