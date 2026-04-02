"use client";

import React from "react";
import { motion } from "framer-motion";

interface Step4Props {
  spread: number;
  onChangeSpread: (s: number) => void;
}

const SPREADS = [
  {
    count: 1,
    name: "Thông Điệp Tập Trung",
    desc: "Một lá bài duy nhất, thích hợp cho câu trả lời định hướng nhanh, rõ ràng và dứt khoát.",
    layout: (
      <div className="flex h-12 items-center justify-center gap-1.5">
        <div className="h-8 w-5 rounded-sm border border-[#c9a84c]/60 bg-[#c9a84c]/20 shadow-[0_0_8px_rgba(201,168,76,0.3)]" />
      </div>
    ),
  },
  {
    count: 3,
    name: "Quá Khứ - Hiện Tại - Tương Lai",
    desc: "Cái nhìn toàn diện về con đường bạn đang đi và kết quả khả thi nếu giữ nguyên hướng đi.",
    layout: (
      <div className="flex h-12 items-center justify-center gap-1.5">
        <div className="h-6 w-3.5 rounded-sm border border-[#c9a84c]/40 bg-[#c9a84c]/10" />
        <div className="h-7 w-4 rounded-sm border border-[#c9a84c]/60 bg-[#c9a84c]/30 shadow-[0_0_8px_rgba(201,168,76,0.3)]" />
        <div className="h-6 w-3.5 rounded-sm border border-[#c9a84c]/40 bg-[#c9a84c]/10" />
      </div>
    ),
  },
  {
    count: 5,
    name: "Chuỗi Sự Kiện Định Mệnh",
    desc: "Phân tích thẳng hàng các khía cạnh: bản chất, nguyên nhân, thử thách, khuyên nhủ và kết quả.",
    layout: (
      <div className="flex h-12 items-center justify-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`rounded-[2px] border ${
              i === 3
                ? "h-6 w-3.5 border-[#c9a84c]/60 bg-[#c9a84c]/30 shadow-[0_0_5px_rgba(201,168,76,0.5)]"
                : "h-5 w-3 border-[#c9a84c]/40 bg-[#c9a84c]/10"
            }`}
          />
        ))}
      </div>
    ),
  },
  {
    count: 7,
    name: "Hành Trình Bảy Bước",
    desc: "Trải bài tuyến tính phân tích chuyên sâu về nội tâm, môi trường xung quanh và toàn bộ lộ trình sắp tới.",
    layout: (
      <div className="flex h-12 items-center justify-center gap-1">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            className={`rounded-[2px] border ${
              i === 4
                ? "h-5 w-3 border-[#c9a84c]/60 bg-[#c9a84c]/30 shadow-[0_0_5px_rgba(201,168,76,0.5)]"
                : "h-4 w-2.5 border-[#c9a84c]/40 bg-[#c9a84c]/10"
            }`}
          />
        ))}
      </div>
    ),
  },
];

export default function Step4Spread({ spread, onChangeSpread }: Step4Props) {
  const currentSpread = SPREADS.find((s) => s.count === spread) || SPREADS[0];

  return (
    <div className="mx-auto flex w-full animate-fade-in flex-col gap-4 pb-4">
      <div className="grid max-h-[280px] grid-cols-1 gap-3 overflow-y-auto pb-6 md:grid-cols-2">
        {SPREADS.map((s) => {
          const isActive = spread === s.count;

          return (
            <motion.button
              key={s.count}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => onChangeSpread(s.count)}
              className={`relative flex min-h-[104px] items-center gap-4 rounded-xl border p-4 text-left transition-colors duration-300 ${
                isActive
                  ? "border-[#c9a84c] bg-[#c9a84c]/10 shadow-[0_0_15px_rgba(201,168,76,0.15)]"
                  : "border-white/5 bg-[#0a0510]/60 hover:border-white/20 hover:bg-[#1f1035]/50"
              }`}
            >
              <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] opacity-80 mix-blend-screen">
                {s.layout}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <span
                  className={`mb-0.5 font-eb-garamond text-base leading-snug ${
                    isActive ? "font-bold text-[#c9a84c]" : "text-white/80"
                  }`}
                >
                  {s.name}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  {s.count} Lá Bài
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-2 border-t border-[rgba(201,168,76,0.1)] px-2 pt-4 text-center">
        <p className="font-eb-garamond text-[15px] italic leading-relaxed text-[#e8b4ff]/90 drop-shadow-sm transition-opacity duration-300">
          &quot;{currentSpread.desc}&quot;
        </p>
      </div>
    </div>
  );
}
