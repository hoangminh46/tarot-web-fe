"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

import { TarotCard } from '@/json/tarot';

interface MysteryCardsProps {
  selectedCardDetails: TarotCard[];
}

const CARD_TITLES = [
  "Hiện tại",
  "Thách thức", 
  "Lời khuyên", 
  "Điều cần thức tỉnh", 
  "Kết quả tiềm năng"
];

function MysteryCard({ title, cardInfo }: { title: string, cardInfo?: TarotCard }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (cardInfo && cardRef.current) {
      const el = cardRef.current;
      gsap.to(el, {
        boxShadow: '0 0 15px 5px rgba(255, 215, 0, 0.7)',
        duration: 0.3
      });
      
      const tl = gsap.timeline();
      tl.to(el, { duration: 0.2, ease: "power2.out" })
        .to(el, {
          rotationY: 180,
          duration: 0.4,
          ease: "power4.inOut",
          onComplete: () => {
            setIsFlipped(true);
            if (nameRef.current) {
              gsap.to(nameRef.current, { opacity: 1, duration: 0.5, ease: "power2.out" });
            }
          }
        });
    } else {
      setIsFlipped(false);
      if (cardRef.current) {
        gsap.set(cardRef.current, { rotationY: 0, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' });
      }
      if (nameRef.current) {
        gsap.set(nameRef.current, { opacity: 0 });
      }
    }
  }, [cardInfo]);

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div 
        ref={cardRef}
        className={`relative w-[143px] h-[253px] overflow-visible rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)] [perspective:1000px] [transform-style:preserve-3d] transition-all duration-300 ease ${isFlipped ? '[transform:rotateY(180deg)] group hover:shadow-[0_12px_20px_rgba(0,0,0,0.3)]' : ''}`}
        style={isFlipped ? { transform: 'rotateY(180deg)' } : {}}
      >
        <div className="absolute w-full h-full bg-white [backface-visibility:hidden] rounded-lg overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.2)] transition-shadow duration-300 z-[2] [transform:rotateY(0deg)]">
          <img src="/svgTarot/ques-card.svg" alt="Lá bài bí ẩn" className="w-full h-full object-contain" />
        </div>
        <div className="absolute w-full h-full bg-white [backface-visibility:hidden] rounded-lg overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.2)] transition-shadow duration-300 z-[1] [transform:rotateY(180deg)]">
          {cardInfo && <img src={cardInfo.img} alt={cardInfo.name} className="w-full h-full object-contain" />}
        </div>
      </div>
      <div className="text-sm font-bold text-center text-[#333] bg-[#f5eee6] px-2.5 py-1 rounded shadow-sm">{title}</div>
      {cardInfo && (
        <div 
          ref={nameRef}
          className="text-sm font-semibold text-center text-[#333] max-w-[143px] px-2.5 py-1.5 mt-2.5 rounded shadow-[0_3px_6px_rgba(0,0,0,0.1)] whitespace-nowrap overflow-hidden text-ellipsis relative bg-gradient-to-r from-[#f5eee6] via-[#f0e6d2] to-[#f5eee6]" 
          style={{ opacity: 0 }}
        >
          {cardInfo.name}
        </div>
      )}
    </div>
  );
}

export default function MysteryCards({ selectedCardDetails }: MysteryCardsProps) {
  return (
    <div className="flex justify-center gap-[30px] w-full flex-wrap mt-[50px]">
      {CARD_TITLES.map((title, index) => (
        <MysteryCard 
          key={index} 
          title={title} 
          cardInfo={selectedCardDetails[index]} 
        />
      ))}
    </div>
  );
}
