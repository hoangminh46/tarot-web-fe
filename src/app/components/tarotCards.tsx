"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './tarotCards.css';
import tarot from '@/json/tarot';

// Hàm xáo trộn bài mạnh hơn (Fisher-Yates shuffle)
const shuffleArray = (array: any) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function TarotCards() {
  const cardsRef = useRef<HTMLUListElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const shuffleTlRef = useRef<gsap.core.Timeline | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isSpreadComplete, setIsSpreadComplete] = useState(false);
  const [hasShuffled, setHasShuffled] = useState(false);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [canSelectCards, setCanSelectCards] = useState(false);
  
  // Sửa lỗi hydration bằng cách khởi tạo với mảng gốc
  const [shuffledCards, setShuffledCards] = useState(tarot.cards);
  
  // Sử dụng useEffect để xáo bài ở phía client
  useEffect(() => {
    setShuffledCards(shuffleArray(tarot.cards));
  }, []);
  
  useEffect(() => {
    if (!cardsRef.current) return;
    
    const cards = cardsRef.current.querySelectorAll(".card");
    const xOffset = 600;
    const duration = 0.8;
    
    // Thiết lập trạng thái ban đầu - Các lá bài trải ra
    function setupInitialSpread() {
      gsap.to(cards, {
        x: (i) => i * 12, // Khoảng cách ngang giữa các lá bài
        y: 0,
        rotation: 0, // Thẳng hàng, không nghiêng
        xPercent: 25,
        yPercent: 0,
        scale: 1,
        zIndex: (i) => i,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
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
        rotation: 0, // Giữ thẳng hàng
        xPercent: 25, // Giữ nhất quán với setupInitialSpread
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
          setCanSelectCards(true);
          
          setupInitialSpread(); // Trải bài lại với vị trí nhất quán
        }
      });
      
      mainTl
        .add(collectCards())
        .add(createShuffleDeck());
        
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
    if (!cardsRef.current) return;
    
    const cards = cardsRef.current.querySelectorAll(".card");
    
    // Định nghĩa các hàm xử lý sự kiện
    const handleMouseEnter = (e: Event) => {
      // Chỉ thực hiện khi không đang xáo bài
      if (isShuffling) return;
      
      const card = e.currentTarget as HTMLElement;
      // Chỉ hover nếu chưa được chọn và còn chọn được
      if (!card.classList.contains('selected') && canSelectCards && selectedCards.length < 5) {
        gsap.to(card, { 
          y: -12, // Đặt vị trí tuyệt đối khi hover
          duration: 0.1 
        });
      }
    };
    
    const handleMouseLeave = (e: Event) => {
      // Chỉ thực hiện khi không đang xáo bài
      if (isShuffling) return;
      
      const card = e.currentTarget as HTMLElement;
      // Chỉ đưa về vị trí ban đầu nếu chưa được chọn
      if (!card.classList.contains('selected') && canSelectCards) {
        gsap.to(card, { 
          y: 0, // Trở về vị trí mặc định
          duration: 0.1 
        });
      }
    };
    
    // Thêm event listener cho mỗi lá bài
    cards.forEach((card) => {
      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mouseleave", handleMouseLeave);
    });
    
    // Đảm bảo lá bài đã chọn luôn ở vị trí cao hơn (chỉ khi không đang xáo bài)
    if (!isShuffling) {
      selectedCards.forEach(cardName => {
        const cardElement = document.getElementById(cardName);
        if (cardElement) {
          gsap.to(cardElement, { 
            y: -20, // Giữ ở vị trí cao hơn
            duration: 0.1 
          });
        }
      });
    }
    
    // Cleanup function xóa đúng các event listener đã thêm
    return () => {
      cards.forEach(card => {
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [hasShuffled, isSpreadComplete, canSelectCards, selectedCards, isShuffling]);
  
  const handleShuffle = () => {
    const shuffledDeck = shuffleArray(tarot.cards);
    setShuffledCards(shuffledDeck);
    
    // Reset tất cả các lá bài về vị trí ban đầu trước khi xáo
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll(".card");
      // Reset vị trí y về 0 và xóa class selected
      gsap.to(cards, {
        y: 0,
        duration: 0.2
      });
      
      cards.forEach(card => {
        card.classList.remove('selected');
      });
    }
    
    if (tlRef.current && !isShuffling) {
      setIsShuffling(true);
      setSelectedCards([]);
      setCanSelectCards(false);
      tlRef.current.restart();
    }
  };

  const handleCardClick = (cardName: string) => {
    // Chỉ cho phép chọn khi đã xáo xong và có thể chọn bài
    if (hasShuffled && isSpreadComplete && canSelectCards) {
      // Kiểm tra nếu lá bài đã được chọn thì không làm gì
      if (selectedCards.includes(cardName)) {
        return;
      }
      
      // Chỉ cho phép chọn tối đa 5 lá bài
      if (selectedCards.length < 5) {
        // Thêm lá bài vào danh sách đã chọn
        setSelectedCards(prev => [...prev, cardName]);
        
        // Tìm và thêm class cho lá bài đã chọn
        const cardElement = document.getElementById(cardName);
        if (cardElement) {
          cardElement.classList.add('selected');
          // Nâng lá bài lên cao hơn khi được chọn và giữ nguyên vị trí đó
          gsap.to(cardElement, {
            y: -20, // Đặt vị trí tuyệt đối cao hơn
            duration: 0.3,
            ease: "power2.out"
          });
        }
      }
    }
  };

  // Mảng chứa tiêu đề cho 5 lá bài
  const cardTitles = [
    "Hiện tại",
    "Thách thức", 
    "Lời khuyên", 
    "Điều cần thức tỉnh", 
    "Kết quả tiềm năng"
  ];

  return (
    <div className="tarot-container">
      <ul className={`cards ${isSpreadComplete ? 'spread-complete' : ''} ${hasShuffled ? 'has-shuffled' : ''}`} ref={cardsRef}>
        {shuffledCards.map((card, index) => (
          <li 
            key={index}
            id={card.name} 
            className={`card ${selectedCards.includes(card.name) ? 'selected' : ''}`}
            onClick={() => handleCardClick(card.name)}
          ></li>
        ))}
      </ul>
      <div className="control-panel">
        <button 
          onClick={handleShuffle}
          disabled={isShuffling}
          className="shuffle-button"
        >
          Xáo bài
        </button>
      </div>

      {/* Phần hiển thị 5 lá bài bí ẩn với tiêu đề */}
      <div className="mystery-cards-container">
        {cardTitles.map((title, index) => (
          <div key={index} className="mystery-card-item">
            <div className="mystery-card">
              <img src="/svgTarot/ques-card.svg" alt="Lá bài bí ẩn" />
            </div>
            <div className="mystery-card-title">{title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
