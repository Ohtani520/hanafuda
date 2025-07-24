import React, { useEffect, useRef } from 'react';
import { ScrollText } from 'lucide-react';

interface GameLogProps {
  logs: string[];
}

export function GameLog({ logs }: GameLogProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg h-48">
      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <ScrollText className="w-5 h-5 text-purple-500" />
        ゲームログ
      </h3>
      
      <div className="h-32 overflow-y-auto bg-gray-50 rounded p-2 text-sm">
        {logs.map((log, index) => (
          <div 
            key={index} 
            className={`mb-1 ${
              log.includes('---') ? 'font-bold text-indigo-600 border-b border-indigo-200 pb-1' :
              log.includes('🎉') || log.includes('成立') ? 'text-green-600 font-semibold' :
              log.includes('⚠️') || log.includes('エラー') ? 'text-orange-600' :
              log.includes('🏁') || log.includes('終了') ? 'text-red-600 font-semibold' :
              log.includes('🔄') || log.includes('ターン') ? 'text-blue-600' :
              'text-gray-700'
            }`}
          >
            {log}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}