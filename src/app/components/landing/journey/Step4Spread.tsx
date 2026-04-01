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
      <div className="flex justify-center items-center gap-1.5">
        <div className="w-5 h-8 border border-[#c9a84c]/60 rounded-sm bg-[#c9a84c]/20 shadow-[0_0_8px_rgba(201,168,76,0.3)]" />
      </div>
    ),
  },
  {
    count: 3,
    name: "Quá Khứ - Hiện Tại - Tương Lai",
    desc: "Cái nhìn toàn diện về con đường bạn đang đi và kết quả khả thi nếu giữ nguyên hướng đi.",
    layout: (
      <div className="flex justify-center items-center gap-1.5">
        <div className="w-3.5 h-6 border border-[#c9a84c]/40 rounded-sm bg-[#c9a84c]/10" />
        <div className="w-3.5 h-6 border border-[#c9a84c]/60 rounded-sm bg-[#c9a84c]/30 shadow-[0_0_8px_rgba(201,168,76,0.3)] scale-110" />
        <div className="w-3.5 h-6 border border-[#c9a84c]/40 rounded-sm bg-[#c9a84c]/10" />
      </div>
    ),
  },
  {
    count: 5,
    name: "Chuỗi Sự Kiện Định Mệnh",
    desc: "Phân tích thẳng hàng các khía cạnh: bản chất, nguyên nhân, thử thách, khuyên nhủ và kết quả.",
    layout: (
      <div className="flex justify-center items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-3 h-5 border rounded-[2px] ${
              i === 3
                ? "border-[#c9a84c]/60 bg-[#c9a84c]/30 shadow-[0_0_5px_rgba(201,168,76,0.5)] scale-110"
                : "border-[#c9a84c]/40 bg-[#c9a84c]/10"
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
      <div className="flex justify-center items-center gap-1">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            className={`w-2.5 h-4 border rounded-[2px] ${
              i === 4
                ? "border-[#c9a84c]/60 bg-[#c9a84c]/30 shadow-[0_0_5px_rgba(201,168,76,0.5)] scale-125"
                : "border-[#c9a84c]/40 bg-[#c9a84c]/10"
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
    <div className="w-full mx-auto flex flex-col gap-4 animate-fade-in pb-4">
      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto no-scrollbar mask-fade-y pb-6">
        {SPREADS.map((s) => {
          const isActive = spread === s.count;
          return (
            <motion.div
              key={s.count}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChangeSpread(s.count)}
              className={`
                relative flex items-center p-4 gap-4 rounded-xl cursor-pointer border transition-all duration-300
                ${
                  isActive
                    ? "bg-[#c9a84c]/10 border-[#c9a84c] shadow-[0_0_15px_rgba(201,168,76,0.15)]"
                    : "bg-[#0a0510]/60 border-white/5 hover:border-white/20 hover:bg-[#1f1035]/50"
                }
              `}
            >
              <div className="shrink-0 w-16 flex justify-center items-center opacity-80 mix-blend-screen">
                {s.layout}
              </div>

              <div className="flex flex-col">
                <span
                  className={`font-eb-garamond text-base mb-0.5 ${
                    isActive ? "text-[#c9a84c] font-bold" : "text-white/80"
                  }`}
                >
                  {s.name}
                </span>
                <span className="text-white/40 text-[10px] tracking-wider uppercase font-semibold">
                  {s.count} Lá Bài
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dynamic Description Box */}
      <div className="mt-2 text-center border-t border-[rgba(201,168,76,0.1)] pt-4 px-2">
        <p className="text-[#e8b4ff]/90 font-eb-garamond italic text-[15px] leading-relaxed drop-shadow-sm transition-opacity duration-300">
          &quot;{currentSpread.desc}&quot;
        </p>
      </div>

    </div>
  );
}
