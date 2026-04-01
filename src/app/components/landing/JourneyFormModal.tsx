"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Step1PersonalInfo from "./journey/Step1PersonalInfo";
import Step2Theme from "./journey/Step2Theme";
import Step3Question from "./journey/Step3Question";
import Step4Spread from "./journey/Step4Spread";
import { FocusScreen } from "./journey/FocusScreen";

export const JourneyFormModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [tuple, setTuple] = useState<[number, number]>([1, 1]); // [step, direction]
  const [, setDirection] = useState(1);
  const [step2ActiveMain, setStep2ActiveMain] = useState<string | null>(null);
  
  const [showFocus, setShowFocus] = useState(false);
  const [shake, setShake] = useState(false);

  // Form Data State
  const [formData, setFormData] = useState({
    name: "",
    dob: { d: "15", m: "06", y: "1995" },
    gender: "Nam",
    theme: "love",
    question: "",
    spread: 3,
  });

  const totalSteps = 4;

  const nextStep = (skipTheme: boolean = false) => {
    // Validation on Step 1
    if (step === 1 && formData.name.trim() === "") {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (step < totalSteps) {
      if (skipTheme && step === 2) {
        setFormData((prev) => ({ ...prev, theme: "general" }));
      }
      setStep((prev) => prev + 1);
      setDirection(1);
      setTuple([step + 1, 1]);
    } else {
      // Final step submit
      setShowFocus(true);
    }
  };

  const handleFinishJourney = () => {
    console.log("FINAL TAROT CEREMONY DATA:", formData);
    setShowFocus(false);
    onClose();
    // Reset state for next open if needed
    setStep(1);
    setTuple([1, 1]);
    setFormData((prev) => ({ ...prev, name: "", question: "" })); 
  };

  const prevStep = () => {
    if (step === 2 && step2ActiveMain !== null) {
      setStep2ActiveMain(null);
      return;
    }
    if (step > 1) {
      setStep((prev) => prev - 1);
      setDirection(-1);
      setTuple([step - 1, -1]);
    }
  };

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 50 : -50,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 50 : -50,
        opacity: 0,
      };
    },
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center">
          {/* Kính mờ phủ toàn màn hình, không có onClick={onClose} để tránh bấm tắt nhầm */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0B0515]/70 backdrop-blur-md"
          />

          {/* Form Panel */}
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl mx-4 flex flex-col bg-[#140a26]/90 border border-[#c9a84c]/30 rounded-2xl shadow-[0_0_40px_rgba(201,168,76,0.1)] overflow-hidden"
            style={{ minHeight: "500px" }}
          >
        {/* Progress Bar (Top Line) */}
        <div className="absolute top-0 left-0 h-1 bg-[#c9a84c] transition-all duration-500 ease-out" style={{ width: `${(step / totalSteps) * 100}%` }} />

        {/* Header - Close Button & Step Dots */}
        <div className="flex flex-col items-center justify-center p-6 pb-2">
          {/* Nút đóng */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#e8b4ff]/70 hover:text-[#c9a84c] transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4].map((i) => (
              <React.Fragment key={i}>
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    step >= i ? "bg-[#c9a84c] shadow-[0_0_8px_rgba(201,168,76,0.8)]" : "bg-white/10"
                  }`}
                />
                {i < 4 && (
                  <div
                    className={`w-8 h-[1px] transition-all duration-300 ${
                      step > i ? "bg-[#c9a84c]/50" : "bg-white/10"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content Area uses AnimatePresence to slide sub-components */}
        <div className="relative flex-1 flex flex-col overflow-hidden px-8 pb-8">
          <AnimatePresence mode="wait" initial={false} custom={tuple[1]}>
            <motion.div
              key={step}
              custom={tuple[1]}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="flex flex-col flex-1 h-full w-full"
            >
              {step === 1 && (
                <div className="flex-1 flex flex-col items-center w-full">
                  <span className="text-[#c9a84c] opacity-50 font-cinzel text-sm mb-2 drop-shadow-md">I</span>
                  <h2 className="text-[#c9a84c] font-cinzel text-3xl mb-2 pt-2">Hỏi Người Trải Bài</h2>
                  <p className="text-[#e8b4ff]/80 font-eb-garamond italic mb-8 text-base max-w-md leading-relaxed text-center">
                    Thông tin cung cấp chân thành cùng hy vọng giúp vũ trụ kết nối năng lượng chính xác đến bạn
                  </p>
                  <div className={`w-full max-w-xl ${shake ? "animate-shake" : ""}`}>
                    <Step1PersonalInfo
                      name={formData.name}
                      onChangeName={(v) => {
                        setFormData({ ...formData, name: v });
                        if (shake) setShake(false);
                      }}
                      dob={formData.dob}
                      onChangeDob={(v) => setFormData({ ...formData, dob: v })}
                      gender={formData.gender}
                      onChangeGender={(v) => setFormData({ ...formData, gender: v })}
                    />
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-[#c9a84c] opacity-50 font-cinzel text-sm mb-2 drop-shadow-md">II</span>
                  <h2 className="text-[#c9a84c] font-cinzel text-3xl mb-2 pt-2">Chọn Lĩnh Vực</h2>
                  <p className="text-[#e8b4ff]/80 font-eb-garamond italic mb-8 text-base max-w-md leading-relaxed text-center">
                    Vũ trụ cần biết bạn muốn khám phá điều gì
                  </p>
                  <Step2Theme
                    theme={formData.theme}
                    onChangeTheme={(v) => setFormData({ ...formData, theme: v })}
                    onNextStep={() => nextStep(false)}
                    activeMain={step2ActiveMain}
                    setActiveMain={setStep2ActiveMain}
                  />
                </div>
              )}
              {step === 3 && (
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-[#c9a84c] opacity-50 font-cinzel text-sm mb-2 drop-shadow-md">III</span>
                  <h2 className="text-[#c9a84c] font-cinzel text-3xl mb-2 pt-2">Câu Hỏi Của Bạn</h2>
                  <p className="text-[#e8b4ff]/80 font-eb-garamond italic mb-8 text-base max-w-md leading-relaxed text-center">
                    Hãy đặt câu hỏi với tất cả sự thành tâm
                  </p>
                  <Step3Question
                    question={formData.question}
                    onChangeQuestion={(v) => setFormData({ ...formData, question: v })}
                    selectedTheme={formData.theme}
                  />
                </div>
              )}
              {step === 4 && (
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-[#c9a84c] opacity-50 font-cinzel text-sm mb-2 drop-shadow-md">IV</span>
                  <h2 className="text-[#c9a84c] font-cinzel text-3xl mb-2 pt-2">Nghi Thức Trải Bài</h2>
                  <p className="text-[#e8b4ff]/80 font-eb-garamond italic mb-8 text-base max-w-md leading-relaxed text-center">
                    Mỗi kiểu trải bài mang một chiều sâu khác nhau
                  </p>
                  <Step4Spread
                    spread={formData.spread}
                    onChangeSpread={(v) => setFormData({ ...formData, spread: v })}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-auto pt-6 flex justify-between items-center w-full z-10 border-t border-[rgba(201,168,76,0.1)]">
            {/* Cam ket bao mat du lieu on left instead of Spacer */}
            {step === 1 ? (
              <div className="flex items-center gap-2 text-[#c9a84c] opacity-70">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span className="text-xs font-eb-garamond">Cam kết bảo mật dữ liệu</span>
              </div>
            ) : step > 1 ? (
              <button
                onClick={prevStep}
                className="text-[#e8b4ff] hover:text-[#c9a84c] font-eb-garamond flex items-center gap-2 transition-colors cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Quay lại
              </button>
            ) : (
              <span /> // Spacer
            )}

            <button
              onClick={() => step === 2 ? nextStep(true) : nextStep(false)}
              className="text-white bg-[#5a21b6] hover:bg-[#6b21a8] px-6 py-2.5 rounded-[1.5rem] font-medium font-serif flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(90,33,182,0.4)]"
            >
              {step === 4 ? "Mở Bài" : step === 2 ? "Bỏ Qua" : "Tiếp theo"}
              {step < 4 && step !== 2 && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </motion.div>
      </div>
    )}
    
    <FocusScreen
      isOpen={showFocus}
      question={formData.question}
      onComplete={handleFinishJourney}
    />
    </AnimatePresence>,
    document.body
  );
};
