"use client";

import { useEffect, useRef } from "react";

type StarLayer = "far" | "mid" | "near";

interface StarSpec {
  id: string;
  layer: StarLayer;
  top: number;
  left: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  color: string;
  glow: string;
  hero: boolean;
}

const LAYER_COUNTS: Record<StarLayer, number> = {
  far: 110,
  mid: 72,
  near: 30,
};

function createStarField(): StarSpec[] {
  const stars: StarSpec[] = [];
  const layers: StarLayer[] = ["far", "mid", "near"];

  layers.forEach((layer) => {
    for (let i = 0; i < LAYER_COUNTS[layer]; i++) {
      const centerBias = Math.random() < (layer === "near" ? 0.55 : 0.42);
      const u = Math.random();
      const v = Math.random();

      const top = centerBias ? 18 + Math.random() * 56 : Math.random() * 100;
      const left = centerBias ? 50 + (u + v - 1) * 34 : Math.random() * 100;

      const heroChance = layer === "near" ? 0.24 : layer === "mid" ? 0.12 : 0.05;
      const hero = Math.random() < heroChance;

      let baseSize = layer === "far" ? 1.05 : layer === "mid" ? 1.65 : 2.3;
      baseSize += Math.random() * (layer === "near" ? 1.2 : 0.8);
      if (hero) baseSize += layer === "near" ? 1.4 : 0.8;

      const tintRoll = Math.random();
      let color = "rgba(255,255,255,0.92)";
      let glow = "rgba(255,255,255,0.35)";

      if (tintRoll < 0.16) {
        color = "rgba(216,186,145,0.95)";
        glow = "rgba(216,186,145,0.4)";
      } else if (tintRoll < 0.42) {
        color = "rgba(196,177,249,0.92)";
        glow = "rgba(123,94,167,0.42)";
      }

      stars.push({
        id: `${layer}-${i}`,
        layer,
        top,
        left,
        size: baseSize,
        opacity: layer === "far" ? 0.28 + Math.random() * 0.24 : layer === "mid" ? 0.42 + Math.random() * 0.24 : 0.55 + Math.random() * 0.26,
        duration: (layer === "far" ? 5.8 : layer === "mid" ? 4.6 : 3.8) + Math.random() * 3.4,
        delay: Math.random() * 6,
        color,
        glow,
        hero,
      });
    }
  });

  return stars;
}

export default function DynamicStars() {
  const rootRef = useRef<HTMLDivElement>(null);
  const farLayerRef = useRef<HTMLDivElement>(null);
  const midLayerRef = useRef<HTMLDivElement>(null);
  const nearLayerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<StarSpec[] | null>(null);

  if (!starsRef.current) {
    starsRef.current = createStarField();
  }

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const root = rootRef.current;
    const far = farLayerRef.current;
    const mid = midLayerRef.current;
    const near = nearLayerRef.current;

    if (!root || !far || !mid || !near) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frameId = 0;

    const updateLayers = () => {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;

      far.style.transform = `translate3d(${current.x * 0.18}px, ${current.y * 0.18}px, 0)`;
      mid.style.transform = `translate3d(${current.x * 0.42}px, ${current.y * 0.42}px, 0)`;
      near.style.transform = `translate3d(${current.x * 0.78}px, ${current.y * 0.78}px, 0)`;

      frameId = window.requestAnimationFrame(updateLayers);
    };

    const onMouseMove = (event: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;

      target.x = ((event.clientX - halfW) / halfW) * -10;
      target.y = ((event.clientY - halfH) / halfH) * -8;
    };

    window.addEventListener("mousemove", onMouseMove);
    frameId = window.requestAnimationFrame(updateLayers);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  const stars = starsRef.current;
  const farStars = stars.filter((star) => star.layer === "far");
  const midStars = stars.filter((star) => star.layer === "mid");
  const nearStars = stars.filter((star) => star.layer === "near");

  const renderStar = (star: StarSpec) => {
    const style: React.CSSProperties = {
      position: "absolute",
      top: `${star.top}%`,
      left: `${star.left}%`,
      width: `${star.size}px`,
      height: `${star.size}px`,
      opacity: star.opacity,
      animation: `starBlink ${star.duration}s ease-in-out ${star.delay}s infinite alternate`,
      transform: "translate(-50%, -50%)",
    };

    if (!star.hero) {
      style.borderRadius = "999px";
      style.background = star.color;
      style.boxShadow = `0 0 ${star.size * 4}px ${star.glow}`;
    }

    return (
      <div key={star.id} style={style} aria-hidden="true">
        {star.hero ? (
          <>
            <span
              style={{
                position: "absolute",
                inset: "50% auto auto 50%",
                width: `${star.size * 3.4}px`,
                height: "1px",
                transform: "translate(-50%, -50%)",
                background: `linear-gradient(90deg, transparent, ${star.color}, transparent)`,
                opacity: 0.9,
                boxShadow: `0 0 ${star.size * 4}px ${star.glow}`,
              }}
            />
            <span
              style={{
                position: "absolute",
                inset: "50% auto auto 50%",
                width: "1px",
                height: `${star.size * 3.4}px`,
                transform: "translate(-50%, -50%)",
                background: `linear-gradient(180deg, transparent, ${star.color}, transparent)`,
                opacity: 0.9,
                boxShadow: `0 0 ${star.size * 4}px ${star.glow}`,
              }}
            />
            <span
              style={{
                position: "absolute",
                inset: "50% auto auto 50%",
                width: `${star.size * 1.2}px`,
                height: `${star.size * 1.2}px`,
                transform: "translate(-50%, -50%)",
                borderRadius: "999px",
                background: star.color,
                boxShadow: `0 0 ${star.size * 5}px ${star.glow}`,
              }}
            />
          </>
        ) : null}
      </div>
    );
  };

  return (
    <div ref={rootRef} className="pointer-events-none fixed inset-0 z-[2] overflow-hidden" aria-hidden="true">
      <div
        ref={farLayerRef}
        className="absolute inset-0 transition-transform duration-500 ease-out"
        style={{ filter: "blur(0.2px)" }}
      >
        {farStars.map(renderStar)}
      </div>
      <div
        ref={midLayerRef}
        className="absolute inset-0 transition-transform duration-500 ease-out"
      >
        {midStars.map(renderStar)}
      </div>
      <div
        ref={nearLayerRef}
        className="absolute inset-0 transition-transform duration-500 ease-out"
      >
        {nearStars.map(renderStar)}
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 42% 28% at 50% 38%, rgba(11,5,21,0.02) 0%, rgba(11,5,21,0.08) 60%, rgba(11,5,21,0.18) 100%)",
        }}
      />
    </div>
  );
}
