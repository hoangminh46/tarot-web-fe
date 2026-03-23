"use client";

import { TarotCard } from '@/json/tarot';

interface TarotDeckProps {
  cardsRef: React.RefObject<HTMLUListElement | null>;
  shuffledCards: TarotCard[];
  selectedCards: string[];
  isSpreadComplete: boolean;
  hasShuffled: boolean;
  handleCardClick: (cardName: string) => void;
}

export default function TarotDeck({
  cardsRef,
  shuffledCards,
  selectedCards,
  isSpreadComplete,
  hasShuffled,
  handleCardClick
}: TarotDeckProps) {
  return (
    <ul 
      className={`flex list-none p-0 mt-10 relative w-[1140px] h-[30vmin] ${isSpreadComplete ? 'spread-complete' : ''} ${hasShuffled ? 'has-shuffled' : ''}`} 
      ref={cardsRef as React.RefObject<HTMLUListElement>}
    >
      {shuffledCards.map((card, index) => {
        const isSelected = selectedCards.includes(card.name);
        const canHover = hasShuffled && isSpreadComplete && !isSelected;
        
        return (
          <li 
            key={index}
            id={card.name} 
            className={`absolute flex w-[15vmin] aspect-[147/256] bg-[url('/svgTarot/card.svg')] bg-contain bg-no-repeat will-change-transform origin-center transition-transform duration-300 ease-out 
              ${isSelected ? 'pointer-events-none opacity-100 brightness-75' : ''}
              ${canHover ? 'cursor-pointer' : ''}`}
            onClick={() => handleCardClick(card.name)}
          />
        );
      })}
    </ul>
  );
}
