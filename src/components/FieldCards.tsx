import React from 'react';
import { Card as CardComponent } from './Card';
import { Card } from '../types/game';
import { canMatch } from '../utils/matchLogic';
import { ELEMENT_NAMES } from '../data/cards';

interface FieldCardsProps {
  cards: Card[];
  selectedHandCard: Card | null;
  selectedFieldCard: Card | null;
  onCardSelect: (cardId: string) => void;
  isPlayerTurn: boolean;
}

export function FieldCards({ cards, selectedHandCard, selectedFieldCard, onCardSelect, isPlayerTurn }: FieldCardsProps) {
  const getCardState = (card: Card) => {
    const isSelected = selectedFieldCard?.id === card.id;
    const canMatchWithSelected = selectedHandCard ? canMatch(selectedHandCard, card) : false;
    const isClickable = isPlayerTurn && selectedHandCard && canMatchWithSelected;
    
    return { isSelected, canMatchWithSelected, isClickable };
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 rounded-xl p-6 shadow-2xl border border-blue-500 border-opacity-30">
      <h3 className="text-xl font-bold text-white mb-4 text-center">
        🎴 場札 ({cards.length}枚)
      </h3>
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 justify-items-center">
        {cards.map((card) => {
          const { isSelected, canMatchWithSelected, isClickable } = getCardState(card);
          
          return (
            <div
              key={card.id}
              className={`
                transition-all duration-300 transform
                ${canMatchWithSelected ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-transparent scale-105 animate-pulse' : ''}
                ${isClickable ? 'hover:scale-110' : ''}
              `}
            >
              <CardComponent
                card={card}
                isSelected={isSelected}
                onClick={isClickable ? () => onCardSelect(card.id) : undefined}
                disabled={!isClickable}
              />
            </div>
          );
        })}
      </div>
      
      {selectedHandCard && (
        <div className="mt-4 text-center">
          <div className="bg-blue-800 bg-opacity-50 rounded-lg p-3">
            <p className="text-sm text-blue-200 mb-2">
              選択中: <span className="font-bold text-yellow-300">{selectedHandCard.element}({ELEMENT_NAMES[selectedHandCard.element]})</span>
            </p>
            <p className="text-xs text-blue-300">
              マッチ可能なカード: 
              <span className="font-bold text-yellow-300 ml-1">
                {cards.filter(card => canMatch(selectedHandCard, card)).length}枚
              </span>
            </p>
            <div className="mt-2 text-xs text-blue-300">
              <div>• 同じ元素: {cards.filter(card => card.element === selectedHandCard.element).length}枚</div>
              <div>• 分子ペア: {cards.filter(card => card.element !== selectedHandCard.element && canMatch(selectedHandCard, card)).length}枚</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}