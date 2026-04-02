"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Step1Props {
  name: string;
  onChangeName: (v: string) => void;
  dob: { d: string; m: string; y: string };
  onChangeDob: (dob: { d: string; m: string; y: string }) => void;
  gender: string;
  onChangeGender: (v: string) => void;
}

const DateModal = ({
  isOpen,
  onClose,
  dob,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  dob: { d: string; m: string; y: string };
  onConfirm: (dob: { d: string; m: string; y: string }) => void;
}) => {
  const [tempDob, setTempDob] = useState(dob);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) setTempDob(dob);
  }, [isOpen, dob]);

  const currentYear = new Date().getFullYear();
  const wheelTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const handleIncrement = useCallback(
    (field: "d" | "m" | "y") => {
      setTempDob((prev) => {
        let val = parseInt(prev[field]);
        if (field === "d") val = val >= 31 ? 1 : val + 1;
        if (field === "m") val = val >= 12 ? 1 : val + 1;
        if (field === "y") val = val >= currentYear ? currentYear - 100 : val + 1;
        return { ...prev, [field]: val.toString().padStart(field === "y" ? 4 : 2, "0") };
      });
    },
    [currentYear]
  );

  const handleDecrement = useCallback(
    (field: "d" | "m" | "y") => {
      setTempDob((prev) => {
        let val = parseInt(prev[field]);
        if (field === "d") val = val <= 1 ? 31 : val - 1;
        if (field === "m") val = val <= 1 ? 12 : val - 1;
        if (field === "y") val = val <= currentYear - 100 ? currentYear : val - 1;
        return { ...prev, [field]: val.toString().padStart(field === "y" ? 4 : 2, "0") };
      });
    },
    [currentYear]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent, field: "d" | "m" | "y") => {
      e.preventDefault();
      if (wheelTimers.current[field]) return;
      wheelTimers.current[field] = setTimeout(() => {
        delete wheelTimers.current[field];
      }, 80);

      if (e.deltaY > 0) {
        handleIncrement(field);
      } else {
        handleDecrement(field);
      }
    },
    [handleIncrement, handleDecrement]
  );

  if (!mounted || !isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0B0515]/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative flex w-full max-w-[400px] flex-col overflow-hidden rounded-2xl border border-[#c9a84c]/50 bg-[#11051e] pt-3 shadow-[0_0_30px_rgba(20,5,40,0.8)]"
          >
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-60" />

            <div className="flex items-center justify-center gap-2 border-b border-white/5 py-4 text-center font-cinzel text-sm tracking-widest text-[#c9a84c]">
              <span>✦</span> NGÀY SINH <span>✦</span>
            </div>

            <div className="p-6">
              <div className="mb-2 grid grid-cols-3 text-center">
                <span className="text-[10px] tracking-widest text-white/50">NGÀY</span>
                <span className="text-[10px] tracking-widest text-white/50">THÁNG</span>
                <span className="text-[10px] tracking-widest text-white/50">NĂM</span>
              </div>

              <div className="relative grid h-32 grid-cols-3 items-center text-center">
                <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-12 -translate-y-1/2 rounded border-y border-[#c9a84c]/20 bg-[#3b1261]/20" />

                <div className="z-10 flex h-full cursor-ns-resize flex-col items-center justify-between" onWheel={(e) => handleWheel(e, "d")}>
                  <button onClick={() => handleDecrement("d")} className="p-2 text-[#c9a84c] opacity-60 hover:opacity-100">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  </button>
                  <div className="select-none font-eb-garamond text-xl font-bold text-[#c9a84c]">{tempDob.d}</div>
                  <button onClick={() => handleIncrement("d")} className="p-2 text-[#c9a84c] opacity-60 hover:opacity-100">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>

                <div className="z-10 flex h-full cursor-ns-resize flex-col items-center justify-between" onWheel={(e) => handleWheel(e, "m")}>
                  <button onClick={() => handleDecrement("m")} className="p-2 text-[#c9a84c] opacity-60 hover:opacity-100">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  </button>
                  <div className="select-none font-eb-garamond text-xl font-bold text-[#c9a84c]">Tháng {parseInt(tempDob.m)}</div>
                  <button onClick={() => handleIncrement("m")} className="p-2 text-[#c9a84c] opacity-60 hover:opacity-100">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>

                <div className="z-10 flex h-full cursor-ns-resize flex-col items-center justify-between" onWheel={(e) => handleWheel(e, "y")}>
                  <button onClick={() => handleDecrement("y")} className="p-2 text-[#c9a84c] opacity-60 hover:opacity-100">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  </button>
                  <div className="select-none font-eb-garamond text-xl font-bold text-[#c9a84c]">{tempDob.y}</div>
                  <button onClick={() => handleIncrement("y")} className="p-2 text-[#c9a84c] opacity-60 hover:opacity-100">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 px-6 pb-6 pt-2">
              <button onClick={onClose} className="flex-1 rounded-full border border-white/20 py-2.5 font-eb-garamond text-white/60 transition-colors hover:bg-white/5">
                Xóa
              </button>
              <button
                onClick={() => {
                  onConfirm(tempDob);
                  onClose();
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#5a21b6] py-2.5 font-eb-garamond text-white shadow-[0_0_15px_rgba(90,33,182,0.4)] transition-all hover:bg-[#6b21a8]"
              >
                Xác Nhận <span className="text-sm text-[#c9a84c]">✦</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default function Step1PersonalInfo({
  name,
  onChangeName,
  dob,
  onChangeDob,
  gender,
  onChangeGender,
}: Step1Props) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isGenderOpen, setGenderOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [genderMenuStyle, setGenderMenuStyle] = useState<React.CSSProperties>({});
  const genderDropdownRef = useRef<HTMLDivElement>(null);
  const genderTriggerRef = useRef<HTMLButtonElement>(null);
  const genderOptions = ["Nam", "Nữ", "Khác"];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!genderDropdownRef.current?.contains(event.target as Node)) {
        setGenderOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setGenderOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!isGenderOpen || !genderTriggerRef.current) return;

    const updatePosition = () => {
      if (!genderTriggerRef.current) return;

      const rect = genderTriggerRef.current.getBoundingClientRect();
      setGenderMenuStyle({
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isGenderOpen]);

  return (
    <div className="relative flex h-full w-full animate-fade-in flex-col">
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-col rounded-xl border border-[#4c277d] bg-[#0d0614]/80 px-4 py-2 shadow-inner transition-colors focus-within:border-[#c9a84c] focus-within:shadow-[0_0_15px_rgba(201,168,76,0.4)]">
          <label className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-[#c9a84c]">Họ và tên</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            className="w-full bg-transparent font-eb-garamond text-xl text-white placeholder:text-white/20 focus:outline-none"
            placeholder="Nhập tên của bạn..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col rounded-xl border border-[#4c277d] bg-[#0d0614]/80 px-4 py-2 shadow-inner transition-colors focus-within:border-[#c9a84c] focus-within:shadow-[0_0_15px_rgba(201,168,76,0.4)]">
            <label className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-[#c9a84c]">Ngày sinh</label>
            <button
              id="dob-button"
              onClick={(e) => {
                e.currentTarget.parentElement?.focus();
                setModalOpen(true);
              }}
              className="group flex w-full items-center justify-between focus:outline-none"
            >
              <span className="font-eb-garamond text-lg font-medium tracking-wide text-white">
                {dob.d} / {dob.m} / {dob.y}
              </span>
              <svg className="text-[#c9a84c] opacity-80 transition-opacity group-hover:opacity-100" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col rounded-xl border border-[#4c277d] bg-[#0d0614]/80 px-4 py-2 shadow-inner transition-colors focus-within:border-[#c9a84c] focus-within:shadow-[0_0_15px_rgba(201,168,76,0.4)]">
            <label className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-[#c9a84c]">Giới tính</label>
            <div className="relative" ref={genderDropdownRef}>
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isGenderOpen}
                onClick={() => setGenderOpen((prev) => !prev)}
                ref={genderTriggerRef}
                className="flex w-full cursor-pointer items-center justify-between gap-3 bg-transparent text-left font-eb-garamond text-lg font-medium text-white outline-none"
              >
                <span className="tracking-wide">{gender}</span>
                <span
                  className={`pointer-events-none text-[#c9a84c] transition-transform duration-200 ${
                    isGenderOpen ? "rotate-180" : ""
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isGenderOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={genderMenuStyle}
                className="z-[100000] overflow-hidden rounded-xl border border-[#c9a84c]/20 bg-[linear-gradient(180deg,rgba(24,10,42,0.98),rgba(12,5,23,0.98))] shadow-[0_14px_28px_rgba(5,0,15,0.45),0_0_18px_rgba(201,168,76,0.1)] backdrop-blur-xl"
              >
                <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/60 to-transparent" />
                <div className="p-1.5">
                  {genderOptions.map((option) => {
                    const isActive = option === gender;

                    return (
                      <button
                        key={option}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        onClick={() => {
                          onChangeGender(option);
                          setGenderOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all duration-200 ${
                          isActive
                            ? "bg-[#c9a84c]/12 text-[#f6e7b0] shadow-[inset_0_0_0_1px_rgba(201,168,76,0.26)]"
                            : "text-white/82 hover:bg-white/6 hover:text-white"
                        }`}
                      >
                        <span className="font-eb-garamond text-base leading-none">{option}</span>
                        <span
                          className={`text-[10px] uppercase tracking-[0.22em] ${
                            isActive ? "text-[#c9a84c]" : "text-[#e8b4ff]/45"
                          }`}
                        >
                          {isActive ? "Đã chọn" : "Chọn"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      <DateModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        dob={dob}
        onConfirm={onChangeDob}
      />
    </div>
  );
}
