"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Step3Props {
  question: string;
  onChangeQuestion: (qs: string) => void;
  selectedTheme: string;
}

const PRESET_QUESTIONS: Record<string, string[]> = {
  love: [
    "Mối quan hệ này có tương lai không?",
    "Người ấy nghĩ gì về tôi?",
    "Làm sao để tìm được tình yêu đích thực?",
  ],
  career: [
    "Tôi có nên thay đổi công việc hiện tại?",
    "Định hướng nghề nghiệp nào phù hợp với tôi?",
    "Sắp tới công việc của tôi có biến động gì?",
  ],
  finance: [
    "Tình hình tài chính sắp tới của tôi ra sao?",
    "Tôi có nên đầu tư vào dự án này?",
    "Làm sao để tôi thu hút được nhiều tài lộc?",
  ],
  spirit: [
    "Bài học tâm linh tôi cần học lúc này là gì?",
    "Năng lượng hiện tại của tôi đang như thế nào?",
    "Tôi cần buông bỏ điều gì để bình an hơn?",
  ],
  future: [
    "3 tháng tới cuộc sống của tôi có gì nổi bật?",
    "Đâu là trở ngại tôi sắp phải đối mặt?",
    "Tôi cần chuẩn bị gì cho giai đoạn sắp tới?",
  ],
  general: [
    "Thông điệp vũ trụ muốn gửi đến tôi là gì?",
    "Tôi cần tập trung vào điều gì lúc này?",
    "Ngày hôm nay của tôi sẽ diễn ra thế nào?",
  ],
};

export default function Step3Question({ question, onChangeQuestion, selectedTheme }: Step3Props) {
  const [mode, setMode] = useState<"preset" | "custom">("preset");
  const maxLength = 200;

  const suggestions = PRESET_QUESTIONS[selectedTheme] || PRESET_QUESTIONS["general"];

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-6 animate-fade-in relative pb-4">
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
              {suggestions.map((p, idx) => (
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
                  className="w-full h-[180px] bg-[#0a0510]/50 border border-white/10 p-5 rounded-xl text-white/90 font-eb-garamond text-[16px] leading-relaxed resize-none focus:outline-none focus:border-[#c9a84c]/60 focus:ring-1 focus:ring-[#c9a84c]/60 transition-all placeholder:text-white/20 placeholder:italic shadow-inner"
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
