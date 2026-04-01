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

  // Sync tempDob when parent dob changes or modal opens
  useEffect(() => {
    if (isOpen) setTempDob(dob);
  }, [isOpen, dob]);

  const currentYear = new Date().getFullYear();
  const wheelTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const handleIncrement = useCallback((field: "d" | "m" | "y") => {
    setTempDob((prev) => {
      let val = parseInt(prev[field]);
      if (field === "d") val = val >= 31 ? 1 : val + 1;
      if (field === "m") val = val >= 12 ? 1 : val + 1;
      if (field === "y") val = val >= currentYear ? currentYear - 100 : val + 1;
      return { ...prev, [field]: val.toString().padStart(field === "y" ? 4 : 2, "0") };
    });
  }, [currentYear]);

  const handleDecrement = useCallback((field: "d" | "m" | "y") => {
    setTempDob((prev) => {
      let val = parseInt(prev[field]);
      if (field === "d") val = val <= 1 ? 31 : val - 1;
      if (field === "m") val = val <= 1 ? 12 : val - 1;
      if (field === "y") val = val <= currentYear - 100 ? currentYear : val - 1;
      return { ...prev, [field]: val.toString().padStart(field === "y" ? 4 : 2, "0") };
    });
  }, [currentYear]);

  const handleWheel = useCallback((e: React.WheelEvent, field: "d" | "m" | "y") => {
    e.preventDefault();
    if (wheelTimers.current[field]) return;
    wheelTimers.current[field] = setTimeout(() => { delete wheelTimers.current[field]; }, 80);

    if (e.deltaY > 0) {
      handleIncrement(field);
    } else {
      handleDecrement(field);
    }
  }, [handleIncrement, handleDecrement]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center">
          {/* Backdrop - đè lên toàn bộ, bao gồm cả JourneyFormModal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0B0515]/80 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* DateModal Panel */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-[#11051e] border border-[#c9a84c]/50 rounded-2xl w-full max-w-[400px] mx-4 shadow-[0_0_30px_rgba(20,5,40,0.8)] overflow-hidden flex flex-col pt-3"
          >
            {/* Glow Header */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-60" />

            <div className="text-center py-4 text-[#c9a84c] font-cinzel tracking-widest text-sm flex justify-center items-center gap-2 border-b border-white/5">
              <span>✦</span> NGÀY SINH <span>✦</span>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-3 text-center mb-2">
                <span className="text-[10px] text-white/50 tracking-widest">NGÀY</span>
                <span className="text-[10px] text-white/50 tracking-widest">THÁNG</span>
                <span className="text-[10px] text-white/50 tracking-widest">NĂM</span>
              </div>

              <div className="grid grid-cols-3 items-center text-center relative h-32">
                {/* Highlight band */}
                <div className="absolute top-1/2 left-0 right-0 h-12 -translate-y-1/2 bg-[#3b1261]/20 border-y border-[#c9a84c]/20 pointer-events-none rounded" />

                {/* Column D — supports wheel scroll */}
                <div className="flex flex-col items-center justify-between h-full z-10 cursor-ns-resize" onWheel={(e) => handleWheel(e, "d")}>
                  <button onClick={() => handleDecrement("d")} className="text-[#c9a84c] opacity-60 hover:opacity-100 p-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"></polyline></svg></button>
                  <div className="text-[#c9a84c] font-bold text-xl font-eb-garamond select-none">{tempDob.d}</div>
                  <button onClick={() => handleIncrement("d")} className="text-[#c9a84c] opacity-60 hover:opacity-100 p-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
                </div>

                {/* Column M — supports wheel scroll */}
                <div className="flex flex-col items-center justify-between h-full z-10 cursor-ns-resize" onWheel={(e) => handleWheel(e, "m")}>
                  <button onClick={() => handleDecrement("m")} className="text-[#c9a84c] opacity-60 hover:opacity-100 p-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"></polyline></svg></button>
                  <div className="text-[#c9a84c] font-bold text-xl font-eb-garamond select-none">Tháng {parseInt(tempDob.m)}</div>
                  <button onClick={() => handleIncrement("m")} className="text-[#c9a84c] opacity-60 hover:opacity-100 p-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
                </div>

                {/* Column Y — supports wheel scroll */}
                <div className="flex flex-col items-center justify-between h-full z-10 cursor-ns-resize" onWheel={(e) => handleWheel(e, "y")}>
                  <button onClick={() => handleDecrement("y")} className="text-[#c9a84c] opacity-60 hover:opacity-100 p-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"></polyline></svg></button>
                  <div className="text-[#c9a84c] font-bold text-xl font-eb-garamond select-none">{tempDob.y}</div>
                  <button onClick={() => handleIncrement("y")} className="text-[#c9a84c] opacity-60 hover:opacity-100 p-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 px-6 pb-6 pt-2">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-full border border-white/20 text-white/60 font-eb-garamond hover:bg-white/5 transition-colors">
                Xóa
              </button>
              <button
                onClick={() => { onConfirm(tempDob); onClose(); }}
                className="flex-1 py-2.5 rounded-full bg-[#5a21b6] hover:bg-[#6b21a8] text-white font-eb-garamond flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(90,33,182,0.4)] transition-all"
              >
                Xác Nhận <span className="text-[#c9a84c] text-sm">✦</span>
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

  return (
    <div className="flex flex-col w-full h-full animate-fade-in relative">
      <div className="flex flex-col gap-4 w-full">
        {/* Name Input */}
        <div className="border border-[#4c277d] focus-within:border-[#c9a84c] focus-within:shadow-[0_0_15px_rgba(201,168,76,0.4)] bg-[#0d0614]/80 rounded-xl px-4 py-2 flex flex-col transition-colors shadow-inner w-full">
          <label className="text-[#c9a84c] text-[10px] tracking-widest font-bold uppercase mb-0.5">Họ và tên</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            className="w-full bg-transparent text-white font-eb-garamond text-xl focus:outline-none placeholder:text-white/20"
            placeholder="Nhập tên của bạn..."
          />
        </div>

        {/* DOB + Gender — single row */}
        <div className="grid grid-cols-2 gap-4">
          {/* DOB */}
          <div className="border border-[#4c277d] focus-within:border-[#c9a84c] focus-within:shadow-[0_0_15px_rgba(201,168,76,0.4)] bg-[#0d0614]/80 rounded-xl px-4 py-2 flex flex-col transition-colors shadow-inner">
            <label className="text-[#c9a84c] text-[10px] tracking-widest font-bold uppercase mb-0.5">Ngày sinh</label>
            <button
              id="dob-button"
              onClick={(e) => {
                e.currentTarget.parentElement?.focus();
                setModalOpen(true);
              }}
              className="flex justify-between items-center w-full group focus:outline-none"
            >
              <span className="text-white font-eb-garamond text-lg font-medium tracking-wide">
                {dob.d} / {dob.m} / {dob.y}
              </span>
              <svg className="text-[#c9a84c] opacity-80 group-hover:opacity-100 transition-opacity" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </button>
          </div>

          {/* Gender */}
          <div className="border border-[#4c277d] focus-within:border-[#c9a84c] focus-within:shadow-[0_0_15px_rgba(201,168,76,0.4)] bg-[#0d0614]/80 rounded-xl px-4 py-2 flex flex-col transition-colors shadow-inner">
            <label className="text-[#c9a84c] text-[10px] tracking-widest font-bold uppercase mb-0.5">Giới tính</label>
            <div className="relative">
              <select
                value={gender}
                onChange={(e) => onChangeGender(e.target.value)}
                className="w-full bg-transparent text-white font-eb-garamond text-lg font-medium appearance-none outline-none cursor-pointer [&>option]:bg-[#11051e]"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#c9a84c]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DateModal — rendered as portal, overlaying everything */}
      <DateModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        dob={dob}
        onConfirm={onChangeDob}
      />
    </div>
  );
}
