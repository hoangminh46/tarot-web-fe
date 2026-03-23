"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import tarot, { TarotCard } from '@/json/tarot';

import TarotDeck from './TarotDeck';
import TarotControls from './TarotControls';
import MysteryCards from './MysteryCards';

// Hàm xáo trộn bài mạnh hơn (Fisher-Yates shuffle)
const shuffleArray = (array: TarotCard[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function TarotBoard() {
  const cardsRef = useRef<HTMLUListElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const shuffleTlRef = useRef<gsap.core.Timeline | null>(null);
  
  const [isShuffling, setIsShuffling] = useState(false);
  const [isSpreadComplete, setIsSpreadComplete] = useState(false);
  const [hasShuffled, setHasShuffled] = useState(false);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [canSelectCards, setCanSelectCards] = useState(false);
  
  // Lưu thông tin chi tiết của lá bài đã chọn
  const [selectedCardDetails, setSelectedCardDetails] = useState<TarotCard[]>([]);
  
  // Xóa lỗi hydration bằng cách gán ban đầu và xáo trộn bên client
  const [shuffledCards, setShuffledCards] = useState<TarotCard[]>(tarot.cards);
  
  useEffect(() => {
    setShuffledCards(shuffleArray(tarot.cards));
  }, []);
  
  useEffect(() => {
    if (!cardsRef.current) return;
    
    // Tìm qua thẻ <li>, TarotDeck.tsx render thẻ <li> với list con
    const cards = cardsRef.current.querySelectorAll("li");
    const xOffset = 600;
    const duration = 0.8;
    
    // Thiết lập trạng thái ban đầu - Các lá bài trải ra
    function setupInitialSpread() {
      gsap.to(cards, {
        x: (i) => i * 14,
        y: 0,
        rotation: 0,
        xPercent: 0,
        yPercent: 0,
        scale: 1,
        zIndex: (i) => i,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          cards.forEach(card => card.classList.add('spread'));
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
        xPercent: 0,
        yPercent: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.02,
        ease: "power2.inOut",
        onStart: () => {
          cards.forEach(card => card.classList.remove('spread'));
          setIsSpreadComplete(false);
        }
      });
    }

    function shuffleCards() {
      return gsap
        .timeline()
        .to(cards, {
          x: 0, y: 0, rotation: 0, xPercent: 0, yPercent: 0,
          duration: 0.1, ease: "power2.out",
        })
        .fromTo(cards,
          { x: 0, rotation: 0, xPercent: 0, yPercent: 0 },
          {
            duration: duration,
            rotation: 0,
            xPercent: 0 + xOffset,
            yPercent: -10,
            stagger: duration * 0.04,
            ease: "expo.inOut",
            yoyoEase: true
          }
        );
    }

    function createShuffleDeck() {
      const tl = gsap.timeline({ repeat: 1, yoyoEase: true });
      tl.add(shuffleCards());
      shuffleTlRef.current = tl;
      return tl;
    }

    function createMainTimeline() {
      const mainTl = gsap.timeline({
        paused: true,
        onComplete: () => {
          setIsShuffling(false);
          setHasShuffled(true);
          setCanSelectCards(true);
          setupInitialSpread();
        }
      });
      mainTl.add(collectCards()).add(createShuffleDeck());
      tlRef.current = mainTl;
    }

    setupInitialSpread();
    createMainTimeline();

    return () => {
      tlRef.current?.kill();
      shuffleTlRef.current?.kill();
    };
  }, []);
  
  useEffect(() => {
    if (!cardsRef.current) return;
    const cards = cardsRef.current.querySelectorAll("li");
    
    const handleMouseEnter = (e: Event) => {
      if (isShuffling) return;
      const card = e.currentTarget as HTMLElement;
      if (!card.classList.contains('selected') && canSelectCards && selectedCards.length < 5) {
        gsap.to(card, { y: -12, duration: 0.1 });
      }
    };
    
    const handleMouseLeave = (e: Event) => {
      if (isShuffling) return;
      const card = e.currentTarget as HTMLElement;
      if (!card.classList.contains('selected') && canSelectCards) {
        gsap.to(card, { y: 0, duration: 0.1 });
      }
    };
    
    cards.forEach((card) => {
      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mouseleave", handleMouseLeave);
    });
    
    if (!isShuffling) {
      selectedCards.forEach(cardName => {
        const cardElement = document.getElementById(cardName);
        if (cardElement) {
          gsap.to(cardElement, { y: -20, duration: 0.1 });
        }
      });
    }
    
    return () => {
      cards.forEach(card => {
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [hasShuffled, isSpreadComplete, canSelectCards, selectedCards, isShuffling]);
  
  const handleShuffle = useCallback(() => {
    const shuffledDeck = shuffleArray(tarot.cards);
    setShuffledCards(shuffledDeck);
    
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll("li");
      gsap.to(cards, { y: 0, duration: 0.2 });
      cards.forEach(card => card.classList.remove('selected'));
    }
    
    if (tlRef.current && !isShuffling) {
      setIsShuffling(true);
      setSelectedCards([]);
      setSelectedCardDetails([]);
      setCanSelectCards(false);
      tlRef.current.restart();
    }
  }, [isShuffling]);

  const handleCardClick = useCallback((cardName: string) => {
    if (hasShuffled && isSpreadComplete && canSelectCards && !selectedCards.includes(cardName) && selectedCards.length < 5) {
      const cardInfo = shuffledCards.find(card => card.name === cardName);
      if (cardInfo) {
        setSelectedCards(prev => [...prev, cardName]);
        setSelectedCardDetails(prev => [...prev, cardInfo]);
        
        const cardElement = document.getElementById(cardName);
        if (cardElement) {
          cardElement.classList.add('selected');
          gsap.to(cardElement, { y: -20, duration: 0.3, ease: "power2.out" });
        }
      }
    }
  }, [hasShuffled, isSpreadComplete, canSelectCards, selectedCards, shuffledCards]);

  return (
    <div className="flex flex-col items-center overflow-hidden h-screen w-full select-none">
      <TarotDeck 
        cardsRef={cardsRef} 
        shuffledCards={shuffledCards} 
        selectedCards={selectedCards} 
        isSpreadComplete={isSpreadComplete} 
        hasShuffled={hasShuffled} 
        handleCardClick={handleCardClick} 
      />
      <TarotControls 
        handleShuffle={handleShuffle} 
        isShuffling={isShuffling} 
      />
      <MysteryCards selectedCardDetails={selectedCardDetails} />
    </div>
  );
}
