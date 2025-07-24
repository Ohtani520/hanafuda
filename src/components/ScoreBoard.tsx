import React from 'react';
import { Player } from '../types/game';
import { Beaker, Trophy, Target } from 'lucide-react';

interface ScoreBoardProps {
  players: Player[];
  currentPlayerIndex: number;
}

export function ScoreBoard({ players, currentPlayerIndex }: ScoreBoardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        🏆 スコアボード
      </h3>
      
      <div className="space-y-3">
        {players.map((player, index) => (
          <div
            key={player.id}
            className={`
              p-4 rounded-xl transition-all duration-300 transform
              ${index === currentPlayerIndex 
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-400 shadow-md scale-105' 
                : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }
            `}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-800 flex items-center gap-2">
                {index === 0 ? '👤' : '🤖'}
                {player.name}
                {index === currentPlayerIndex && (
                  <span className="ml-2 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full animate-pulse">
                    ターン中
                  </span>
                )}
              </span>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {player.score}点
              </span>
            </div>
            
            <div className="flex gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Beaker className="w-4 h-4 text-green-500" />
                <span>{player.moleculeCount}分子</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4 text-blue-500" />
                <span>{player.collectedCards.length}枚</span>
              </div>
            </div>
            
            {/* Progress bar for winning condition */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>上がり条件</span>
                <span>{player.moleculeCount}/3分子</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    player.moleculeCount >= 3 
                      ? 'bg-gradient-to-r from-green-400 to-green-600' 
                      : 'bg-gradient-to-r from-blue-400 to-blue-600'
                  }`}
                  style={{ width: `${Math.min((player.moleculeCount / 3) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}