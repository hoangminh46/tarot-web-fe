"use client";

import React from "react";
import { motion } from "framer-motion";

interface Step2Props {
  theme: string;
  onChangeTheme: (v: string) => void;
}

const THEMES = [
  {
    id: "love",
    label: "Tình Yêu",
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    id: "career",
    label: "Sự Nghiệp",
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    id: "finance",
    label: "Tài Chính",
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
        <path d="M10 10l4 4" />
        <path d="M10 14l4-4" />
      </svg>
    ),
  },
  {
    id: "spirit",
    label: "Tâm Linh",
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10z" />
        <path d="M12 2v20" />
        <path d="M12 12c-3.3 0-6-2.7-6-6" />
        <path d="M12 12c3.3 0 6 2.7 6 6" />
      </svg>
    ),
  },
  {
    id: "future",
    label: "Tương Lai",
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 12h18" />
        <path d="M15 6l6 6-6 6" />
        <circle cx="6" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: "general",
    label: "Tổng Quan",
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
];

export default function Step2Theme({ theme, onChangeTheme }: Step2Props) {
  return (
    <div className="w-full max-w-lg mx-auto grid grid-cols-2 gap-4 animate-fade-in pb-4">
      {THEMES.map((t) => {
        const isActive = theme === t.id;
        return (
          <motion.div
            key={t.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChangeTheme(t.id)}
            className={`
              relative flex flex-col items-center justify-center p-6 gap-3 rounded-xl cursor-pointer
              transition-all duration-300 border
              ${
                isActive
                  ? "bg-[#c9a84c]/10 border-[#c9a84c] shadow-[0_0_20px_rgba(201,168,76,0.2)]"
                  : "bg-[#0a0510]/60 border-white/5 hover:border-white/20 hover:bg-[#1f1035]/50"
              }
            `}
          >
            {/* Mystic Glow */}
            {isActive && (
              <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.15),transparent_70%)] pointer-events-none" />
            )}

            <div className={`transition-colors duration-300 ${isActive ? "text-[#c9a84c]" : "text-white/40"}`}>
              {t.svg}
            </div>

            <span
              className={`font-eb-garamond text-center tracking-wide ${
                isActive ? "text-[#c9a84c] font-bold" : "text-white/60"
              }`}
            >
              {t.label}
            </span>

            {/* Checkmark Top Right */}
            {isActive && (
              <div className="absolute top-2 right-2 text-[#c9a84c] opacity-80">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
