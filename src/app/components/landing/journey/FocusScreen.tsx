"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface FocusScreenProps {
  isOpen: boolean;
  question: string;
  onComplete: () => void;
}

export const FocusScreen = ({ isOpen, question, onComplete }: FocusScreenProps) => {
  const [mounted, setMounted] = useState(false);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCanSkip(false);
      // Chờ 3s trước khi hiện nút Sẵn sàng
      const skipTimer = setTimeout(() => {
        setCanSkip(true);
      }, 3000);

      return () => {
        clearTimeout(skipTimer);
      };
    }
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[999999] bg-[#05020a] flex flex-col items-center justify-center p-6"
        >
          {/* Subtle pulsating orb background */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[60vh] bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.3),transparent_70%)] pointer-events-none rounded-full blur-3xl"
          />

          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl">
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 2 }}
              className="text-[#e8b4ff]/70 font-eb-garamond italic text-xl md:text-2xl leading-relaxed mb-12"
            >
              Vũ trụ đang lắng nghe... Hãy nhắm mắt lại, tĩnh tâm và tập trung năng lượng vào câu hỏi của bạn.
            </motion.p>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 2, duration: 2 }}
              className="px-8 py-8 rounded-2xl bg-[#140a26]/50 border border-[#c9a84c]/30 shadow-[0_0_50px_rgba(201,168,76,0.1)] backdrop-blur-md"
            >
              <h2 className="text-[#c9a84c] font-eb-garamond italic text-3xl md:text-4xl drop-shadow-[0_0_15px_rgba(201,168,76,0.8)] leading-tight">
                &quot;{question || "Vũ trụ muốn nhắn nhủ điều gì đến tôi?"}&quot;
              </h2>
            </motion.div>
          </div>

          {/* Simple skip button */}
          <AnimatePresence>
            {canSkip && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={onComplete}
                className="absolute bottom-12 text-[#c9a84c] hover:text-white hover:drop-shadow-[0_0_10px_rgba(201,168,76,0.8)] font-eb-garamond text-base sm:text-lg tracking-widest uppercase transition-all duration-300 border border-[#c9a84c]/50 px-8 py-3 rounded-full bg-[#c9a84c]/10"
              >
                Tôi Đã Sẵn Sàng
              </motion.button>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
