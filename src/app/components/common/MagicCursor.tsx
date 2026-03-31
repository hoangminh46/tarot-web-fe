"use client";

import { useEffect, useRef } from "react";

class Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  color: string;
  isStar: boolean;

  constructor(x: number, y: number) {
    this.x = x + (Math.random() - 0.5) * 8; // Random offset quanh chuột
    this.y = y + (Math.random() - 0.5) * 8;
    this.size = Math.random() * 2.5 + 1.5; // Kích thước hạt 1.5 - 4px
    
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 0.8 + 0.2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 0.4; // Thiên hướng bay mỏng nhẹ lên trên (anti-gravity)
    
    this.life = 1;
    this.decay = 0.015 + Math.random() * 0.02; // Tốc độ tan biến
    
    // Đủ các hình thái: ~40% là hình ngôi sao 4 cánh, còn lại là hạt tròn phát sáng
    this.isStar = Math.random() < 0.4;

    const rnd = Math.random();
    if (rnd < 0.25) this.color = "216, 186, 145"; // Gold (Tarotoo)
    else if (rnd < 0.5) this.color = "182, 157, 240"; // Light Purple/Pink
    else if (rnd < 0.7) this.color = "123, 94, 167"; // Deep Violet
    else this.color = "255, 255, 255"; // Pure White
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.life <= 0) return;
    const currentSize = this.size * this.life;
    const alpha = this.life;

    ctx.fillStyle = `rgba(${this.color}, ${alpha})`;

    if (this.isStar) {
      // Vẽ Diamond/Ngôi sao 4 cánh
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - currentSize); // Top
      ctx.quadraticCurveTo(this.x, this.y, this.x + currentSize, this.y); // Right
      ctx.quadraticCurveTo(this.x, this.y, this.x, this.y + currentSize); // Bottom
      ctx.quadraticCurveTo(this.x, this.y, this.x - currentSize, this.y); // Left
      ctx.quadraticCurveTo(this.x, this.y, this.x, this.y - currentSize); // Top
      ctx.fill();
    } else {
      // Vẽ hạt tròn phát sáng
      ctx.beginPath();
      ctx.arc(this.x, this.y, currentSize * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export default function MagicCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mouse = useRef({ x: -100, y: -100 });
  const lastMouse = useRef({ x: -100, y: -100 });
  const aura = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      if (cursorRef.current) cursorRef.current.style.display = "none";
      if (auraRef.current) auraRef.current.style.display = "none";
      if (canvasRef.current) canvasRef.current.style.display = "none";
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Thiết lập kích thước canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const onMouseMove = (e: MouseEvent) => {
      lastMouse.current.x = mouse.current.x;
      lastMouse.current.y = mouse.current.y;
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Nội suy khoảng cách để vẽ tia (trail) mượt mà kể cả khi vẩy chuột siêu nhanh
      if (lastMouse.current.x !== -100) {
        const dx = mouse.current.x - lastMouse.current.x;
        const dy = mouse.current.y - lastMouse.current.y;
        const distance = Math.hypot(dx, dy);
        
        // Vẩy càng xa càng đẻ nhiều bụi ma thuật (giới hạn tránh tụt FPS)
        const steps = Math.min(Math.floor(distance / 5), 15);
        for (let i = 0; i < steps; i++) {
          const px = lastMouse.current.x + dx * (i / steps);
          const py = lastMouse.current.y + dy * (i / steps);
          particles.current.push(new Particle(px, py));
        }
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const isClickable = 
        target.closest('a') !== null || 
        target.closest('button') !== null || 
        target.closest('.cursor-pointer') !== null ||
        window.getComputedStyle(target).cursor === 'pointer';
        
      isHovering.current = isClickable;
      
      // Spawn burst khi hover vào một nút
      if (isClickable) {
        for(let i=0; i<8; i++) {
          particles.current.push(new Particle(mouse.current.x, mouse.current.y));
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);

    let animationFrameId: number;
    let currentScale = 1;

    const render = () => {
      // 1. Aura đuổi theo (Lerp)
      aura.current.x += (mouse.current.x - aura.current.x) * 0.15;
      aura.current.y += (mouse.current.y - aura.current.y) * 0.15;

      const targetScale = isHovering.current ? 1.8 : 1;
      currentScale += (targetScale - currentScale) * 0.15;

      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${aura.current.x}px, ${aura.current.y}px, 0) scale(${currentScale})`;
        
        if (isHovering.current) {
          auraRef.current.style.background = 'radial-gradient(circle, rgba(216, 186, 145, 0.25) 0%, rgba(182, 157, 240, 0.08) 40%, transparent 70%)';
        } else {
          auraRef.current.style.background = 'radial-gradient(circle, rgba(182, 157, 240, 0.15) 0%, rgba(76, 51, 152, 0.05) 40%, transparent 70%)';
        }
      }
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) scale(${isHovering.current ? 1.5 : 1})`;
      }

      // 2. Render Canvas Fairy Dust
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update filter cho glow mượt (Khá tốn hiệu năng, nếu FPS drop có thể bỏ)
      ctx.globalCompositeOperation = "screen";

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.update();
        p.draw(ctx);
        if (p.life <= 0) {
          particles.current.splice(i, 1);
        }
      }

      // Thỉnh thoảng rụng vài "bụi" ngay cả khi đứng im
      if (Math.random() < 0.1 && mouse.current.x !== -100 && !isHovering.current) {
        particles.current.push(new Particle(mouse.current.x, mouse.current.y));
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Canvas cho Fairy Dust/Particles */}
      <canvas 
        ref={canvasRef}
        className="fixed inset-0 z-[9997] pointer-events-none"
      />

      {/* Lõi sáng (Dot) */}
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-[3px] h-[3px] -mt-[1px] -ml-[1px] bg-[#ffffff] rounded-full mix-blend-screen pointer-events-none z-[9999] shadow-[0_0_12px_3px_rgba(216,186,145,0.9)] will-change-transform"
      />
      
      {/* Vệt sáng đuổi theo (Aura) */}
      <div 
        ref={auraRef} 
        className="fixed top-0 left-0 w-32 h-32 -mt-16 -ml-16 rounded-full mix-blend-screen pointer-events-none z-[9998] will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(182, 157, 240, 0.15) 0%, rgba(76, 51, 152, 0.05) 40%, transparent 70%)',
          filter: 'blur(4px)'
        }}
      />
    </>
  );
}
