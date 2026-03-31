"use client";

import Image from "next/image";
import BackgroundLayers from "@/app/components/common/BackgroundLayers";
import LandingHero from "./LandingHero";
import "./landing.css";

/**
 * LandingPage — Composition tổng thể trang chủ.
 * Gồm: BackgroundLayers + LandingHero + Daily Draw Widget + Floating Buttons.
 */
export default function LandingPage() {
  return (
    <div className="fixed inset-0 z-10 flex flex-col items-center justify-center overflow-y-auto overflow-x-hidden">
      {/* Background layers: nebula, vignette, fog, bg-sigil */}
      <BackgroundLayers />

      {/* Hero content */}
      <LandingHero />

      {/* ── Floating buttons góc dưới ── */}

      {/* Thống kê chủ đề — bottom right */}
      <button
        className="btn-float-icon"
        style={{ bottom: 20, right: 20 }}
        title="Thống kê chủ đề"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      </button>

      {/* Daily Draw Widget — floating card ảnh nhỏ */}
      <button
        className="btn-float-action"
        aria-label="Lá Bài Trong Ngày"
        title="Lá Bài Trong Ngày"
      >
        <div className="daily-draw__ring-mini" />
        <Image
          src="/svgTarot/card.svg"
          alt="Daily"
          width={36}
          height={36}
          className="rounded object-cover"
        />
      </button>
    </div>
  );
}
