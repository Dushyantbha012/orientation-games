'use client';

import { useState, useEffect, useRef } from 'react';

interface Rope {
  id: number;
  leftEnd: 'unlit' | 'burning' | 'burned';
  rightEnd: 'unlit' | 'burning' | 'burned';
  leftProgress: number; // 0-100
  rightProgress: number; // 0-100
  totalBurnTime: number; // in seconds (scaled down for demo)
  burnPoints: { position: number; active: boolean }[]; // For middle burning points
}

export default function BurningRope() {
  const [ropes, setRopes] = useState<Rope[]>([
    { id: 1, leftEnd: 'unlit', rightEnd: 'unlit', leftProgress: 0, rightProgress: 0, totalBurnTime: 60, burnPoints: [] },
    { id: 2, leftEnd: 'unlit', rightEnd: 'unlit', leftProgress: 0, rightProgress: 0, totalBurnTime: 60, burnPoints: [] }
  ]);
  
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [targetTime] = useState(45); // 45 minutes (scaled to 45 seconds for demo)
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1;
          if (newTime === targetTime) {
            setIsSolved(true);
          }
          return newTime;
        });
        
        setRopes(prev => prev.map(rope => {
          const newRope = { ...rope };
          
          // Calculate burn progress for each end
          if (rope.leftEnd === 'burning') {
            newRope.leftProgress = Math.min(100, rope.leftProgress + (100 / rope.totalBurnTime));
            if (newRope.leftProgress >= 100) {
              newRope.leftEnd = 'burned';
            }
          }
          
          if (rope.rightEnd === 'burning') {
            newRope.rightProgress = Math.min(100, rope.rightProgress + (100 / rope.totalBurnTime));
            if (newRope.rightProgress >= 100) {
              newRope.rightEnd = 'burned';
            }
          }

          // Calculate burn progress for middle burn points
          newRope.burnPoints = rope.burnPoints.map(point => {
            if (point.active) {
              // Burn spreads in both directions from the middle point
              const burnSpeed = 100 / rope.totalBurnTime;
              // This would need more complex logic to handle middle burning
              return point;
            }
            return point;
          });
          
          return newRope;
        }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, targetTime]);

  const lightRope = (ropeId: number, end: 'left' | 'right') => {
    setRopes(prev => prev.map(rope => {
      if (rope.id === ropeId) {
        const newRope = { ...rope };
        if (end === 'left' && rope.leftEnd === 'unlit') {
          newRope.leftEnd = 'burning';
        } else if (end === 'right' && rope.rightEnd === 'unlit') {
          newRope.rightEnd = 'burning';
        }
        return newRope;
      }
      return rope;
    }));
    
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const lightRopeAtPosition = (ropeId: number, clickPosition: number) => {
    // clickPosition is between 0 and 1 (0 = left end, 1 = right end)
    if (clickPosition <= 0.1) {
      // Click near left end
      lightRope(ropeId, 'left');
    } else if (clickPosition >= 0.9) {
      // Click near right end  
      lightRope(ropeId, 'right');
    } else {
      // Click in middle - light from both directions
      setRopes(prev => prev.map(rope => {
        if (rope.id === ropeId) {
          const newRope = { ...rope };
          if (rope.leftEnd === 'unlit') newRope.leftEnd = 'burning';
          if (rope.rightEnd === 'unlit') newRope.rightEnd = 'burning';
          // Also reduce burn time since it burns from both ends
          newRope.totalBurnTime = Math.max(15, rope.totalBurnTime / 2);
          return newRope;
        }
        return rope;
      }));
      
      if (!isRunning) {
        setIsRunning(true);
      }
    }
  };

  const resetPuzzle = () => {
    setRopes([
      { id: 1, leftEnd: 'unlit', rightEnd: 'unlit', leftProgress: 0, rightProgress: 0, totalBurnTime: 60, burnPoints: [] },
      { id: 2, leftEnd: 'unlit', rightEnd: 'unlit', leftProgress: 0, rightProgress: 0, totalBurnTime: 60, burnPoints: [] }
    ]);
    setElapsedTime(0);
    setIsRunning(false);
    setIsSolved(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const showSolution = () => {
    // Demonstrate the solution: light rope 1 from both ends, rope 2 from one end
    setRopes([
      { id: 1, leftEnd: 'burning', rightEnd: 'burning', leftProgress: 0, rightProgress: 0, totalBurnTime: 30, burnPoints: [] }, // Burns twice as fast
      { id: 2, leftEnd: 'burning', rightEnd: 'unlit', leftProgress: 0, rightProgress: 0, totalBurnTime: 60, burnPoints: [] }
    ]);
    setElapsedTime(0);
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const getRopeColor = (progress: number, leftEnd: string, rightEnd: string) => {
    if (leftEnd === 'burning' || rightEnd === 'burning') {
      return 'from-red-600 to-orange-400';
    } else if (leftEnd === 'burned' && rightEnd === 'burned') {
      return 'from-gray-400 to-gray-600';
    }
    return 'from-amber-600 to-amber-800';
  };

  const getRemainingLength = (rope: Rope) => {
    const leftBurn = rope.leftProgress;
    const rightBurn = rope.rightProgress;
    return Math.max(0, 100 - leftBurn - rightBurn);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">🔥 Burning Rope Puzzle</h2>
        <p className="text-gray-600 mb-4">
          You have two ropes that each burn for exactly 60 seconds, but they burn unevenly (non-linearly). 
          Your goal is to measure exactly {targetTime} seconds. Click anywhere on a rope to light it - 
          clicking near the ends lights one end, clicking in the middle lights both ends simultaneously!
        </p>
      </div>

      <div className="text-center mb-8">
        <div className="text-4xl font-bold mb-2">
          ⏰ {elapsedTime}s / {targetTime}s
        </div>
        {isSolved && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            🎉 Perfect! You've measured exactly {targetTime} seconds!
          </div>
        )}
      </div>

      <div className="space-y-12 mb-8">
        {ropes.map((rope) => (
          <div key={rope.id} className="text-center">
            <h3 className="text-xl font-bold mb-6">Rope {rope.id}</h3>
            
            <div className="relative mb-6">
              {/* Rope visualization */}
              <div className="flex items-center justify-center mb-4">
                <div 
                  className="relative w-96 h-8 cursor-pointer hover:scale-105 transition-transform"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const clickPosition = clickX / rect.width;
                    lightRopeAtPosition(rope.id, clickPosition);
                  }}
                >
                  {/* Full rope background */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${getRopeColor(0, rope.leftEnd, rope.rightEnd)} rounded-full shadow-md`}>
                  </div>
                  
                  {/* Hover indicator */}
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-orange-300 opacity-0 hover:opacity-60 transition-opacity"></div>
                  
                  {/* Burned sections */}
                  {rope.leftProgress > 0 && (
                    <div 
                      className="absolute left-0 top-0 h-full bg-gray-400 rounded-l-full"
                      style={{ width: `${rope.leftProgress}%` }}
                    ></div>
                  )}
                  {rope.rightProgress > 0 && (
                    <div 
                      className="absolute right-0 top-0 h-full bg-gray-400 rounded-r-full"
                      style={{ width: `${rope.rightProgress}%` }}
                    ></div>
                  )}
                  
                  {/* Burning flames */}
                  {rope.leftEnd === 'burning' && (
                    <div className="absolute -left-2 -top-1 text-2xl animate-bounce">🔥</div>
                  )}
                  {rope.rightEnd === 'burning' && (
                    <div className="absolute -right-2 -top-1 text-2xl animate-bounce">🔥</div>
                  )}
                  
                  {/* Click instruction overlay */}
                  {rope.leftEnd === 'unlit' && rope.rightEnd === 'unlit' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded shadow opacity-75">
                        Click to light
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress info */}
              <div className="text-sm text-gray-600 mb-4">
                Remaining: {getRemainingLength(rope).toFixed(1)}% | 
                Left: {rope.leftEnd} ({rope.leftProgress.toFixed(1)}%) | 
                Right: {rope.rightEnd} ({rope.rightProgress.toFixed(1)}%)
              </div>
              
              {/* Instruction text */}
              <div className="text-xs text-gray-500">
                💡 Click near ends to light one side, click in middle to light both sides
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Control buttons */}
      <div className="text-center space-x-4 mb-8">
        {isRunning ? (
          <button
            onClick={pauseTimer}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Pause Timer
          </button>
        ) : null}
        
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
      
    </div>
  );
}
