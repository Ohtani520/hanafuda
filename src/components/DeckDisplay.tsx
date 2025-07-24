import React from 'react';
import { Card } from '../types/game';
import { Package, Layers } from 'lucide-react';

interface DeckDisplayProps {
  deckCount: number;
  drawnCard: Card | null;
  isAnimating: boolean;
}

export function DeckDisplay({ deckCount, drawnCard, isAnimating }: DeckDisplayProps) {
  return (
    <div className="bg-gradient-to-br from-purple-800 via-indigo-800 to-blue-800 rounded-xl p-6 shadow-2xl border border-purple-500 border-opacity-30">
      <h3 className="text-xl font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
        <Package className="w-6 h-6 text-purple-300" />
        🎲 山札
      </h3>
      
      <div className="flex flex-col items-center space-y-4">
        {/* Deck Stack Visual */}
        <div className="relative">
          {/* Multiple card layers to show stack */}
          <div className="absolute w-20 h-28 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg border-2 border-gray-400 transform rotate-2 opacity-60"></div>
          <div className="absolute w-20 h-28 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg border-2 border-gray-400 transform rotate-1 opacity-80"></div>
          <div className={`
            w-20 h-28 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg border-2 border-white border-opacity-30
            flex flex-col items-center justify-center text-white font-bold shadow-lg
            transition-all duration-300 transform
            ${isAnimating ? 'scale-110 rotate-3' : 'hover:scale-105'}
          `}>
            <Layers className="w-8 h-8 mb-1" />
            <div className="text-xs opacity-80">DECK</div>
          </div>
        </div>
        
        {/* Deck Count */}
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-1">
            {deckCount}
          </div>
          <div className="text-sm text-purple-200">
            枚残り
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full max-w-24">
          <div className="w-full bg-purple-900 bg-opacity-50 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.max((deckCount / 44) * 100, 5)}%` }}
            ></div>
          </div>
          <div className="text-xs text-purple-300 text-center mt-1">
            {Math.round((deckCount / 44) * 100)}%
          </div>
        </div>
        
        {/* Drawn Card Animation */}
        {drawnCard && (
          <div className={`
            mt-4 p-3 bg-yellow-400 bg-opacity-20 rounded-lg border border-yellow-400 border-opacity-50
            transition-all duration-500 transform
            ${isAnimating ? 'scale-105 animate-pulse' : ''}
          `}>
            <div className="text-center text-yellow-200 text-sm">
              🎯 引いたカード
            </div>
            <div className="text-center text-white font-bold text-lg mt-1">
              {drawnCard.element}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}