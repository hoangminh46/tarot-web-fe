"use client";

import Image from "next/image";
import { useState } from "react";
import MysticalButton from "@/app/components/common/MysticalButton";
import { JourneyFormModal } from "./JourneyFormModal";

/**
 * LandingHero — Nội dung trung tâm landing page.
 * Gồm: Title, Subtitle, Rune row, CTA button,
 * History button, Dictionary link.
 */
export default function LandingHero() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleBeginJourney = () => {
    setIsFormOpen(true);
  };

  return (
    <div className="landing-center relative z-[5] flex select-none flex-col items-center gap-[18px] px-5 py-10 text-center">
      <div
        className="reveal-item hero-focal relative mb-1"
        style={{ "--di": 0 } as React.CSSProperties}
      >
        <div className="hero-lightbeam" />
        <div className="hero-aura-cloud hero-aura-cloud--violet" />
        <div className="hero-aura-cloud hero-aura-cloud--gold" />
        <div className="hero-halo hero-halo--outer" />
        <div className="hero-halo hero-halo--inner" />
        <div className="hero-orbit hero-orbit--one" />
        <div className="hero-orbit hero-orbit--two" />
        <div className="hero-card-fan">
          <div className="hero-card hero-card--left">
            <Image
              src="/cards/17-The-Star.jpg"
              alt="The Star tarot card"
              width={170}
              height={292}
              className="hero-card__image"
              priority
            />
          </div>
          <div className="hero-card hero-card--center">
            <Image
              src="/cards/0-The-Fool.jpg"
              alt="The Fool tarot card"
              width={188}
              height={322}
              className="hero-card__image"
              priority
            />
          </div>
          <div className="hero-card hero-card--right">
            <Image
              src="/cards/1-The-Magician.jpg"
              alt="The Magician tarot card"
              width={170}
              height={292}
              className="hero-card__image"
              priority
            />
          </div>
        </div>
      </div>

      <h1 className="landing-title font-display text-[clamp(2rem,6vw,3.8rem)] font-black leading-[1.2] tracking-[0.04em]">
        <span className="title-word inline-block" style={{ "--wi": 1 } as React.CSSProperties}>
          Tarot
        </span>{" "}
        <span className="inline-block">
          <span
            className="title-word inline-block text-gold"
            style={{ "--wi": 2 } as React.CSSProperties}
          >
            Healing
          </span>{" "}
        </span>
      </h1>

      <p
        className="reveal-item font-ui text-[clamp(0.75rem,1.8vw,0.95rem)] uppercase tracking-[0.22em] text-pale opacity-80"
        style={{ "--di": 0 } as React.CSSProperties}
      >
        Nhìn xuyên màn đêm — Khám phá vận mệnh
      </p>

      <div className="reveal-item" style={{ "--di": 2 } as React.CSSProperties}>
        <MysticalButton onClick={handleBeginJourney}>Bắt Đầu Hành Trình</MysticalButton>
      </div>

      <button
        className="reveal-item btn-history"
        style={{ "--di": 3 } as React.CSSProperties}
        title="Lịch Sử Trải Bài"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        Thông Điệp Quá Khứ
      </button>

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

      <JourneyFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
