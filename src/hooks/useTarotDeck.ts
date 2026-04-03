import { useState, useCallback } from 'react';
import tarot, { TarotCard } from '../json/tarot';

export interface DrawnCard extends TarotCard {
  isReversed: boolean;
}

export type DrawMode = 'manual' | 'auto';

export function useTarotDeck() {
  const [state, setState] = useState<{ deck: DrawnCard[], drawnCards: DrawnCard[] }>({
    deck: [],
    drawnCards: [],
  });
  const [drawMode, setDrawMode] = useState<DrawMode>('manual');

  // Fisher-Yates shuffle with reversal logic
  const shuffleDeck = useCallback(() => {
    // Create a copy of the cards array to avoid mutating the original
    const newDeck = tarot.cards.map((card) => ({
      ...card,
      isReversed: Math.random() < 0.5,
    }));

    // Fisher-Yates algorithm
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }

    setState({ deck: newDeck, drawnCards: [] });
  }, []);

  // Draw a specific number of cards from the top of the deck
  const drawCards = useCallback((count: number) => {
    setState((prev) => {
      const cardsToDraw = prev.deck.slice(0, count);
      return {
        deck: prev.deck.slice(count),
        drawnCards: [...prev.drawnCards, ...cardsToDraw],
      };
    });
  }, []);
  
  // Draw a specific card by its current index in the deck (useful for manual draw like Fan layout)
  const drawCardByIndex = useCallback((index: number) => {
    setState((prev) => {
      const cardToDraw = prev.deck[index];
      if (!cardToDraw) return prev;
      
      const newDeck = [...prev.deck];
      newDeck.splice(index, 1);
      
      return {
        deck: newDeck,
        drawnCards: [...prev.drawnCards, cardToDraw],
      };
    });
  }, []);

  return {
    deck: state.deck,
    drawnCards: state.drawnCards,
    drawMode,
    setDrawMode,
    shuffleDeck,
    drawCards,
    drawCardByIndex,
  };
}
