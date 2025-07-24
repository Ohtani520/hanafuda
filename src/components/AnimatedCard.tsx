import React, { useEffect, useState } from 'react';
import { Card as CardComponent } from './Card';
import { Card } from '../types/game';

interface AnimatedCardProps {
  card: Card;
  animationType: 'play' | 'match' | 'collect' | 'draw';
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  onAnimationComplete: () => void;
  delay?: number;
}

export function AnimatedCard({ 
  card, 
  animationType, 
  startPosition, 
  endPosition, 
  onAnimationComplete,
  delay = 0 
}: AnimatedCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState(startPosition);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setPosition(endPosition);
      
      const animationTimer = setTimeout(() => {
        onAnimationComplete();
      }, 800);
      
      return () => clearTimeout(animationTimer);
    }, delay);

    return () => clearTimeout(timer);
  }, [endPosition, onAnimationComplete, delay]);

  if (!isVisible) return null;

  const getAnimationClass = () => {
    switch (animationType) {
      case 'play':
        return 'animate-bounce';
      case 'match':
        return 'animate-pulse';
      case 'collect':
        return 'animate-spin';
      case 'draw':
        return 'animate-ping';
      default:
        return '';
    }
  };

  return (
    <div
      className={`
        fixed z-50 pointer-events-none transition-all duration-800 ease-in-out transform
        ${getAnimationClass()}
      `}
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) ${animationType === 'collect' ? 'scale(0.8)' : 'scale(1)'}`,
      }}
    >
      <CardComponent card={card} />
      
      {/* Effect overlay */}
      <div className={`
        absolute inset-0 rounded-xl pointer-events-none
        ${animationType === 'match' ? 'bg-yellow-400 bg-opacity-30 animate-pulse' : ''}
        ${animationType === 'collect' ? 'bg-green-400 bg-opacity-30 animate-ping' : ''}
        ${animationType === 'draw' ? 'bg-blue-400 bg-opacity-30 animate-bounce' : ''}
      `}></div>
    </div>
  );
}