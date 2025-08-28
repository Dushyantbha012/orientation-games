'use client';

import { useState } from 'react';
import PuzzleSelector from '@/components/PuzzleSelector';
import MislabeledJars from '@/components/MislabeledJars';
import WaterJugProblem from '@/components/WaterJugProblem';
//import BurningRope from '@/components/BurningRope';
import TowerOfHanoi from '@/components/TowerOfHanoi';

export type PuzzleType = 'jars' | 'jugs' | 'ropes' | 'hanoi' | null;

export default function Home() {
  const [activePuzzle, setActivePuzzle] = useState<PuzzleType>(null);

  const renderPuzzle = () => {
    switch (activePuzzle) {
      case 'jars':
        return <MislabeledJars />;
      case 'jugs':
        return <WaterJugProblem />;
      // case 'ropes':
      //   return <BurningRope />;
      case 'hanoi':
        return <TowerOfHanoi />;
      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">
              Welcome to Classic Puzzles
            </h2>
            <p className="text-gray-600">
              Select a puzzle above to start playing!
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Classic Logic Puzzles
          </h1>
          <p className="text-lg text-gray-600">
            Challenge your mind with these timeless brain teasers
          </p>
        </header>

        <PuzzleSelector 
          activePuzzle={activePuzzle} 
          setActivePuzzle={setActivePuzzle} 
        />

        <main className="mt-8">
          {renderPuzzle()}
        </main>
      </div>
    </div>
  );
}
