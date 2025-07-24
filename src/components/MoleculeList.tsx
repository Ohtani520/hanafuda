import React from 'react';
import { Molecule } from '../types/game';
import { Atom } from 'lucide-react';

interface MoleculeListProps {
  molecules: Molecule[];
  title: string;
}

export function MoleculeList({ molecules, title }: MoleculeListProps) {
  const moleculeCounts = molecules.reduce((acc, molecule) => {
    acc[molecule.formula] = (acc[molecule.formula] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const uniqueMolecules = molecules.filter((molecule, index, self) => 
    self.findIndex(m => m.formula === molecule.formula) === index
  );

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <Atom className="w-5 h-5 text-green-500" />
        {title}
      </h3>
      
      {uniqueMolecules.length === 0 ? (
        <p className="text-gray-500 italic">まだ分子が成立していません</p>
      ) : (
        <div className="space-y-2">
          {uniqueMolecules.map((molecule) => {
            const count = moleculeCounts[molecule.formula];
            const totalPoints = molecule.points * count;
            
            return (
              <div
                key={molecule.formula}
                className={`relative overflow-hidden rounded-lg border-2 border-opacity-30 p-3 bg-gradient-to-r ${molecule.color} text-white shadow-md hover:shadow-lg transition-all duration-200`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{molecule.emoji}</div>
                  <div className="flex-1">
                    <div className="font-bold text-lg">
                      {molecule.name}
                    </div>
                    <div className="text-sm opacity-90 font-mono">
                      {molecule.formula}
                      {count > 1 && <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded">×{count}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {totalPoints}
                    </div>
                    <div className="text-xs opacity-75">
                      点
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -mr-8 -mt-8"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 bg-white bg-opacity-10 rounded-full -ml-4 -mb-4"></div>
              </div>
            );
          })}
          
          {/* Summary */}
          <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
            <div className="flex justify-between items-center">
              <div className="text-sm font-semibold text-indigo-800">
                合計: {uniqueMolecules.length}種類の分子
              </div>
              <div className="text-lg font-bold text-indigo-600">
                {uniqueMolecules.reduce((total, molecule) => {
                  const count = moleculeCounts[molecule.formula];
                  return total + (molecule.points * count);
                }, 0)}点
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}