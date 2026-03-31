"use client";

import DynamicStars from "./DynamicStars";
import MagicCursor from "./MagicCursor";

/**
 * BackgroundLayers — Atmospheric background dùng chung cho mọi page.
 * Gồm: Nebula gradient, Star field (CSS + JS), Vignette + Fog, Noise texture, Background Sigil.
 * Tất cả đều pointer-events: none, nằm dưới content.
 */
export default function BackgroundLayers() {
  return (
    <>
      {/* Nebula: radial gradient 15-stop hướng tâm kiểu Tarotoo */}
      <div className="bg-nebula" />

      {/* Star field CSS: các chấm sáng tĩnh làm nền */}
      <div className="bg-stars" />

      {/* Star field JS: 60 particles nhấp nháy sắc nét */}
      <DynamicStars />

      {/* Vignette: tối góc ảnh + sương mù (fog) phía dưới qua ::after */}
      <div className="bg-vignette" />

      {/* Noise texture: lớp film grain tạo chiều sâu vũ trụ */}
      <div className="bg-noise" />

      {/* Hiệu ứng Chuột "Ma thuật" (Tail, Glow, 3D Hover Scale) */}
      <MagicCursor />

      {/* Background Sigil: vòng tròn đồng tâm xoay ngược rất chậm (80s) */}
      <div className="fixed inset-0 z-[2] flex items-center justify-center pointer-events-none">
        <svg
          className="bg-sigil-svg w-[min(90vw,90vh)] h-[min(90vw,90vh)]"
          viewBox="0 0 400 400"
        >
          <circle cx="200" cy="200" r="188" fill="none" stroke="rgba(123,94,167,0.06)" strokeWidth="0.8" />
          <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(216,186,145,0.05)" strokeWidth="0.6" />
          <circle cx="200" cy="200" r="112" fill="none" stroke="rgba(123,94,167,0.07)" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="70" fill="none" stroke="rgba(216,186,145,0.04)" strokeWidth="0.4" />
        </svg>
      </div>
    </>
  );
}
