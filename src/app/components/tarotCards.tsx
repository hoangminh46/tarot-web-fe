"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './tarotCards.css';

export default function TarotCards() {
  const cardsRef = useRef<HTMLUListElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const shuffleTlRef = useRef<gsap.core.Timeline | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  
  useEffect(() => {
    if (!cardsRef.current) return;
    
    const cards = cardsRef.current.querySelectorAll(".card");
    const cardsMidIndex = Math.floor(cards.length / 2);
    const xOffset = 60;
    const scaleOffset = 0.02;
    const duration = 0.8;
    const scaleDuration = duration / 3;
    
    // Thiết lập trạng thái ban đầu - Các lá bài trải ra
    function setupInitialSpread() {
      gsap.set(cards, {
        x: (i) => {
          // Tính toán vị trí từ trái qua phải
          const xPos = i * 10;
          return xPos;
        },
        y: (i) => {
          // Tính toán vị trí từ trên xuống dưới với độ cong
          const angle = -20 + (i * 40 / (cards.length - 1));
          const yPos = Math.sin((angle + 90) * Math.PI / 180) * 5;
          return yPos;
        },
        rotation: (i) => {
          // Tính toán góc xoay
          return -20 + (i * 40 / (cards.length - 1));
        },
        scale: 1,
        zIndex: (i) => i
      });
      
      // Thêm class cho mỗi lá bài
      cards.forEach(card => {
        card.classList.add('spread');
      });
    }
    
    // Animation thu các lá bài vào trước khi xáo
    function collectCards() {
      return gsap.timeline()
        .to(cards, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.02,
          ease: "power2.inOut",
          onStart: () => {
            cards.forEach(card => {
              card.classList.remove('spread');
            });
          }
        });
    }
    
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

    // Tạo animation xáo bài (animation gốc)
    function createShuffleDeck() {
      const tl = gsap.timeline({ 
        repeat: 3, 
        yoyoEase: true
      });
      
      tl.add(driftIn())
        .add(shuffleCards(), "<")
        .add(scaleCards(), "<")
        .add(driftOut(), "<55%");
        
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
          setupInitialSpread(); // Trở lại trạng thái trải bài sau khi hoàn thành
        }
      });
      
      // Luồng animation: thu bài -> xáo bài (3 lần) -> kết thúc
      mainTl
        .add(collectCards()) // Thu bài 1 lần
        .add(createShuffleDeck()); // Thêm timeline xáo bài (lặp lại 3 lần)
        
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
