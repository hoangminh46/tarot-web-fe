"use client";

import { useEffect, useRef } from "react";

const STAR_COUNT = 150;

/**
 * DynamicStars — Rải sao ngẫu nhiên bằng JS (Tarotoo technique).
 * Tăng cường độ to, rõ nét và tập trung ở trung tâm màn hình.
 */
export default function DynamicStars() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < STAR_COUNT; i++) {
      const star = document.createElement("div");
      
      // Kích thước to hơn: từ 1px đến 3.5px
      let size = 1.5;
      const sizeRand = Math.random();
      if (sizeRand > 0.95) size = 3.5;
      else if (sizeRand > 0.8) size = 2.5;
      else if (sizeRand > 0.4) size = 2;

      // Phân bổ tập trung vào giữa (65% số sao nằm ở vùng trung tâm)
      const isCenter = Math.random() < 0.65;
      
      let top, left;
      if (isCenter) {
        // Vùng trung tâm (giữa dọc và nửa trên/giữa ngang)
        top = 20 + Math.random() * 50; // Tập trung 20% -> 70% chiều dọc
        
        // Distribution cong hình chuông nhẹ cho chiều ngang
        const u = Math.random();
        const v = Math.random();
        left = 50 + (u + v - 1) * 35; // Tập trung mạnh quanh 50%, phủ rộng 15%-85%
      } else {
        // Vùng rìa
        top = Math.random() * 100;
        left = Math.random() * 100;
      }

      const delay = Math.random() * 5;
      const duration = 2.5 + Math.random() * 3;

      // ~15% sao có sắc vàng nhạt, còn lại trắng/tím nhạt
      const isGold = Math.random() < 0.15;
      const isPurple = !isGold && Math.random() < 0.35;

      let color: string;
      let shadow: string;
      if (isGold) {
        color = `rgba(216, 186, 145, ${0.7 + Math.random() * 0.3})`;
        shadow = `0 0 ${size * 3 + 2}px ${size * 1.5}px rgba(216, 186, 145, 0.6)`;
      } else if (isPurple) {
        color = `rgba(182, 157, 240, ${0.7 + Math.random() * 0.3})`;
        shadow = `0 0 ${size * 3 + 2}px ${size * 1.5}px rgba(123, 94, 167, 0.6)`;
      } else {
        color = `rgba(255, 255, 255, ${0.6 + Math.random() * 0.4})`;
        shadow = `0 0 ${size * 2 + 2}px ${size}px rgba(255, 255, 255, 0.55)`;
      }

      star.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        top: ${top}%;
        left: ${left}%;
        background: ${color};
        border-radius: 50%;
        box-shadow: ${shadow};
        animation: starBlink ${duration}s ease-in-out ${delay}s infinite alternate;
        pointer-events: none;
      `;

      fragment.appendChild(star);
    }

    container.appendChild(fragment);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[2] pointer-events-none"
      aria-hidden="true"
    />
  );
}
