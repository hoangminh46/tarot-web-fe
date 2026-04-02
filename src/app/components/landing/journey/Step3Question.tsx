"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRESET_QUESTIONS } from "@/json/tarot_themes";

interface Step3Props {
  question: string;
  onChangeQuestion: (qs: string) => void;
  selectedTheme: string;
}

const DEFAULT_QUESTIONS = [
  "Thông điệp nào vũ trụ muốn gửi đến tôi lúc này?",
  "Tôi cần tĩnh tâm và tập trung vào điều gì?",
  "Ngày hôm nay của tôi sẽ diễn ra thế nào?",
  "Tôi đang che giấu bản thân mình điều gì?",
  "Làm sao để tôi lấy lại sự cân bằng trong cuộc sống?",
];

export default function Step3Question({ question, onChangeQuestion, selectedTheme }: Step3Props) {
  const [mode, setMode] = useState<"preset" | "custom">("preset");
  const [randomizedQuestions, setRandomizedQuestions] = useState<string[]>([]);
  const maxLength = 200;

  useEffect(() => {
    // Lấy câu hỏi từ PRESET_QUESTIONS dựa theo selectedTheme
    let qsList: string[] = [];
    const themeQs = (PRESET_QUESTIONS as Record<string, { group: string; qs: string[] }[]>)[selectedTheme];
    if (themeQs && Array.isArray(themeQs) && themeQs.length > 0) {
      // themeQs là [{ group: '...', qs: [...] }]
      themeQs.forEach((g) => {
        if (g.qs && Array.isArray(g.qs)) {
          qsList = [...qsList, ...g.qs];
        }
      });
    }

    if (qsList.length === 0) {
      qsList = DEFAULT_QUESTIONS;
    }

    // Shuffle and pick 6 to keep UI clean
    const shuffled = [...qsList].sort(() => 0.5 - Math.random());
    setRandomizedQuestions(shuffled.slice(0, 6));
  }, [selectedTheme]);

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-6 animate-fade-in relative pb-4">
      {/* Tab Switcher */}
      <div className="flex bg-[#0a0510]/80 rounded-full p-1 border border-white/5 relative z-10 w-fit mx-auto shadow-inner">
        <button
          onClick={() => setMode("preset")}
          className={`relative px-6 py-2 rounded-full font-eb-garamond tracking-wide text-sm transition-colors z-10 ${
            mode === "preset" ? "text-[#140a26] font-bold" : "text-white/60 hover:text-white"
          }`}
        >
          {mode === "preset" && (
            <motion.div
              layoutId="tabBackground"
              className="absolute inset-0 bg-[#c9a84c] rounded-full z-[-1]"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          Gợi ý
        </button>
        <button
          onClick={() => setMode("custom")}
          className={`relative px-6 py-2 rounded-full font-eb-garamond tracking-wide text-sm transition-colors z-10 ${
            mode === "custom" ? "text-[#140a26] font-bold" : "text-white/60 hover:text-white"
          }`}
        >
          {mode === "custom" && (
            <motion.div
              layoutId="tabBackground"
              className="absolute inset-0 bg-[#c9a84c] rounded-full z-[-1]"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          Tự Đặt Câu Hỏi
        </button>
      </div>

      {/* Content Area */}
      <div className="relative min-h-[160px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {mode === "preset" ? (
            <motion.div
              key="preset"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-3 w-full"
            >
              <div className="flex justify-end mb-1">
                <button
                  type="button"
                  onClick={() => {
                    let qsList: string[] = [];
                    const themeQs = (PRESET_QUESTIONS as Record<string, { group: string; qs: string[] }[]>)[selectedTheme];
                    if (themeQs && Array.isArray(themeQs) && themeQs.length > 0) {
                      themeQs.forEach((g) => { qsList = [...qsList, ...(g.qs || [])]; });
                    }
                    if (qsList.length === 0) qsList = DEFAULT_QUESTIONS;
                    setRandomizedQuestions([...qsList].sort(() => 0.5 - Math.random()).slice(0, 6));
                  }}
                  className="text-white/40 hover:text-[#c9a84c] transition-colors text-xs font-eb-garamond flex items-center gap-1"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10" />
                    <polyline points="23 20 23 14 17 14" />
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10" />
                    <path d="M3.51 15A9 9 0 0 0 18.36 18.36L23 14" />
                  </svg>
                  Đổi gợi ý
                </button>
              </div>
              {randomizedQuestions.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => onChangeQuestion(p)}
                  className={`text-left p-4 rounded-xl font-eb-garamond text-[15px] italic leading-relaxed transition-all duration-300 border ${
                    question === p
                      ? "bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/50 shadow-[0_0_10px_rgba(201,168,76,0.15)]"
                      : "bg-[#1f1035]/30 text-white/70 border-white/5 hover:border-white/20 hover:bg-[#1f1035]/60 hover:text-white"
                  }`}
                >
                  &quot;{p}&quot;
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="custom"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full h-full"
            >
              <div className="relative h-full">
                <textarea
                  value={question}
                  onChange={(e) => onChangeQuestion(e.target.value.substring(0, maxLength))}
                  placeholder="Hãy đặt câu hỏi cụ thể, chi tiết và tránh câu hỏi Có/Không..."
                  className="w-full h-[180px] bg-[#0a0510]/50 border border-white/10 p-5 rounded-xl text-white/90 font-eb-garamond text-[16px] leading-relaxed resize-none focus:outline-none focus:border-[#c9a84c]/60 focus:shadow-[0_0_15px_rgba(201,168,76,0.4)] transition-all placeholder:text-white/20 placeholder:italic shadow-inner"
                />
                <span
                  className={`absolute bottom-4 right-4 text-xs font-mono transition-colors ${
                    question.length >= maxLength - 20 ? "text-red-400" : "text-white/30"
                  }`}
                >
                  {question.length}/{maxLength}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
