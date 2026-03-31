"use client";

interface SigilProps {
  size?: number;
}

/**
 * Sigil — Biểu tượng ấn chú huyền bí xoay liên tục.
 * Vòng tròn đồng tâm + ngôi sao 5 cánh + chấm trung tâm.
 * Có lớp glow phát sáng nhịp thở phía sau.
 */
export default function Sigil({ size = 200 }: SigilProps) {
  return (
    <div
      className="relative flex items-center justify-center mb-1.5"
      style={{ width: size, height: size }}
    >
      <svg className="sigil-svg w-full h-full" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(123,94,167,0.35)" strokeWidth="0.6" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(216,186,145,0.25)" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="50" fill="none" stroke="rgba(123,94,167,0.45)" strokeWidth="0.6" />
        <polygon
          points="100,20 118,80 180,80 130,115 150,175 100,140 50,175 70,115 20,80 82,80"
          fill="none"
          stroke="rgba(216,186,145,0.2)"
          strokeWidth="0.5"
        />
        <circle cx="100" cy="100" r="6" fill="rgba(76,51,152,0.7)" />
      </svg>
      <div className="sigil-glow" />
    </div>
  );
}
