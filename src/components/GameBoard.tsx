import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { PlayerHand } from './PlayerHand';
import { FieldCards } from './FieldCards';
import { DeckDisplay } from './DeckDisplay';
import { DrawnCardMatcher } from './DrawnCardMatcher';
import { ScoreBoard } from './ScoreBoard';
import { MoleculeList } from './MoleculeList';
import { GameLog } from './GameLog';
import { GameControls } from './GameControls';
import { Atom } from 'lucide-react';

export function GameBoard() {
  const { gameState, dispatch } = useGameState();
  
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isPlayerTurn = gameState.currentPlayerIndex === 0;
  const canPlay = isPlayerTurn && gameState.selectedHandCard !== null && gameState.phase === 'playing';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      {/* Drawn Card Match Selection Modal */}
      {gameState.waitingForDrawnCardMatch && gameState.drawnCard && (
        <DrawnCardMatcher
          drawnCard={gameState.drawnCard}
          fieldCards={gameState.matchableDrawnCards}
          onSelectMatch={(cardId) => dispatch({ type: 'SELECT_DRAWN_CARD_MATCH', cardId })}
          onSkipMatch={() => dispatch({ type: 'SELECT_DRAWN_CARD_MATCH', cardId: '' })}
        />
      )}
      
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Atom className="w-10 h-10 text-blue-300" />
          化学花札
          <Atom className="w-10 h-10 text-blue-300" />
        </h1>
        <p className="text-blue-200">元素を組み合わせて分子を作るカードゲーム</p>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Game State */}
          <div className="space-y-4">
            <ScoreBoard players={gameState.players} currentPlayerIndex={gameState.currentPlayerIndex} />
            <DeckDisplay 
              deckCount={gameState.deck.length} 
              drawnCard={gameState.drawnCard}
              isAnimating={gameState.animationState.isAnimating}
            />
            <MoleculeList 
              molecules={gameState.players[0].completedMolecules} 
              title="プレイヤーの分子"
            />
            <MoleculeList 
              molecules={gameState.players[1].completedMolecules} 
              title="CPUの分子"
            />
          </div>
          
          {/* Center Column - Game Field */}
          <div className="space-y-6">
            {/* CPU Hand */}
            <PlayerHand
              player={gameState.players[1]}
              selectedCard={null}
              onCardSelect={() => {}}
              isCurrentPlayer={false}
              isPlayerTurn={false}
            />
            
            {/* Field Cards */}
            <FieldCards
              cards={gameState.fieldCards}
              selectedHandCard={gameState.selectedHandCard}
              selectedFieldCard={gameState.selectedFieldCard}
              onCardSelect={(cardId) => dispatch({ type: 'SELECT_FIELD_CARD', cardId })}
              isPlayerTurn={isPlayerTurn}
            />
            
            {/* Player Hand */}
            <PlayerHand
              player={gameState.players[0]}
              selectedCard={gameState.selectedHandCard}
              onCardSelect={(cardId) => dispatch({ type: 'SELECT_HAND_CARD', cardId })}
              isCurrentPlayer={isPlayerTurn}
              isPlayerTurn={isPlayerTurn}
            />
          </div>
          
          {/* Right Column - Controls & Log */}
          <div className="space-y-4">
            <GameControls
              selectedHandCard={gameState.selectedHandCard}
              selectedFieldCard={gameState.selectedFieldCard}
              canPlay={canPlay}
              canFinish={gameState.canFinish}
              phase={gameState.phase}
              waitingForDrawnCardMatch={gameState.waitingForDrawnCardMatch}
              onPlayTurn={() => dispatch({ type: 'PLAY_TURN' })}
              onKoikoiContinue={() => dispatch({ type: 'KOIKOI_CONTINUE' })}
              onKoikoiFinish={() => dispatch({ type: 'KOIKOI_FINISH' })}
              onNewGame={() => dispatch({ type: 'NEW_GAME' })}
              isProcessingCPU={gameState.isProcessingCPU}
            />
            <GameLog logs={gameState.gameLog} />
            
            {/* Game Stats */}
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-2">ゲーム状況</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>山札:</span>
                  <span className="font-bold">{gameState.deck.length}枚</span>
                </div>
                <div className="flex justify-between">
                  <span>場札:</span>
                  <span className="font-bold">{gameState.fieldCards.length}枚</span>
                </div>
                <div className="flex justify-between">
                  <span>フェーズ:</span>
                  <span className="font-bold">{
                  gameState.phase === 'playing' ? '対戦中' :
                  gameState.phase === 'koikoi' ? 'こいこい選択' : 'ゲーム終了'
                  }</span>
                </div>
                <div className="flex justify-between">
                  <span>現在のプレイヤー:</span>
                  <span className="font-bold">{currentPlayer.name}</span>
                </div>
                {gameState.isProcessingCPU && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-center">
                    <div className="text-blue-600 text-xs">🤖 CPU思考中...</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}