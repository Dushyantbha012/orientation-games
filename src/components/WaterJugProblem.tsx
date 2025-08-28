'use client';

import { useState } from 'react';

interface JugState {
  current: number;
  capacity: number;
}

export default function WaterJugProblem() {
  const [jugA, setJugA] = useState<JugState>({ current: 0, capacity: 5 });
  const [jugB, setJugB] = useState<JugState>({ current: 0, capacity: 3 });
  const [moves, setMoves] = useState<string[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [dragSource, setDragSource] = useState<'A' | 'B' | null>(null);
  
  const target = 4;

  const addMove = (move: string) => {
    setMoves(prev => [...prev, move]);
  };

  const checkSolution = (newJugA: number, newJugB: number) => {
    if (newJugA === target || newJugB === target) {
      setIsSolved(true);
    }
  };

  const fillJugA = () => {
    setJugA(prev => ({ ...prev, current: prev.capacity }));
    addMove(`Fill Jug A (5L) completely`);
    checkSolution(jugA.capacity, jugB.current);
  };

  const fillJugB = () => {
    setJugB(prev => ({ ...prev, current: prev.capacity }));
    addMove(`Fill Jug B (3L) completely`);
    checkSolution(jugA.current, jugB.capacity);
  };

  const emptyJugA = () => {
    setJugA(prev => ({ ...prev, current: 0 }));
    addMove(`Empty Jug A (5L)`);
    checkSolution(0, jugB.current);
  };

  const emptyJugB = () => {
    setJugB(prev => ({ ...prev, current: 0 }));
    addMove(`Empty Jug B (3L)`);
    checkSolution(jugA.current, 0);
  };

  const handleDragStart = (e: React.DragEvent, source: 'A' | 'B') => {
    const sourceJug = source === 'A' ? jugA : jugB;
    if (sourceJug.current > 0) {
      setDragSource(source);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', source);
    } else {
      e.preventDefault();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, target: 'A' | 'B') => {
    e.preventDefault();
    const source = e.dataTransfer.getData('text/plain') as 'A' | 'B';
    
    if (source === target) return; // Can't pour into same jug
    
    if (source === 'A' && target === 'B') {
      pourAtoB();
    } else if (source === 'B' && target === 'A') {
      pourBtoA();
    }
    
    setDragSource(null);
  };

  const handleDragEnd = () => {
    setDragSource(null);
  };

  const pourAtoB = () => {
    const amount = Math.min(jugA.current, jugB.capacity - jugB.current);
    if (amount > 0) {
      const newJugA = jugA.current - amount;
      const newJugB = jugB.current + amount;
      setJugA(prev => ({ ...prev, current: newJugA }));
      setJugB(prev => ({ ...prev, current: newJugB }));
      addMove(`Pour ${amount}L from Jug A to Jug B`);
      checkSolution(newJugA, newJugB);
    }
  };

  const pourBtoA = () => {
    const amount = Math.min(jugB.current, jugA.capacity - jugA.current);
    if (amount > 0) {
      const newJugA = jugA.current + amount;
      const newJugB = jugB.current - amount;
      setJugA(prev => ({ ...prev, current: newJugA }));
      setJugB(prev => ({ ...prev, current: newJugB }));
      addMove(`Pour ${amount}L from Jug B to Jug A`);
      checkSolution(newJugA, newJugB);
    }
  };

  const resetPuzzle = () => {
    setJugA({ current: 0, capacity: 5 });
    setJugB({ current: 0, capacity: 3 });
    setMoves([]);
    setIsSolved(false);
  };

  const showSolution = () => {
    // One optimal solution
    const solution = [
      "Fill Jug A (5L) completely",
      "Pour 3L from Jug A to Jug B",
      "Empty Jug B (3L)",
      "Pour 2L from Jug A to Jug B",
      "Fill Jug A (5L) completely",
      "Pour 1L from Jug A to Jug B (filling it)",
      "Now Jug A has exactly 4L!"
    ];
    
    setMoves(solution);
    setJugA({ current: 4, capacity: 5 });
    setJugB({ current: 3, capacity: 3 });
    setIsSolved(true);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">🪣 Water Jug Problem</h2>
        <p className="text-gray-600 mb-4">
          You have a 5-liter jug and a 3-liter jug. Your goal is to measure exactly {target} liters of water.
          You can fill, empty, and pour water between the jugs.
        </p>
        {isSolved && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            🎉 Congratulations! You have exactly {target} liters in one of the jugs!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
        {/* Jug A */}
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">Jug A (5 Liters)</h3>
          <div 
            className={`relative mx-auto w-32 h-48 bg-gray-200 border-4 border-gray-400 rounded-lg overflow-hidden cursor-pointer transition-all ${
              dragSource === 'A' ? 'opacity-50' : 'hover:border-blue-400'
            }`}
            draggable={jugA.current > 0}
            onDragStart={(e) => handleDragStart(e, 'A')}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'A')}
            onDragEnd={handleDragEnd}
          >
            <div 
              className="absolute bottom-0 w-full bg-blue-400 transition-all duration-500"
              style={{ height: `${(jugA.current / jugA.capacity) * 100}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-700">
                {jugA.current}L
              </span>
            </div>
            {jugA.current > 0 && (
              <div className="absolute top-2 right-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                Drag to pour
              </div>
            )}
          </div>
          <div className="mt-4 space-y-2">
            <button 
              onClick={fillJugA}
              disabled={jugA.current === jugA.capacity}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded transition-colors"
            >
              Fill from Tap
            </button>
            <button 
              onClick={emptyJugA}
              disabled={jugA.current === 0}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white px-4 py-2 rounded transition-colors"
            >
              Empty
            </button>
          </div>
        </div>

        {/* Jug B */}
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">Jug B (3 Liters)</h3>
          <div 
            className={`relative mx-auto w-32 h-48 bg-gray-200 border-4 border-gray-400 rounded-lg overflow-hidden cursor-pointer transition-all ${
              dragSource === 'B' ? 'opacity-50' : 'hover:border-green-400'
            }`}
            draggable={jugB.current > 0}
            onDragStart={(e) => handleDragStart(e, 'B')}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'B')}
            onDragEnd={handleDragEnd}
          >
            <div 
              className="absolute bottom-0 w-full bg-green-400 transition-all duration-500"
              style={{ height: `${(jugB.current / jugB.capacity) * 100}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-700">
                {jugB.current}L
              </span>
            </div>
            {jugB.current > 0 && (
              <div className="absolute top-2 right-2 text-xs bg-green-500 text-white px-2 py-1 rounded">
                Drag to pour
              </div>
            )}
          </div>
          <div className="mt-4 space-y-2">
            <button 
              onClick={fillJugB}
              disabled={jugB.current === jugB.capacity}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded transition-colors"
            >
              Fill from Tap
            </button>
            <button 
              onClick={emptyJugB}
              disabled={jugB.current === 0}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white px-4 py-2 rounded transition-colors"
            >
              Empty
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mb-8 p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-800">
          <strong>How to play:</strong> Click "Fill from Tap" to fill a jug, "Empty" to empty it, 
          or drag and drop from one jug to another to pour water between them.
        </p>
      </div>

      {/* Control buttons */}
      <div className="text-center space-x-4 mb-8">
        <button
          onClick={showSolution}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Show Solution
        </button>
        <button
          onClick={resetPuzzle}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Reset Puzzle
        </button>
      </div>

      {/* Moves history */}
      {moves.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Move History:</h3>
          <div className="space-y-2">
            {moves.map((move, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <span className="text-gray-700">{move}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
