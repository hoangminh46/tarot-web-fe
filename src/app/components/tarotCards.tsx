"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './tarotCards.css';

export default function TarotCards() {
  const cardsRef = useRef<HTMLUListElement>(null);
  
  useEffect(() => {
    if (!cardsRef.current) return;
    
    const cards = cardsRef.current.querySelectorAll(".card");
    const cardsMidIndex = Math.floor(cards.length / 2);
    const xOffset = 60;
    const scaleOffset = 0.02;
    const duration = 0.8;
    const scaleDuration = duration / 3;
    const tl = gsap.timeline({ repeat: -1, yoyoEase: true });

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

    function shuffleDeck() {
      tl.add(driftIn())
        .add(shuffleCards(), "<")
        .add(scaleCards(), "<")
        .add(driftOut(), "<55%");
    }

    shuffleDeck();

    // Cleanup function
    return () => {
      tl.kill();
    };
  }, []);

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
    </div>
  );
}
