import React from 'react';
import { Card as CardComponent } from './Card';
import { Card } from '../types/game';
import { canMatch } from '../utils/matchLogic';
import { ELEMENT_NAMES } from '../data/cards';
import { Target, ArrowRight } from 'lucide-react';

interface DrawnCardMatcherProps {
  drawnCard: Card;
  fieldCards: Card[];
  onSelectMatch: (cardId: string) => void;
  onSkipMatch: () => void;
}

export function DrawnCardMatcher({ drawnCard, fieldCards, onSelectMatch, onSkipMatch }: DrawnCardMatcherProps) {
  const matchableCards = fieldCards.filter(card => canMatch(drawnCard, card));
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 rounded-2xl p-8 max-w-4xl w-full shadow-2xl border border-blue-400 border-opacity-30">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Target className="w-8 h-8 text-yellow-400" />
            🎯 山札カードのマッチ選択
          </h2>
          <p className="text-blue-200">
            山札から引いたカードとマッチする場札を選択してください
          </p>
        </div>
        
        {/* Drawn Card Display */}
        <div className="flex items-center justify-center mb-8">
          <div className="text-center">
            <div className="text-white text-lg font-semibold mb-3">引いたカード</div>
            <div className="transform scale-125">
              <CardComponent card={drawnCard} />
            </div>
            <div className="text-blue-200 text-sm mt-2">
              {drawnCard.element} ({ELEMENT_NAMES[drawnCard.element]})
            </div>
          </div>
          
          <ArrowRight className="w-12 h-12 text-yellow-400 mx-8 animate-pulse" />
          
          <div className="text-center">
            <div className="text-white text-lg font-semibold mb-3">マッチ可能な場札</div>
            <div className="text-yellow-300 text-2xl font-bold">
              {matchableCards.length}枚
            </div>
          </div>
        </div>
        
        {/* Matchable Cards */}
        {matchableCards.length > 0 ? (
          <div className="mb-8">
            <h3 className="text-white text-lg font-semibold mb-4 text-center">
              マッチするカードを選択:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 justify-items-center">
              {matchableCards.map((card) => (
                <div
                  key={card.id}
                  className="transform transition-all duration-200 hover:scale-110 cursor-pointer"
                  onClick={() => onSelectMatch(card.id)}
                >
                  <CardComponent card={card} />
                  <div className="text-center mt-2">
                    <div className="text-xs text-blue-200">
                      {card.element === drawnCard.element ? '同元素' : '分子ペア'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center mb-8">
            <div className="text-yellow-300 text-lg">
              マッチするカードがありません
            </div>
            <div className="text-blue-200 text-sm mt-2">
              カードは場に出されます
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {matchableCards.length > 0 && (
            <button
              onClick={onSkipMatch}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
            >
              マッチしない
            </button>
          )}
          {matchableCards.length === 0 && (
            <button
              onClick={onSkipMatch}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200"
            >
              続行
            </button>
          )}
        </div>
      </div>
    </div>
  );
}