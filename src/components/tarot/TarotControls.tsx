"use client";

interface TarotControlsProps {
  handleShuffle: () => void;
  isShuffling: boolean;
}

export default function TarotControls({ handleShuffle, isShuffling }: TarotControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <button 
        onClick={handleShuffle}
        disabled={isShuffling}
        className="px-5 py-2.5 rounded shadow-[0_2px_5px_rgba(0,0,0,0.1)] bg-[#272727] text-white border-none cursor-pointer text-base z-10 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-black transition-colors"
      >
        Xáo bài
      </button>
    </div>
  );
}
