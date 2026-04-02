"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MAIN_THEMES, SUB_THEMES } from "@/json/tarot_themes";

// Map key to SVG icon
const MAIN_ICONS: Record<string, React.ReactNode> = {
  love: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  career: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  finance: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
      <path d="M10 10l4 4" />
      <path d="M10 14l4-4" />
    </svg>
  ),
  health: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  self: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22v-5" />
      <path d="M12 8v4" />
      <circle cx="12" cy="5" r="3" />
      <path d="M5 12h14" />
    </svg>
  ),
  more: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  ),
};

interface Step2Props {
  theme: string;
  onChangeTheme: (v: string) => void;
  onNextStep?: () => void; // Cho auto-advance
  activeMain: string | null;
  setActiveMain: (v: string | null) => void;
}

interface SubThemeItem {
  key: string;
  label: string;
  desc: string;
}

export default function Step2Theme({ theme, onChangeTheme, onNextStep, activeMain, setActiveMain }: Step2Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectMain = (mainKey: string) => {
    setActiveMain(mainKey);
    setSearchQuery("");
  };

  const handleSelectSub = (subKey: string) => {
    onChangeTheme(subKey);
    if (onNextStep) {
      setTimeout(onNextStep, 250);
    }
  };

  // Tính toán danh sách sub-themes cần hiển thị
  let displayedSubs: { key: string; label: string; desc: string; group?: string }[] = [];
  if (activeMain === "more") {
    // Hiển thị tất cả
    Object.keys(SUB_THEMES).forEach((k) => {
      const gName = MAIN_THEMES.find((t) => t.key === k)?.label || "";
      const subs = (SUB_THEMES as Record<string, SubThemeItem[]>)[k].map((s) => ({ ...s, group: gName }));
      displayedSubs = [...displayedSubs, ...subs];
    });
  } else if (activeMain) {
    displayedSubs = (SUB_THEMES as Record<string, SubThemeItem[]>)[activeMain] || [];
  }

  // Filter theo search
  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    displayedSubs = displayedSubs.filter((s) => {
      const t = (s.label + " " + s.desc).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return t.includes(q);
    });
  }

  return (
    <div className="w-full h-full flex flex-col animate-fade-in relative mx-auto">
      <AnimatePresence mode="wait">
        {!activeMain ? (
          <motion.div
            key="main-grid"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="w-full grid grid-cols-3 gap-3"
          >
            {MAIN_THEMES.map((t) => (
              <motion.button
                key={t.key}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectMain(t.key)}
                className="relative flex flex-col items-center justify-center p-5 gap-2 rounded-xl cursor-pointer transition-all duration-300 border bg-[#0a0510]/80 border-white/5 hover:border-[#c9a84c]/30 hover:bg-[#140a26] group shadow-sm"
              >
                <div className="w-10 h-10 rounded-full border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] group-hover:bg-[#c9a84c]/10 transition-colors duration-300">
                  {/* Scale down the SVG to fit nice inside the circle */}
                  <div className="scale-75">
                    {MAIN_ICONS[t.key]}
                  </div>
                </div>
                <span className="font-eb-garamond font-bold text-center tracking-wide text-[#c9a84c] text-[15px] transition-colors mt-1">
                  {t.label}
                </span>
                <span className="text-xs text-white/40 group-hover:text-white/60 font-eb-garamond italic text-center">
                  {t.desc}
                </span>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="sub-list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full h-[340px] flex flex-col"
          >
            <div className="flex flex-col gap-3 relative z-10 w-full mb-3 shrink-0">
               {/* Search Bar pill-shaped */}
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm nhanh chủ đề..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 rounded-full border border-white/10 bg-transparent text-[#e8b4ff] font-eb-garamond outline-none focus:border-[#c9a84c]/60 transition-all placeholder:text-white/30 text-sm focus:shadow-[0_0_15px_rgba(201,168,76,0.4)]"
                />
                <svg className="absolute left-4 top-[11px] text-white/30 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-2">
              <div className="flex flex-col gap-2">
                {displayedSubs.length === 0 ? (
                  <div className="text-center text-[#e8e0ff]/50 py-10 font-eb-garamond italic text-sm">
                    Không tìm thấy chủ đề phù hợp ✧
                  </div>
                ) : (
                  displayedSubs.map((s) => {
                    const isActive = theme === s.key;
                    return (
                      <button
                        key={s.key}
                        onClick={() => handleSelectSub(s.key)}
                        className={`
                          w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all duration-300 border-white/5
                          ${isActive ? "bg-[#c9a84c]/10 border-[#c9a84c]/50" : "bg-transparent hover:bg-white/5"}
                        `}
                      >
                        <div className="flex flex-row items-baseline gap-3 overflow-hidden">
                          <span className="font-eb-garamond text-[#c9a84c] font-bold text-sm whitespace-nowrap">
                            {s.label}
                          </span>
                          <span className="text-[13px] font-eb-garamond text-white/40 italic truncate">
                            {s.group ? `${s.group} · ` : ""}{s.desc}
                          </span>
                        </div>
                        <div className="text-white/20 ml-3 shrink-0">
                          {isActive ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(201, 168, 76, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(201, 168, 76, 0.4);
        }
      `}</style>
    </div>
  );
}
