"use client";

import Image from "next/image";
import { useState } from "react";
import Sigil from "@/app/components/common/Sigil";
import MysticalButton from "@/app/components/common/MysticalButton";
import { JourneyFormModal } from "./JourneyFormModal";

/**
 * LandingHero — Nội dung trung tâm landing page.
 * Bao gồm: Sigil, Title, Subtitle, Rune row, CTA button,
 * History button, Dictionary link.
 */
export default function LandingHero() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleBeginJourney = () => {
    // Mở form overlay nhập thông tin
    setIsFormOpen(true);
  };

  return (
    <div className="landing-center relative z-[5] flex flex-col items-center gap-[18px] text-center px-5 py-10 select-none">
      {/* Sigil xoay */}
      <Sigil size={200} />

      {/* Tiêu đề chính */}
      <h1 className="landing-title font-display font-black text-[clamp(2rem,6vw,3.8rem)] tracking-[0.04em] leading-[1.2]">
        <span className="title-word inline-block" style={{ "--wi": 0 } as React.CSSProperties}>
          Tarot
        </span>
        {" "}
        <span className="inline-block">
          <span
            className="title-word inline-block text-gold"
            style={{ "--wi": 1 } as React.CSSProperties}
          >
            Huyền
          </span>
          {" "}
          <span
            className="title-word inline-block text-gold"
            style={{ "--wi": 2 } as React.CSSProperties}
          >
            Bí
          </span>
        </span>
      </h1>

      {/* Subtitle */}
      <p
        className="reveal-item font-ui text-[clamp(0.75rem,1.8vw,0.95rem)] text-pale tracking-[0.22em] uppercase opacity-80"
        style={{ "--di": 0 } as React.CSSProperties}
      >
        Nhìn xuyên màn đêm &mdash; Khám phá vận mệnh
      </p>

      {/* Rune row — ký tự cổ đại trang trí */}
      <div
        className="reveal-item flex items-center gap-3.5 my-1"
        style={{ "--di": 1 } as React.CSSProperties}
      >
        <span className="rune text-lg">&#x16A0;</span>
        <span className="rune-dot" />
        <span className="rune text-lg">&#x16B9;</span>
        <span className="rune-dot" />
        <span className="rune text-lg">&#x16C1;</span>
        <span className="rune-dot" />
        <span className="rune text-lg">&#x16A2;</span>
      </div>

      {/* Nút CTA chính */}
      <div
        className="reveal-item"
        style={{ "--di": 2 } as React.CSSProperties}
      >
        <MysticalButton onClick={handleBeginJourney}>
          Bắt Đầu Hành Trình
        </MysticalButton>
      </div>

      {/* Nút lịch sử trải bài */}
      <button
        className="reveal-item btn-history"
        style={{ "--di": 3 } as React.CSSProperties}
        title="Lịch Sử Trải Bài"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        Thông điệp quá khứ
      </button>

      {/* Link xem ý nghĩa các lá bài (Dictionary) */}
      <p
        className="reveal-item landing-hint inline-flex items-center justify-center gap-2"
        style={{ "--di": 4 } as React.CSSProperties}
      >
        <span className="dict-card-fan">
          <Image src="/svgTarot/card.svg" alt="" width={20} height={28} className="fan-card fan-card-1" />
          <Image src="/svgTarot/card.svg" alt="" width={20} height={28} className="fan-card fan-card-2" />
          <Image src="/svgTarot/card.svg" alt="" width={20} height={28} className="fan-card fan-card-3" />
        </span>
        <span>Ý nghĩa các lá bài</span>
      </p>

      {/* Tích hợp Modal nhập thông tin */}
      <JourneyFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
