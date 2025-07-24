import React from 'react';
import { Card as CardComponent } from './Card';
import { Card, Player } from '../types/game';

interface PlayerHandProps {
  player: Player;
  selectedCard: Card | null;
  onCardSelect: (cardId: string) => void;
  isCurrentPlayer: boolean;
  isPlayerTurn: boolean;
}

export function PlayerHand({ player, selectedCard, onCardSelect, isCurrentPlayer, isPlayerTurn }: PlayerHandProps) {
  const canInteract = isCurrentPlayer && isPlayerTurn;
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-3">
        {player.name}の手札
      </h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {player.hand.map((card) => (
          <CardComponent
            key={card.id}
            card={card}
            isSelected={selectedCard?.id === card.id}
            onClick={canInteract ? () => onCardSelect(card.id) : undefined}
            disabled={!canInteract}
          />
        ))}
      </div>
    </div>
  );
}