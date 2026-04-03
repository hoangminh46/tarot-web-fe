"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTarotDeck } from "@/hooks/useTarotDeck";
import Image from "next/image";


type FlowMode = "selection" | "auto" | "manual";

export default function ReadingFlow() {
  const { deck, drawCardByIndex, shuffleDeck, drawnCards, drawCards } = useTarotDeck();
  const [spreadCount, setSpreadCount] = useState<number>(3); // Default to 3
  const [flowMode, setFlowMode] = useState<FlowMode>("selection");
  const [isAutoDrawing, setIsAutoDrawing] = useState(false);

  // Initialize deck and load spread parameters
  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = sessionStorage.getItem("tarotJourneyData");
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (parsed.spread) setSpreadCount(Number(parsed.spread));
        } catch (e) {
          console.error("Failed to parse journey data", e);
        }
      }
    }

    shuffleDeck();
  }, [shuffleDeck]);

  const handleStartAutoDraw = () => {
    setFlowMode("auto");
    setIsAutoDrawing(true);
    let drawnCount = 0;
    
    // Rút lần lượt từng lá bài mỗi 800ms
    const interval = setInterval(() => {
      drawCards(1);
      drawnCount++;
      if (drawnCount >= spreadCount) {
        clearInterval(interval);
        setIsAutoDrawing(false);
      }
    }, 800);
  };

  const handleReadMessages = () => {
    // Navigate to results page
    if (typeof window !== "undefined") {
      sessionStorage.setItem("tarotDrawnCards", JSON.stringify(drawnCards));
    }
    // TODO: Phase 4 will handle the result page
    alert("Chuyển sang trang Đọc Thông Điệp (Phase kế tiếp)");
  };

  // Render các slot trống và bài đã rút
  const renderSlots = () => {
    const slots = [];
    for (let i = 0; i < spreadCount; i++) {
        const card = drawnCards[i];
        
        slots.push(
          <div key={i} className="relative w-24 h-40 sm:w-32 sm:h-48 md:w-40 md:h-60 rounded-xl bg-white/5 border border-dashed border-[#c9a84c]/30 flex items-center justify-center">
            <AnimatePresence>
              {card && (
                <motion.div
                  initial={{ opacity: 0, y: -50, scale: 0.8, rotateY: 180 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-[0_0_20px_rgba(201,168,76,0.3)] bg-[#2a1452] flex items-center justify-center border border-[#c9a84c]/50"
                >
                  <Image 
                    src="/svgTarot/card.svg" 
                    alt="Card Back" 
                    fill 
                    className="object-cover opacity-80"
                  />
                  {/* Có thể thêm một họa tiết viền hoặc logo nhỏ ở mặt sau nếu thích */}
                  <div className="absolute inset-2 border border-[#c9a84c]/30 rounded-lg pointer-events-none" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
    }
    
    return (
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-8 z-10 w-full px-4">
            {slots}
        </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B0515] overflow-y-auto overflow-x-hidden text-white font-eb-garamond"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#5a21b6]/20 to-[#c9a84c]/10 rounded-full blur-[120px] mix-blend-screen opacity-50" />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] px-4 flex flex-col items-center min-h-[500px]">
        
        {/* Header Title */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-5xl text-[#c9a84c] font-cinzel tracking-wider drop-shadow-md mb-2">
            Nghi Thức Trải Bài
          </h1>
          <p className="text-[#e8b4ff]/70 text-lg md:text-xl max-w-2xl mx-auto">
            {flowMode === "selection" 
                ? "Hãy chọn hình thức bốc bài phù hợp với trực giác của bạn ngay lúc này."
                : flowMode === "auto"
                  ? (drawnCards.length < spreadCount ? "Định mệnh đang lựa chọn lá bài cho bạn..." : "Thông điệp vũ trụ đã sẵn sàng.")
                  : "Hãy tĩnh tâm và chọn lá bài bạn cảm thấy kết nối nhất."
            }
          </p>
        </motion.div>

        {/* Mode Selection State */}
        {flowMode === "selection" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col sm:flex-row gap-6 mt-10"
          >
            <button 
              onClick={() => setFlowMode("manual")}
              className="group relative px-8 py-10 bg-[#1a0b2e]/60 border border-[#c9a84c]/30 hover:border-[#c9a84c] rounded-2xl flex flex-col items-center justify-center gap-4 transition-all hover:bg-[#2a1452]/60 hover:shadow-[0_0_30px_rgba(201,168,76,0.2)]"
            >
              <div className="w-16 h-16 rounded-full bg-[#c9a84c]/10 flex items-center justify-center text-[#c9a84c] group-hover:scale-110 transition-transform">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v4h2v-2.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v10.5c0 3.31-2.69 6-6 6h-2c-2.76 0-5-2.24-5-5v-6.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v4" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-[#c9a84c] font-cinzel text-xl mb-1 mt-2">Dùng Trực Giác</h3>
                <p className="text-[#e8b4ff]/70 text-sm">Tự tay lật mở những lá bài của định mệnh</p>
              </div>
            </button>

            <button 
              onClick={handleStartAutoDraw}
              className="group relative px-8 py-10 bg-[#1a0b2e]/60 border border-[#c9a84c]/30 hover:border-[#c9a84c] rounded-2xl flex flex-col items-center justify-center gap-4 transition-all hover:bg-[#2a1452]/60 hover:shadow-[0_0_30px_rgba(201,168,76,0.2)]"
            >
              <div className="w-16 h-16 rounded-full bg-[#c9a84c]/10 flex items-center justify-center text-[#c9a84c] group-hover:scale-110 transition-transform">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                  <path d="M22 12A10 10 0 0 0 12 2v10z" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-[#c9a84c] font-cinzel text-xl mb-1 mt-2">Trải Bài Đáng Tin</h3>
                <p className="text-[#e8b4ff]/70 text-sm">Để vũ trụ chọn lọc thông điệp cho bạn</p>
              </div>
            </button>
          </motion.div>
        )}

        {/* Auto / Manual Draw State */}
        {(flowMode === "auto" || flowMode === "manual") && (
          <div className="w-full flex-1 flex flex-col items-center">
             {/* If we strictly need a button to start Auto draw instead of starting immediately, we can show it here, but I started immediately on click */}
             
             {/* Auto mode slots are at the top */}
             {flowMode === "auto" && renderSlots()}

             {/* Manual Deck Grid - Hiển thị toàn bộ lá bài lên màn hình */}
             {flowMode === "manual" && drawnCards.length < spreadCount && (
               <div className="w-full relative mt-4 pb-6">
                 <div className="w-full flex flex-wrap justify-center content-start gap-[4px] sm:gap-2 lg:gap-3 px-2 max-w-[1350px] mx-auto">
                     <AnimatePresence>
                       {deck.map((card, index) => (
                         <motion.div
                           key={card.id}
                           initial={{ opacity: 0, scale: 0.8 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0, scale: 0.5, y: 50 }}
                           transition={{ duration: 0.2 }}
                           onClick={() => {
                             if (drawnCards.length < spreadCount) {
                               drawCardByIndex(index);
                             }
                           }}
                           className="relative w-11 h-16 sm:w-16 sm:h-24 md:w-20 md:h-32 lg:w-[5.5rem] lg:h-[8.5rem] hover:-translate-y-2 lg:hover:-translate-y-3 hover:z-50 hover:shadow-[0_4px_25px_rgba(201,168,76,0.5)] hover:border-[#c9a84c]/80 transition-all duration-500 ease-out cursor-pointer bg-[#2a1452] sm:rounded-md rounded border border-[#c9a84c]/30 shadow-md group focus:outline-none"
                         >
                            <Image 
                               src="/svgTarot/card.svg" 
                               alt="Card" 
                               fill 
                               className="object-cover opacity-80 sm:rounded-md rounded group-hover:opacity-100 transition-opacity duration-500 ease-out"
                            />
                         </motion.div>
                       ))}
                     </AnimatePresence>
                 </div>
                 
                 <div className="text-center mt-8">
                     <button onClick={() => setFlowMode("selection")} className="text-[#c9a84c] underline text-sm hover:text-white transition-colors">Quay lại chọn kiểu bốc</button>
                 </div>
               </div>
             )}

             {/* Manual mode slots are at the bottom */}
             {flowMode === "manual" && renderSlots()}

             {/* Go to Result Button (for BOTH mode) */}
             {drawnCards.length >= spreadCount && !isAutoDrawing && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-16"
                >
                  <button
                    onClick={handleReadMessages}
                    className="relative overflow-hidden bg-gradient-to-r from-[#7a32d1] to-[#5a21b6] text-white px-8 py-3 rounded-full font-cinzel text-lg shadow-[0_0_20px_rgba(122,50,209,0.5)] hover:shadow-[0_0_30px_rgba(201,168,76,0.6)] transition-all duration-300 transform hover:scale-105 border border-[#c9a84c]/50"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                       Đọc Thông Điệp
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </span>
                  </button>
                </motion.div>
             )}
          </div>
        )}

      </div>
    </motion.div>
  );
}
