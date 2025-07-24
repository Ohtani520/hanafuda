import { Element, Card } from '../types/game';

export const ELEMENT_NAMES: Record<Element, string> = {
  H: '水素',
  O: '酸素',
  C: '炭素',
  N: '窒素',
  Cl: '塩素',
  F: 'フッ素',
  Na: 'ナトリウム',
  K: 'カリウム',
  Fe: '鉄',
  Cu: '銅',
  Ag: '銀',
  He: 'ヘリウム',
  Ne: 'ネオン',
  Ar: 'アルゴン',
  Mg: 'マグネシウム',
  Al: 'アルミニウム',
  Si: 'ケイ素',
  P: 'リン',
  S: '硫黄',
  Ca: 'カルシウム',
};

export const ELEMENT_COUNTS: Record<Element, number> = {
  H: 6,
  O: 5,
  C: 4,
  N: 3,
  Cl: 3,
  F: 3,
  Na: 2,
  K: 2,
  Fe: 2,
  Cu: 2,
  Ag: 1,
  He: 1,
  Ne: 1,
  Ar: 1,
  Mg: 1,
  Al: 1,
  Si: 1,
  P: 1,
  S: 1,
  Ca: 1,
};


export function createDeck(): Card[] {
  const deck: Card[] = [];
  let cardId = 0;

  Object.entries(ELEMENT_COUNTS).forEach(([element, count]) => {
    for (let i = 0; i < count; i++) {
      deck.push({
        id: `${element}-${cardId++}`,
        element: element as Element,
        isSelected: false,
      });
    }
  });

  return shuffleDeck(deck);
}

function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}