import { Card, Element } from '../types/game';
import { BINARY_PAIRS } from '../data/molecules';

export function canMatch(handCard: Card, fieldCard: Card): boolean {
  // 同じ元素同士
  if (handCard.element === fieldCard.element) {
    return true;
  }

  // 分子が成立する2原子ペア
  return BINARY_PAIRS.some(([elem1, elem2]) => 
    (handCard.element === elem1 && fieldCard.element === elem2) ||
    (handCard.element === elem2 && fieldCard.element === elem1)
  );
}

export function getMatchableCards(handCard: Card, fieldCards: Card[]): Card[] {
  return fieldCards.filter(fieldCard => canMatch(handCard, fieldCard));
}