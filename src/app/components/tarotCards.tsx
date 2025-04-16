"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './tarotCards.css';

export default function TarotCards() {
  const cardsRef = useRef<HTMLUListElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  
  useEffect(() => {
    if (!cardsRef.current) return;
    
    const cards = cardsRef.current.querySelectorAll(".card");
    const cardsMidIndex = Math.floor(cards.length / 2);
    const xOffset = 60;
    const scaleOffset = 0.02;
    const duration = 0.8;
    const scaleDuration = duration / 3;
    
    function driftIn() {
      return gsap.timeline().from(".cards", {
        xPercent: -xOffset / 3,
        duration,
        ease: "power2.inOut",
        yoyoEase: true
      });
    }

    function driftOut() {
      return gsap.timeline().to(".cards", {
        xPercent: xOffset / 3,
        duration,
        ease: "power2.inOut",
        yoyoEase: true
      });
    }

    function scaleCards() {
      return gsap
        .timeline()
        .to(".card", {
          scale: (i) => {
            if (i <= cardsMidIndex) {
              return 1 - i * scaleOffset;
            } else {
              return 1 - (cards.length - 1 - i) * scaleOffset;
            }
          },
          delay: duration / 3,
          duration: scaleDuration,
          ease: "expo.inOut",
          yoyoEase: true
        })
        .to(".card", { scale: 1, duration: scaleDuration });
    }

    function shuffleCards() {
      return gsap
        .timeline()
        .set(".card", {
          x: (i) => -i * 0.5,
          rotate: 0
        })
        .fromTo(
          ".card",
          {
            rotate: 0,
            xPercent: -xOffset
          },
          {
            duration,
            rotate: 0,
            xPercent: xOffset,
            stagger: duration * 0.03,
            ease: "expo.inOut",
            yoyoEase: true
          }
        );
    }

    // Chỉ tạo timeline, không tự động chạy
    function createShuffleDeck() {
      const tl = gsap.timeline({ 
        repeat: 3, 
        yoyoEase: true,
        onComplete: () => setIsShuffling(false)
      });
      
      tl.add(driftIn())
        .add(shuffleCards(), "<")
        .add(scaleCards(), "<")
        .add(driftOut(), "<55%");
        
      // Lưu timeline để sử dụng sau
      tlRef.current = tl;
      
      // Tạm dừng timeline (sẽ được kích hoạt bởi button)
      tl.pause();
    }

    createShuffleDeck();

    // Cleanup function
    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
      }
    };
  }, []);
  
  const handleShuffle = () => {
    if (tlRef.current && !isShuffling) {
      setIsShuffling(true);
      tlRef.current.restart();
    }
  };

  return (
    <div className="tarot-container">
      <ul className="cards" ref={cardsRef}>
        <li className="card"></li>
        <li className="card"></li>
        <li className="card"></li>
        <li className="card"></li>
        <li className="card"></li>
        <li className="card"></li>
        <li className="card"></li>
        <li className="card"></li>
        <li className="card"></li>
        <li className="card"></li>
        <li className="card"></li>
        <li className="card"></li>
      </ul>
      <button 
        onClick={handleShuffle}
        disabled={isShuffling}
        className="shuffle-button"
      >
        Xáo bài
      </button>
    </div>
  );
}
