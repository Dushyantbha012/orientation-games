'use client';

import { useState, useCallback } from 'react';

interface Disk {
  id: number;
  size: number; // 1-4 (1 being smallest)
}

interface Tower {
  id: number;
  disks: Disk[];
}

export default function TowerOfHanoi() {
  const [towers, setTowers] = useState<Tower[]>([
    { id: 0, disks: [{ id: 1, size: 4 }, { id: 2, size: 3 }, { id: 3, size: 2 }, { id: 4, size: 1 }] }, // Largest to smallest (bottom to top)
    { id: 1, disks: [] },
    { id: 2, disks: [] }
  ]);
  
  const [selectedTower, setSelectedTower] = useState<number | null>(null);
  const [selectedDisk, setSelectedDisk] = useState<Disk | null>(null);
  const [moves, setMoves] = useState<string[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [minMoves] = useState(15); // 2^4 - 1 = 15 moves for 4 disks

  const getDiskColor = (size: number) => {
    const colors = {
      1: 'bg-red-400 border-red-500',
      2: 'bg-blue-400 border-blue-500', 
      3: 'bg-green-400 border-green-500',
      4: 'bg-yellow-400 border-yellow-500'
    };
    return colors[size as keyof typeof colors] || 'bg-gray-400';
  };

  const getDiskWidth = (size: number) => {
    const widths = {
      1: 'w-16', // 64px
      2: 'w-20', // 80px
      3: 'w-24', // 96px
      4: 'w-28'  // 112px
    };
    return widths[size as keyof typeof widths] || 'w-16';
  };

  const canMoveDisk = (fromTower: number, toTower: number) => {
    const from = towers[fromTower];
    const to = towers[toTower];
    
    if (from.disks.length === 0) return false;
    
    const topDisk = from.disks[from.disks.length - 1]; // Last element is top disk
    
    if (to.disks.length === 0) return true;
    
    const topDiskOnDestination = to.disks[to.disks.length - 1]; // Last element is top disk
    return topDisk.size < topDiskOnDestination.size; // Smaller disk can go on larger disk
  };

  const moveDisk = useCallback((fromTower: number, toTower: number) => {
    if (!canMoveDisk(fromTower, toTower)) return false;

    setTowers(prev => {
      const newTowers = prev.map(tower => ({ ...tower, disks: [...tower.disks] }));
      const disk = newTowers[fromTower].disks.pop();
      if (disk) {
        newTowers[toTower].disks.push(disk);
      }
      return newTowers;
    });

    const moveDescription = `Move disk ${towers[fromTower].disks[towers[fromTower].disks.length - 1]?.size} from Tower ${String.fromCharCode(65 + fromTower)} to Tower ${String.fromCharCode(65 + toTower)}`;
    setMoves(prev => [...prev, moveDescription]);

    return true;
  }, [towers]);

  const handleTowerClick = (towerIndex: number) => {
    const tower = towers[towerIndex];
    
    if (selectedTower === null) {
      // Select a tower to move from
      if (tower.disks.length > 0) {
        setSelectedTower(towerIndex);
        setSelectedDisk(tower.disks[tower.disks.length - 1]);
      }
    } else {
      // Try to move to selected tower
      if (selectedTower === towerIndex) {
        // Deselect if clicking same tower
        setSelectedTower(null);
        setSelectedDisk(null);
      } else {
        // Try to move disk
        const success = moveDisk(selectedTower, towerIndex);
        if (success) {
          setSelectedTower(null);
          setSelectedDisk(null);
          
          // Check if solved (all disks on tower 2)
          setTimeout(() => {
            setTowers(current => {
              if (current[2].disks.length === 4) {
                setIsSolved(true);
              }
              return current;
            });
          }, 100);
        }
      }
    }
  };

  const resetPuzzle = () => {
    setTowers([
      { id: 0, disks: [{ id: 1, size: 4 }, { id: 2, size: 3 }, { id: 3, size: 2 }, { id: 4, size: 1 }] }, // Largest to smallest
      { id: 1, disks: [] },
      { id: 2, disks: [] }
    ]);
    setSelectedTower(null);
    setSelectedDisk(null);
    setMoves([]);
    setIsSolved(false);
  };

  const solvePuzzle = () => {
    // Show the solution state with all disks on tower 2
    setTowers([
      { id: 0, disks: [] },
      { id: 1, disks: [] },
      { id: 2, disks: [{ id: 1, size: 4 }, { id: 2, size: 3 }, { id: 3, size: 2 }, { id: 4, size: 1 }] } // Largest to smallest
    ]);
    setIsSolved(true);
    setMoves(['Solution completed automatically!']);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">🗼 Tower of Hanoi</h2>
        <p className="text-gray-600 mb-4">
          Move all disks from the left tower to the right tower. You can only move one disk at a time,
          and you cannot place a larger disk on top of a smaller one.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-left">
          <p className="text-sm text-blue-700">
            <strong>Goal:</strong> Move all 4 disks to Tower C in the minimum number of moves ({minMoves} moves).
            Click on a tower to select the top disk, then click on another tower to move it.
          </p>
        </div>
      </div>

      {/* Game Status */}
      <div className="text-center mb-8">
        <div className="text-2xl font-bold mb-2">
          Moves: {moves.length} / {minMoves}
        </div>
        {isSolved && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            🎉 Congratulations! You solved the Tower of Hanoi puzzle!
            {moves.length === minMoves && " Perfect - you did it in the minimum number of moves!"}
          </div>
        )}
      </div>

      {/* Towers */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        {towers.map((tower, index) => (
          <div key={tower.id} className="text-center">
            <h3 className="text-xl font-bold mb-4">Tower {String.fromCharCode(65 + index)}</h3>
            
            <div 
              className={`relative mx-auto w-36 h-80 cursor-pointer transition-all ${
                selectedTower === index 
                  ? 'bg-blue-100 border-4 border-blue-400' 
                  : 'bg-gray-50 border-2 border-gray-300 hover:border-gray-400'
              } rounded-lg flex flex-col justify-end items-center p-2`}
              onClick={() => handleTowerClick(index)}
            >
              {/* Tower pole */}
              <div className="absolute top-4 bottom-4 w-2 bg-gradient-to-b from-amber-700 to-amber-900 rounded-full shadow-md"></div>
              
              {/* Base */}
              <div className="w-full h-4 bg-gradient-to-b from-amber-700 to-amber-800 rounded-lg mb-1"></div>
              
              {/* Disks */}
              <div className="absolute bottom-6 flex flex-col-reverse items-center space-y-reverse space-y-1">
                {tower.disks.map((disk, diskIndex) => (
                  <div
                    key={disk.id}
                    className={`${getDiskWidth(disk.size)} h-6 ${getDiskColor(disk.size)} border-2 rounded-lg shadow-md transition-all duration-200 ${
                      selectedDisk?.id === disk.id && diskIndex === tower.disks.length - 1 
                        ? 'transform -translate-y-2 shadow-lg' 
                        : ''
                    }`}
                    style={{ zIndex: 10 + (tower.disks.length - diskIndex) }}
                  >
                    <div className="flex items-center justify-center h-full text-xs font-bold text-white">
                      {disk.size}
                    </div>
                  </div>
                ))}
              </div>

              {/* Selection indicator */}
              {selectedTower === index && (
                <div className="absolute -top-2 -left-2 w-full h-full border-2 border-blue-500 rounded-lg pointer-events-none animate-pulse"></div>
              )}

              {/* Drop zone indicator */}
              {selectedTower !== null && selectedTower !== index && canMoveDisk(selectedTower, index) && (
                <div className="absolute top-2 left-2 right-2 bg-green-200 border-2 border-green-400 border-dashed rounded-lg p-2">
                  <div className="text-xs text-green-700 font-medium">Drop here</div>
                </div>
              )}
            </div>
            
            <div className="mt-2 text-sm text-gray-600">
              {tower.disks.length} disk{tower.disks.length !== 1 ? 's' : ''}
            </div>
          </div>
        ))}
      </div>

      {/* Control buttons */}
      <div className="text-center space-x-4 mb-8">
        <button
          onClick={solvePuzzle}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
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

      {/* Move History */}
      {moves.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Move History:</h3>
          <div className="max-h-40 overflow-y-auto">
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
        </div>
      )}

      {/* Rules and Strategy */}
      <div className="mt-8 bg-yellow-50 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Rules & Strategy:</h3>
        <div className="text-gray-700 space-y-2 text-sm">
          <p><strong>Rules:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Only move one disk at a time</li>
            <li>Only move the top disk from a tower</li>
            <li>Never place a larger disk on a smaller one</li>
          </ul>
          <p className="mt-4"><strong>Strategy tip:</strong></p>
          <p className="ml-4">Think recursively! To move n disks, first move the top n-1 disks to the auxiliary tower, then move the largest disk to the destination, then move the n-1 disks from auxiliary to destination.</p>
        </div>
      </div>
    </div>
  );
}
