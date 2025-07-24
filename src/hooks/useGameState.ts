import { useState, useCallback, useEffect } from 'react';
import { GameState, Player, Card, GameAction } from '../types/game';
import { createDeck, ELEMENT_NAMES } from '../data/cards';
import { canMatch } from '../utils/matchLogic';
import { checkMoleculeFormation, calculateScore } from '../utils/moleculeLogic';

const INITIAL_HAND_SIZE = 8;
const INITIAL_FIELD_SIZE = 8;
const WINNING_MOLECULES = 3;

function createInitialPlayer(id: string, name: string): Player {
  return {
    id,
    name,
    hand: [],
    collectedCards: [],
    completedMolecules: [],
    score: 0,
    moleculeCount: 0,
  };
}

function dealCards(deck: Card[]): { playerHand: Card[], cpuHand: Card[], fieldCards: Card[], remainingDeck: Card[] } {
  const shuffledDeck = [...deck];
  
  const playerHand = shuffledDeck.splice(0, INITIAL_HAND_SIZE);
  const cpuHand = shuffledDeck.splice(0, INITIAL_HAND_SIZE);
  const fieldCards = shuffledDeck.splice(0, INITIAL_FIELD_SIZE);
  
  return {
    playerHand,
    cpuHand,
    fieldCards,
    remainingDeck: shuffledDeck,
  };
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const deck = createDeck();
    const { playerHand, cpuHand, fieldCards, remainingDeck } = dealCards(deck);
    
    const player = createInitialPlayer('player', 'プレイヤー');
    const cpu = createInitialPlayer('cpu', 'CPU');
    
    player.hand = playerHand;
    cpu.hand = cpuHand;
    
    return {
      players: [player, cpu],
      currentPlayerIndex: 0,
      fieldCards,
      deck: remainingDeck,
      selectedHandCard: null,
      selectedFieldCard: null,
      drawnCard: null,
      matchableDrawnCards: [],
      waitingForDrawnCardMatch: false,
      phase: 'playing',
      canFinish: false,
      gameLog: ['ゲーム開始！'],
      isProcessingCPU: false,
      animationState: {
        playingCard: null,
        matchingCards: [],
        collectingCards: [],
        isAnimating: false,
      },
    };
  });

  const dispatch = useCallback((action: GameAction) => {
    setGameState(prevState => {
      switch (action.type) {
        case 'SELECT_HAND_CARD': {
          const currentPlayer = prevState.players[prevState.currentPlayerIndex];
          const card = currentPlayer.hand.find(c => c.id === action.cardId);
          
          if (!card || prevState.currentPlayerIndex !== 0) return prevState; // Only player can select
          
          return {
            ...prevState,
            selectedHandCard: card,
            selectedFieldCard: null,
          };
        }

        case 'SELECT_FIELD_CARD': {
          if (prevState.currentPlayerIndex !== 0 || !prevState.selectedHandCard) return prevState;
          
          const card = prevState.fieldCards.find(c => c.id === action.cardId);
          if (!card) return prevState;
          
          return {
            ...prevState,
            selectedFieldCard: card,
          };
        }

        case 'SELECT_DRAWN_CARD_MATCH': {
          if (!prevState.waitingForDrawnCardMatch || !prevState.drawnCard) return prevState;
          
          const matchedCard = prevState.fieldCards.find(c => c.id === action.cardId);
          if (!matchedCard) return prevState;
          
          return processDrawnCardMatch(prevState, matchedCard);
        }

        case 'PLAY_TURN': {
          return playTurn(prevState);
        }

        case 'KOIKOI_CONTINUE': {
          return {
            ...prevState,
            phase: 'playing',
            currentPlayerIndex: (prevState.currentPlayerIndex + 1) % 2,
          };
        }

        case 'KOIKOI_FINISH': {
          return {
            ...prevState,
            phase: 'finished',
          };
        }

        case 'NEW_GAME': {
          const deck = createDeck();
          const { playerHand, cpuHand, fieldCards, remainingDeck } = dealCards(deck);
          
          const player = createInitialPlayer('player', 'プレイヤー');
          const cpu = createInitialPlayer('cpu', 'CPU');
          
          player.hand = playerHand;
          cpu.hand = cpuHand;
          
          return {
            players: [player, cpu],
            currentPlayerIndex: 0,
            fieldCards,
            deck: remainingDeck,
            selectedHandCard: null,
            selectedFieldCard: null,
            drawnCard: null,
            matchableDrawnCards: [],
            waitingForDrawnCardMatch: false,
            phase: 'playing',
            canFinish: false,
            gameLog: ['新しいゲーム開始！'],
            isProcessingCPU: false,
            animationState: {
              playingCard: null,
              matchingCards: [],
              collectingCards: [],
              isAnimating: false,
            },
          };
        }

        default:
          return prevState;
      }
    });
  }, []);

  // CPU turn processing
  useEffect(() => {
    if (gameState.currentPlayerIndex === 1 && gameState.phase === 'playing') {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, isProcessingCPU: true }));
        
        setTimeout(() => {
          dispatch({ type: 'PLAY_TURN' });
        }, 1500);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayerIndex, gameState.phase, dispatch]);

  return { gameState, dispatch };
}

function processDrawnCardMatch(state: GameState, matchedCard: Card): GameState {
  const newState = { ...state };
  const playerIndex = state.currentPlayerIndex;
  const currentPlayer = newState.players[playerIndex];
  
  if (!newState.drawnCard) return state;
  
  // Collect both cards
  const collectedCards = [newState.drawnCard, matchedCard];
  newState.players[playerIndex].collectedCards.push(...collectedCards);
  
  // Remove matched card from field
  newState.fieldCards = newState.fieldCards.filter(card => card.id !== matchedCard.id);
  
  // Log the match
  if (newState.drawnCard.element === matchedCard.element) {
    newState.gameLog.push(`✅ 山札カードが同じ元素でマッチ: ${newState.drawnCard.element} + ${matchedCard.element}`);
  } else {
    newState.gameLog.push(`⚗️ 山札カードが分子ペアでマッチ: ${newState.drawnCard.element} + ${matchedCard.element}`);
  }
  newState.gameLog.push(`📥 2枚のカードを獲得しました`);
  
  // Clear drawn card state
  newState.drawnCard = null;
  newState.matchableDrawnCards = [];
  newState.waitingForDrawnCardMatch = false;
  
  // Continue with molecule check and turn end
  return finalizeTurn(newState);
}

function playTurn(state: GameState): GameState {
  const currentPlayer = state.players[state.currentPlayerIndex];
  const isPlayerTurn = state.currentPlayerIndex === 0;
  
  let selectedHandCard: Card | null = null;
  let selectedFieldCard: Card | null = null;
  
  if (isPlayerTurn) {
    selectedHandCard = state.selectedHandCard;
    selectedFieldCard = state.selectedFieldCard;
    
    if (!selectedHandCard) return state;
  } else {
    // CPU logic
    selectedHandCard = selectCPUCard(currentPlayer, state.fieldCards);
    if (selectedHandCard) {
      const matchableCards = state.fieldCards.filter(card => canMatch(selectedHandCard!, card));
      selectedFieldCard = matchableCards.length > 0 ? matchableCards[0] : null;
    }
  }
  
  if (!selectedHandCard) return state;
  
  const newState = { ...state };
  const playerIndex = state.currentPlayerIndex;
  
  // ターン開始ログ
  newState.gameLog.push(`--- ${currentPlayer.name}のターン開始 ---`);
  newState.gameLog.push(`手札から${selectedHandCard.element}(${ELEMENT_NAMES[selectedHandCard.element]})を選択`);
  // Remove hand card
  newState.players[playerIndex].hand = newState.players[playerIndex].hand.filter(
    card => card.id !== selectedHandCard!.id
  );
  
  // Collect cards
  const collectedCards = [selectedHandCard];
  
  if (selectedFieldCard && canMatch(selectedHandCard, selectedFieldCard)) {
    collectedCards.push(selectedFieldCard);
    newState.fieldCards = newState.fieldCards.filter(card => card.id !== selectedFieldCard!.id);
    if (selectedHandCard.element === selectedFieldCard.element) {
      newState.gameLog.push(`✅ 同じ元素でマッチ: ${selectedHandCard.element} + ${selectedFieldCard.element}`);
    } else {
      newState.gameLog.push(`⚗️ 分子ペアでマッチ: ${selectedHandCard.element} + ${selectedFieldCard.element}`);
    }
    newState.gameLog.push(`📥 2枚のカードを獲得しました`);
  } else {
    newState.fieldCards.push(selectedHandCard);
    newState.gameLog.push(`🎴 ${selectedHandCard.element}を場に出しました（マッチなし）`);
  }
  
  // Draw from deck
  if (newState.deck.length > 0) {
    const drawnCard = newState.deck.shift()!;
    newState.gameLog.push(`🎲 山札から${drawnCard.element}(${ELEMENT_NAMES[drawnCard.element]})を引きました`);
    const matchableFieldCards = newState.fieldCards.filter(card => canMatch(drawnCard, card));
    
    if (matchableFieldCards.length > 0) {
      const matchedCard = matchableFieldCards[0];
      collectedCards.push(drawnCard, matchedCard);
      newState.fieldCards = newState.fieldCards.filter(card => card.id !== matchedCard.id);
      if (drawnCard.element === matchedCard.element) {
        newState.gameLog.push(`✅ 山札カードが同じ元素でマッチ: ${drawnCard.element} + ${matchedCard.element}`);
      } else {
        newState.gameLog.push(`⚗️ 山札カードが分子ペアでマッチ: ${drawnCard.element} + ${matchedCard.element}`);
      }
      newState.gameLog.push(`📥 さらに2枚のカードを獲得しました`);
    } else {
      newState.fieldCards.push(drawnCard);
      newState.gameLog.push(`🎴 山札の${drawnCard.element}を場に出しました（マッチなし）`);
    }
  } else {
    newState.gameLog.push(`📦 山札が空です`);
  }
  
  // Add collected cards
  if (collectedCards.length > 1) {
    newState.gameLog.push(`🎯 このターンで合計${collectedCards.length}枚のカードを獲得`);
  }
  newState.players[playerIndex].collectedCards.push(...collectedCards);
  
  // Check molecule formation
  const molecules = checkMoleculeFormation(newState.players[playerIndex].collectedCards);
  const newMolecules = molecules.slice(newState.players[playerIndex].completedMolecules.length);
  
  if (newMolecules.length > 0) {
    newState.gameLog.push(`🧪 --- 分子成立チェック ---`);
    newState.players[playerIndex].completedMolecules = molecules;
    newState.players[playerIndex].score = calculateScore(molecules);
    newState.players[playerIndex].moleculeCount = molecules.length;
    
    newMolecules.forEach(molecule => {
      newState.gameLog.push(`🎉 ${molecule.emoji} ${molecule.name}(${molecule.formula})が成立！ +${molecule.points}点`);
    });
    
    newState.gameLog.push(`📊 現在の成立分子数: ${molecules.length}個 (合計${newState.players[playerIndex].score}点)`);
    
    // Check if player can finish
    if (molecules.length >= WINNING_MOLECULES) {
      newState.canFinish = true;
      if (isPlayerTurn) {
        newState.phase = 'koikoi';
        newState.gameLog.push(`🎴 上がり条件達成！ ${molecules.length}分子成立でこいこいを選択できます`);
      } else {
        // CPU decides to continue or finish
        const shouldFinish = molecules.length >= 4 || Math.random() > 0.4; // Higher chance to finish with more molecules
        if (shouldFinish) {
          newState.phase = 'finished';
          newState.gameLog.push(`🤖 CPUは${molecules.length}分子で上がりを選択！`);
        } else {
          newState.gameLog.push(`🤖 CPUはこいこいを選択（ゲーム継続）`);
        }
      }
    } else if (molecules.length > 0 && isPlayerTurn) {
      newState.gameLog.push(`⚠️ ${molecules.length}分子成立。上がりには3分子以上必要です`);
    }
  } else {
    newState.gameLog.push(`🔍 分子成立チェック: 新しい分子は成立しませんでした`);
  }
  
  return finalizeTurn(newState);
}

function finalizeTurn(state: GameState): GameState {
  const newState = { ...state };
  const playerIndex = state.currentPlayerIndex;
  const currentPlayer = newState.players[playerIndex];
  const isPlayerTurn = playerIndex === 0;
  
  // Check game end conditions
  if (newState.players[playerIndex].hand.length === 0 || newState.deck.length === 0) {
    newState.gameLog.push(`🏁 ゲーム終了条件に達しました`);
    newState.phase = 'finished';
  }
  
  newState.gameLog.push(`--- ${currentPlayer.name}のターン終了 ---`);
  
  // Reset selections and move to next player
  newState.selectedHandCard = null;
  newState.selectedFieldCard = null;
  newState.isProcessingCPU = false;
  
  if (newState.phase === 'playing') {
    newState.currentPlayerIndex = (newState.currentPlayerIndex + 1) % 2;
    const nextPlayer = newState.players[newState.currentPlayerIndex];
    newState.gameLog.push(`🔄 ${nextPlayer.name}のターンです`);
  }
  
  return newState;
}

function selectCPUCard(cpu: Player, fieldCards: Card[]): Card | null {
  // Simple AI: prefer cards that can match with field cards
  for (const handCard of cpu.hand) {
    const hasMatch = fieldCards.some(fieldCard => canMatch(handCard, fieldCard));
    if (hasMatch) {
      return handCard;
    }
  }
  
  // If no matches, return first card
  return cpu.hand[0] || null;
}