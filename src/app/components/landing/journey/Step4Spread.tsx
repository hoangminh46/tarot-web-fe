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
      <div className="flex gap-1">
        <div className="w-5 h-8 border border-[#c9a84c]/50 rounded-[4px] bg-[#c9a84c]/20 shadow-sm" />
      </div>
    ),
  },
  {
    count: 3,
    name: "Quá Khứ - Hiện Tại - Tương Lai",
    desc: "Cái nhìn toàn diện về con đường bạn đang đi và kết quả khả thi nếu giữ nguyên hướng đi.",
    layout: (
      <div className="flex gap-1.5">
        <div className="w-4 h-7 border border-[#c9a84c]/50 rounded-[3px] bg-[#c9a84c]/10" />
        <div className="w-4 h-7 border border-[#c9a84c] rounded-[3px] bg-[#c9a84c]/30 shadow-[0_0_8px_rgba(201,168,76,0.3)] scale-110" />
        <div className="w-4 h-7 border border-[#c9a84c]/50 rounded-[3px] bg-[#c9a84c]/10" />
      </div>
    ),
  },
  {
    count: 5,
    name: "Móng Ngựa Bạc",
    desc: "Phân tích sâu hơn về những ảnh hưởng từ bên ngoài và những trở ngại tiềm ẩn bạn chưa nhận ra.",
    layout: (
      <div className="flex gap-1 items-end h-10 pb-1">
        <div className="w-3.5 h-6 border border-[#c9a84c]/50 rounded-[2px] bg-[#c9a84c]/20 translate-y-[-8px] rotate-[-15deg]" />
        <div className="w-3.5 h-6 border border-[#c9a84c]/50 rounded-[2px] bg-[#c9a84c]/20 translate-y-[-4px] rotate-[-5deg]" />
        <div className="w-3.5 h-6 border border-[#c9a84c] rounded-[2px] bg-[#c9a84c]/40 shadow-[0_0_5px_rgba(201,168,76,0.5)] z-10" />
        <div className="w-3.5 h-6 border border-[#c9a84c]/50 rounded-[2px] bg-[#c9a84c]/20 translate-y-[-4px] rotate-[5deg]" />
        <div className="w-3.5 h-6 border border-[#c9a84c]/50 rounded-[2px] bg-[#c9a84c]/20 translate-y-[-8px] rotate-[15deg]" />
      </div>
    ),
  },
  {
    count: 7,
    name: "Hình Elip Thiêng",
    desc: "Chuyên sâu vào tâm lý bản thân, môi trường xung quanh, nỗi sợ hãi và tiềm năng bứt phá.",
    layout: (
      <div className="grid grid-cols-3 gap-1 h-12 place-items-center">
        <div className="w-3 h-5 border border-[#c9a84c]/40 bg-[#c9a84c]/10 rounded-sm" />
        <div className="w-3 h-5 border border-[#c9a84c]/40 bg-[#c9a84c]/10 rounded-sm" />
        <div className="w-3 h-5 border border-[#c9a84c]/40 bg-[#c9a84c]/10 rounded-sm" />
        <div className="col-span-3 flex justify-center mt-[-4px]">
          <div className="w-3 h-5 border border-[#c9a84c] bg-[#c9a84c]/30 rounded-sm shadow-[0_0_5px_rgba(201,168,76,0.3)] z-10 mx-0.5" />
          <div className="col-span-3 w-3 h-5 border border-[#c9a84c]/40 bg-[#c9a84c]/10 rounded-sm rotate-90 mx-0.5" />
        </div>
        <div className="w-3 h-5 border border-[#c9a84c]/40 bg-[#c9a84c]/10 rounded-sm mt-[-4px]" />
        <div className="w-3 h-5 border border-[#c9a84c]/40 bg-[#c9a84c]/10 rounded-sm mt-[-4px]" />
      </div>
    ),
  },
  {
    count: 10,
    name: "Thánh Giá Celtic",
    desc: "Trải bài kinh điển mạnh mẽ nhất, đánh giá toàn diện mọi biến số trong quá khứ, hiện tại và tương lai xa.",
    layout: (
      <div className="relative w-16 h-12 flex justify-center items-center">
        <div className="absolute w-3 h-5 border border-[#c9a84c]/80 bg-[#c9a84c]/30 rounded-[2px] shadow-[0_0_4px_rgba(201,168,76,0.5)] z-10" />
        <div className="absolute w-3 h-5 border border-[#c9a84c]/50 bg-[#c9a84c]/20 rounded-[2px] rotate-90 z-20" />
        <div className="absolute top-0 w-3 h-5 border border-[#c9a84c]/40 bg-[#c9a84c]/10 rounded-[2px] translate-y-[-4px]" />
        <div className="absolute bottom-0 w-3 h-5 border border-[#c9a84c]/40 bg-[#c9a84c]/10 rounded-[2px] translate-y-[4px]" />
        <div className="absolute left-0 w-3 h-5 border border-[#c9a84c]/40 bg-[#c9a84c]/10 rounded-[2px] translate-x-1" />
        <div className="absolute right-0 w-3 h-5 border border-[#c9a84c]/40 bg-[#c9a84c]/10 rounded-[2px] translate-x-[-4px]" />
        
        <div className="absolute right-[-10px] bottom-1 flex flex-col gap-0.5 scale-75">
          <div className="w-2.5 h-4 border border-[#c9a84c]/40 bg-[#c9a84c]/10 rounded-[1px]" />
          <div className="w-2.5 h-4 border border-[#c9a84c]/40 bg-[#c9a84c]/10 rounded-[1px]" />
          <div className="w-2.5 h-4 border border-[#c9a84c]/40 bg-[#c9a84c]/10 rounded-[1px]" />
          <div className="w-2.5 h-4 border border-[#c9a84c]/40 bg-[#c9a84c]/10 rounded-[1px]" />
        </div>
      </div>
    ),
  },
];

export default function Step4Spread({ spread, onChangeSpread }: Step4Props) {
  const currentSpread = SPREADS.find((s) => s.count === spread) || SPREADS[0];

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-4 animate-fade-in pb-4">
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
