"use client";

import React, { useState } from "react";
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
  onConfirm 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  dob: { d: string; m: string; y: string };
  onConfirm: (dob: { d: string; m: string; y: string }) => void;
}) => {
  const [tempDob, setTempDob] = useState(dob);

  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();

  const handleIncrement = (field: 'd' | 'm' | 'y') => {
    let val = parseInt(tempDob[field]);
    if (field === 'd') val = val >= 31 ? 1 : val + 1;
    if (field === 'm') val = val >= 12 ? 1 : val + 1;
    if (field === 'y') val = val >= currentYear ? currentYear - 100 : val + 1;
    setTempDob({ ...tempDob, [field]: val.toString().padStart(field === 'y' ? 4 : 2, "0") });
  };

  const handleDecrement = (field: 'd' | 'm' | 'y') => {
    let val = parseInt(tempDob[field]);
    if (field === 'd') val = val <= 1 ? 31 : val - 1;
    if (field === 'm') val = val <= 1 ? 12 : val - 1;
    if (field === 'y') val = val <= currentYear - 100 ? currentYear : val - 1;
    setTempDob({ ...tempDob, [field]: val.toString().padStart(field === 'y' ? 4 : 2, "0") });
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-auto">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#0B0515]/80 backdrop-blur-sm" onClick={onClose} 
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-[#11051e] border border-[#c9a84c]/50 rounded-2xl w-full max-w-[400px] shadow-[0_0_30px_rgba(20,5,40,0.8)] overflow-hidden flex flex-col pt-3"
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

            {/* Column D */}
            <div className="flex flex-col items-center justify-between h-full z-10">
              <button onClick={() => handleDecrement('d')} className="text-[#c9a84c] opacity-60 hover:opacity-100 p-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"></polyline></svg></button>
              <div className="text-[#c9a84c] font-bold text-xl font-eb-garamond">{tempDob.d}</div>
              <button onClick={() => handleIncrement('d')} className="text-[#c9a84c] opacity-60 hover:opacity-100 p-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
            </div>

            {/* Column M */}
            <div className="flex flex-col items-center justify-between h-full z-10">
              <button onClick={() => handleDecrement('m')} className="text-[#c9a84c] opacity-60 hover:opacity-100 p-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"></polyline></svg></button>
              <div className="text-[#c9a84c] font-bold text-xl font-eb-garamond">Tháng {parseInt(tempDob.m)}</div>
              <button onClick={() => handleIncrement('m')} className="text-[#c9a84c] opacity-60 hover:opacity-100 p-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
            </div>

            {/* Column Y */}
            <div className="flex flex-col items-center justify-between h-full z-10">
              <button onClick={() => handleDecrement('y')} className="text-[#c9a84c] opacity-60 hover:opacity-100 p-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"></polyline></svg></button>
              <div className="text-[#c9a84c] font-bold text-xl font-eb-garamond">{tempDob.y}</div>
              <button onClick={() => handleIncrement('y')} className="text-[#c9a84c] opacity-60 hover:opacity-100 p-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
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
      
      {/* Title block */}
      <div className="mb-8">
        <span className="text-[#c9a84c] font-cinzel text-sm drop-shadow-md">I</span>
        <h2 className="text-[#f5ebcf] font-cinzel text-3xl font-bold mt-1 mb-2 tracking-wide drop-shadow-sm">Hỏi Người Trải Bài</h2>
        <p className="text-[#e8b4ff]/80 font-eb-garamond italic text-[15px] leading-relaxed max-w-lg">
          Thông tin cung cấp chân thành cùng hy vọng giúp vũ trụ kết nối năng lượng chính xác đến bạn
        </p>
      </div>

      <div className="flex flex-col gap-5 w-full">
        {/* Name Input */}
        <div className="border border-[#4c277d] hover:border-[#8352be] focus-within:border-[#c9a84c] bg-[#0d0614]/80 rounded-xl px-4 py-2 flex flex-col transition-colors shadow-inner">
          <label className="text-[#c9a84c] text-[10px] tracking-widest font-bold uppercase mb-0.5">Họ và tên</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            className="w-full bg-transparent text-white font-eb-garamond text-xl focus:outline-none placeholder:text-white/20"
            placeholder="Nhập tên của bạn..."
          />
        </div>

        {/* 2-Column Grid for DOB and Gender */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* DOB */}
          <div className="flex flex-col gap-2">
            <label className="text-[#c9a84c] text-[10px] tracking-widest font-bold uppercase ml-1 opacity-90">Ngày Sinh</label>
            <button
              onClick={() => setModalOpen(true)}
              className="border border-[#4c277d] hover:border-[#8352be] bg-[#0d0614]/80 rounded-xl px-4 py-3.5 flex justify-between items-center w-full transition-colors shadow-inner group"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#c9a84c] text-sm">✦</span>
                <span className="text-white font-eb-garamond text-lg font-medium tracking-wide">
                  {dob.d} / {dob.m} / {dob.y}
                </span>
              </div>
              <svg className="text-[#c9a84c] opacity-80 group-hover:opacity-100 transition-opacity" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </button>
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-[#c9a84c] text-[10px] tracking-widest font-bold uppercase ml-1 opacity-90">Giới Tính</label>
            <div className="relative border border-[#4c277d] hover:border-[#8352be] focus-within:border-[#c9a84c] bg-[#0d0614]/80 rounded-xl px-4 py-[11px] transition-colors shadow-inner cursor-pointer">
              <select
                value={gender}
                onChange={(e) => onChangeGender(e.target.value)}
                className="w-full bg-transparent text-white font-eb-garamond text-lg font-medium appearance-none outline-none cursor-pointer [&>option]:bg-[#11051e]"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
              {/* Custom Dropdown Chevron */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#c9a84c]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>

      <AnimatePresence>
        <DateModal
          key="date-modal"
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          dob={dob}
          onConfirm={onChangeDob}
        />
      </AnimatePresence>
    </div>
  );
}
