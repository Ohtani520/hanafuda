import React from 'react';
import { Play, RotateCcw, Award } from 'lucide-react';
import { ELEMENT_NAMES } from '../data/cards';

interface GameControlsProps {
  selectedHandCard: any;
  selectedFieldCard: any;
  canPlay: boolean;
  canFinish: boolean;
  phase: string;
  waitingForDrawnCardMatch: boolean;
  onPlayTurn: () => void;
  onKoikoiContinue: () => void;
  onKoikoiFinish: () => void;
  onNewGame: () => void;
  isProcessingCPU: boolean;
}

export function GameControls({
  selectedHandCard,
  selectedFieldCard,
  canPlay,
  canFinish,
  phase,
  waitingForDrawnCardMatch,
  onPlayTurn,
  onKoikoiContinue,
  onKoikoiFinish,
  onNewGame,
  isProcessingCPU
}: GameControlsProps) {
  if (waitingForDrawnCardMatch) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-bold text-yellow-800 mb-3">
          🎯 山札カードのマッチ選択中
        </h3>
        <p className="text-sm text-yellow-700">
          引いたカードとマッチする場札を選択してください
        </p>
      </div>
    );
  }
  
  if (phase === 'koikoi') {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-bold text-yellow-800 mb-3">
          🎴 こいこい選択
        </h3>
        <p className="text-sm text-yellow-700 mb-4">
          分子が成立しました！🧪<br/>
          続けてより多くの分子を狙いますか？それとも今の成果で上がりますか？
        </p>
        <div className="flex gap-3">
          <button
            onClick={onKoikoiContinue}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Play className="w-4 h-4" />
            こいこい（続行）
          </button>
          {canFinish && (
            <button
              onClick={onKoikoiFinish}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Award className="w-4 h-4" />
            2. 場札をクリックして取るか、そのまま場に出します
            </button>
          )}
        </div>
        {!canFinish && (
          <p className="text-xs text-red-600 mt-3 text-center bg-red-50 p-2 rounded border border-red-200">
            場札の<span className="font-bold">{selectedFieldCard.element}({ELEMENT_NAMES[selectedFieldCard.element]})</span>とマッチします
          </p>
        )}
      </div>
    );
  }

  if (phase === 'finished') {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-bold text-green-800 mb-3">
          🏆 ゲーム終了
        </h3>
        <button
          onClick={onNewGame}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <RotateCcw className="w-4 h-4" />
          新しいゲーム
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-3">
        🎮 ゲーム操作
      </h3>
      
      {isProcessingCPU ? (
        <div className="text-center py-6">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">🤖 CPUが考え中...</p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {selectedHandCard ? (
              <p className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                手札から<span className="font-bold text-blue-600">{selectedHandCard.element}</span>を選択
              </p>
            ) : (
              <p className="flex items-center gap-2">
                <span className="text-orange-500">👆</span>
                手札からカードを選択してください
              </p>
            )}
            {selectedHandCard && !selectedFieldCard && (
              <p className="flex items-center gap-2 mt-2 text-blue-600">
                <span>🎯</span>
                場札をクリックして取るか、空いた場所に出します
              </p>
            )}
            {selectedHandCard && selectedFieldCard && (
              <p className="flex items-center gap-2 mt-2 text-green-600">
                <span>⚡</span>
                場札の<span className="font-bold">{selectedFieldCard.element}</span>とマッチ
              </p>
            )}
          </div>

          <button
            onClick={onPlayTurn}
            disabled={!canPlay}
            className={`
              w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md
              ${canPlay 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-lg transform hover:scale-105' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
              }
            `}
          >
            <Play className="w-4 h-4" />
            ターン実行
          </button>
        </>
      )}
    </div>
  );
}