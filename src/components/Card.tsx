import React from 'react';
import { Card as CardType } from '../types/game';
import { ELEMENT_NAMES } from '../data/cards';

interface CardProps {
  card: CardType;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const sizeClasses = {
  small: 'w-14 h-18 text-xs',
  medium: 'w-18 h-24 text-sm',
  large: 'w-22 h-32 text-base',
};

const elementColors: Record<string, string> = {
  H: 'from-red-400 to-red-600',
  O: 'from-blue-400 to-blue-600',
  C: 'from-gray-600 to-gray-800',
  N: 'from-indigo-400 to-indigo-600',
  Cl: 'from-green-400 to-green-600',
  F: 'from-cyan-400 to-cyan-600',
  Na: 'from-yellow-400 to-yellow-600',
  K: 'from-purple-400 to-purple-600',
  Fe: 'from-orange-600 to-red-600',
  Cu: 'from-amber-600 to-orange-600',
  Ag: 'from-gray-300 to-gray-500',
  He: 'from-pink-300 to-pink-500',
  Ne: 'from-teal-300 to-teal-500',
  Ar: 'from-emerald-300 to-emerald-500',
  Mg: 'from-lime-400 to-lime-600',
  Al: 'from-slate-400 to-slate-600',
  Si: 'from-violet-400 to-violet-600',
  P: 'from-rose-400 to-rose-600',
  S: 'from-yellow-500 to-yellow-700',
  Ca: 'from-stone-400 to-stone-600',
};

export function Card({ card, isSelected, onClick, size = 'medium', disabled }: CardProps) {
  const elementName = ELEMENT_NAMES[card.element];
  const colorClass = elementColors[card.element] || 'from-gray-400 to-gray-600';
  
  return (
    <div
      className={`
        ${sizeClasses[size]}
        bg-gradient-to-br ${colorClass}
        border-2 rounded-xl cursor-pointer
        flex flex-col items-center justify-center
        font-bold shadow-lg transition-all duration-200
        hover:shadow-xl hover:scale-110 hover:-translate-y-1
        text-white relative overflow-hidden
        ${isSelected ? 'border-yellow-400 scale-110 shadow-xl ring-2 ring-yellow-300' : 'border-white border-opacity-30'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${onClick ? 'hover:brightness-110' : ''}
      `}
      onClick={!disabled ? onClick : undefined}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-white bg-opacity-10 rounded-full -mr-4 -mt-4"></div>
      <div className="absolute bottom-0 left-0 w-6 h-6 bg-white bg-opacity-10 rounded-full -ml-3 -mb-3"></div>
      
      <div className="text-2xl font-black text-white drop-shadow-md">
        {card.element}
      </div>
      <div className="text-xs text-white text-center leading-tight opacity-90 font-medium">
        {elementName}
      </div>
      
      {/* Atomic number decoration */}
      <div className="absolute top-1 left-1 text-xs font-bold text-white opacity-60">
        {getAtomicNumber(card.element)}
      </div>
    </div>
  );
}

function getAtomicNumber(element: string): number {
  const atomicNumbers: Record<string, number> = {
    H: 1, He: 2, C: 6, N: 7, O: 8, F: 9, Ne: 10, Na: 11, Mg: 12, Al: 13,
    Si: 14, P: 15, S: 16, Cl: 17, Ar: 18, K: 19, Ca: 20, Fe: 26, Cu: 29, Ag: 47
  };
  return atomicNumbers[element] || 0;
}