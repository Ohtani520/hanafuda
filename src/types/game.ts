export type Element = 'H' | 'O' | 'C' | 'N' | 'Cl' | 'F' | 'Na' | 'K' | 'Fe' | 'Cu' | 'Ag' | 'He' | 'Ne' | 'Ar' | 'Mg' | 'Al' | 'Si' | 'P' | 'S' | 'Ca';

export interface Card {
  id: string;
  element: Element;
  isSelected: boolean;
}

export interface Molecule {
  name: string;
  formula: string;
  elements: { [key in Element]?: number };
  requiredCards: number;
  points: number;
  emoji: string;
  color: string;
}

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  collectedCards: Card[];
  completedMolecules: Molecule[];
  score: number;
  moleculeCount: number;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  fieldCards: Card[];
  deck: Card[];
  selectedHandCard: Card | null;
  selectedFieldCard: Card | null;
  drawnCard: Card | null;
  matchableDrawnCards: Card[];
  waitingForDrawnCardMatch: boolean;
  phase: 'playing' | 'koikoi' | 'finished';
  canFinish: boolean;
  gameLog: string[];
  isProcessingCPU: boolean;
  animationState: {
    playingCard: Card | null;
    matchingCards: Card[];
    collectingCards: Card[];
    isAnimating: boolean;
  };
}

export type GameAction = 
  | { type: 'SELECT_HAND_CARD'; cardId: string }
  | { type: 'SELECT_FIELD_CARD'; cardId: string }
  | { type: 'SELECT_DRAWN_CARD_MATCH'; cardId: string }
  | { type: 'PLAY_TURN' }
  | { type: 'KOIKOI_CONTINUE' }
  | { type: 'KOIKOI_FINISH' }