"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './tarotCards.css';
import tarot from '@/json/tarot';

export default function TarotCards() {
  const cardsRef = useRef<HTMLUListElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const shuffleTlRef = useRef<gsap.core.Timeline | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isSpreadComplete, setIsSpreadComplete] = useState(false);
  const [hasShuffled, setHasShuffled] = useState(false);
  
  useEffect(() => {
    if (!cardsRef.current) return;
    
    const cards = cardsRef.current.querySelectorAll(".card");
    const xOffset = 600;
    const duration = 0.8;
    
    // Thiết lập trạng thái ban đầu - Các lá bài trải ra
    function setupInitialSpread() {
      gsap.to(cards, {
        x: (i) => {
          // Tính toán vị trí từ trái qua phải để các lá bài trải rộng hơn
          return i * 12; // Giảm khoảng cách giữa các lá bài
        },
        y: (i) => {
          // Tính toán vị trí từ trên xuống dưới với độ cong
          const angle = -20 + (i * 40 / (cards.length - 1));
          const yPos = Math.sin((angle + 90) * Math.PI / 180) * 6; // Giảm độ cong
          return yPos;
        },
        rotation: (i) => {
          // Tính toán góc xoay
          return -20 + (i * 40 / (cards.length - 1));
        },
        xPercent: 25,
        yPercent: 0,
        scale: 1,
        zIndex: (i) => i,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          // Thêm class cho mỗi lá bài
          cards.forEach(card => {
            card.classList.add('spread');
          });
          setIsSpreadComplete(true);
        }
      });
    }
    
    // Animation thu các lá bài vào trước khi xáo
    function collectCards() {
      return gsap.timeline()
      .to(cards, {
        x: 0,
        y: 0,
        rotation: 0,
        xPercent: 25,
        yPercent: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.02,
        ease: "power2.inOut",
        onStart: () => {
          cards.forEach(card => {
            card.classList.remove('spread');
          });
          setIsSpreadComplete(false);
        }
      });
    }

    function shuffleCards() {
      return gsap
        .timeline()
        .to(cards, {
          x: 0,
          y: 0,
          rotation: 0,
          xPercent: 25,
          yPercent: 0,
          duration: 0.1,
          ease: "power2.out",
        })
        .fromTo(
          cards,
          {
            x: 0,
            rotation: 0,
            xPercent: 25,
            yPercent: 0
          },
          {
            duration: duration,
            rotation: 0,
            xPercent: 25 + xOffset,
            yPercent: -10,
            stagger: duration * 0.04,
            ease: "expo.inOut",
            yoyoEase: true
          }
        );
    }

    // Tạo animation xáo bài (animation gốc)
    function createShuffleDeck() {
      const tl = gsap.timeline({ 
        repeat: 1,
        yoyoEase: true
      });
      
      tl.add(shuffleCards())
        
      // Lưu timeline cho animation xáo bài
      shuffleTlRef.current = tl;
      
      return tl;
    }

    // Tạo timeline chính điều khiển toàn bộ luồng
    function createMainTimeline() {
      const mainTl = gsap.timeline({
        paused: true,
        onComplete: () => {
          setIsShuffling(false);
          setHasShuffled(true);
          setupInitialSpread(); // Trở lại trạng thái trải bài sau khi hoàn thành
        }
      });
      
      // Luồng animation: thu bài -> xáo bài (3 lần) -> kết thúc
      mainTl
        .add(collectCards()) // Thu bài 1 lần
        .add(createShuffleDeck()); // Thêm timeline xáo bài
        
      // Lưu timeline chính
      tlRef.current = mainTl;
    }

    // Thiết lập trạng thái ban đầu và animation
    setupInitialSpread();
    createMainTimeline();

    // Cleanup function
    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
      }
      if (shuffleTlRef.current) {
        shuffleTlRef.current.kill();
      }
    };
  }, []);
  
  useEffect(() => {
    if (!cardsRef.current || !hasShuffled || !isSpreadComplete) return;
    
    const cards = cardsRef.current.querySelectorAll(".card");
    const initialPositions = Array.from(cards).map(card => {
      const transform = window.getComputedStyle(card).transform;
      const matrix = new DOMMatrix(transform);
      return matrix.f; // Lấy giá trị y từ ma trận transform
    });
    
    cards.forEach((card, index) => {
      const initialY = initialPositions[index];
      
      card.addEventListener("mouseenter", () => {
        gsap.to(card, { y: "-=12", duration: 0.1 }); // Giảm từ 15px xuống 12px
      });
      
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { y: initialY, duration: 0.1 });
      });
    });
    
    return () => {
      cards.forEach(card => {
        card.removeEventListener("mouseenter", () => {});
        card.removeEventListener("mouseleave", () => {});
      });
    };
  }, [hasShuffled, isSpreadComplete]);
  
  const handleShuffle = () => {
    if (tlRef.current && !isShuffling) {
      setIsShuffling(true);
      tlRef.current.restart();
    }
  };

  return (
    <div className="tarot-container">
      <ul className={`cards ${isSpreadComplete ? 'spread-complete' : ''} ${hasShuffled ? 'has-shuffled' : ''}`} ref={cardsRef}>
        {tarot.cards.map((card) => (
          <li key={card.name} id={card.name} className="card"></li>
        ))}
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
