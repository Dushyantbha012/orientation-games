'use client';

import { useState } from 'react';

interface Jar {
  id: number;
  label: string;
  actualContent: string;
  revealed: boolean;
  userLabel?: string; // User's assigned label
}

interface DrawnFruit {
  id: string;
  type: 'apple' | 'orange';
  fromJar: number;
}

export default function MislabeledJars() {
  const [jars, setJars] = useState<Jar[]>([
    { id: 1, label: '🍎', actualContent: '🍎🍊', revealed: false, userLabel: undefined },
    { id: 2, label: '🍊', actualContent: '🍎', revealed: false, userLabel: undefined },
    { id: 3, label: '🍎🍊', actualContent: '🍊', revealed: false, userLabel: undefined }
  ]);
  
  const [gameState, setGameState] = useState<'initial' | 'revealed' | 'solved'>('initial');
  const [selectedJar, setSelectedJar] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [drawnFruit, setDrawnFruit] = useState<DrawnFruit | null>(null);
  const [draggedLabel, setDraggedLabel] = useState<string | null>(null);

  const drawFromJar = (jarId: number) => {
    if (gameState !== 'initial') return;
    
    const jar = jars.find(j => j.id === jarId);
    if (!jar) return;

    setSelectedJar(jarId);
    setGameState('revealed');
    
    // Generate a random fruit based on actual content
    const fruitType = jar.actualContent === '🍎🍊' 
      ? Math.random() > 0.5 ? 'apple' : 'orange'
      : jar.actualContent === '🍎' ? 'apple' : 'orange';
    
    const fruit: DrawnFruit = {
      id: `fruit-${jarId}-${Date.now()}`,
      type: fruitType as 'apple' | 'orange',
      fromJar: jarId
    };
    
    setDrawnFruit(fruit);
    setMessage(`You drew ${fruitType === 'apple' ? 'an apple' : 'an orange'} from the jar! Now drag the correct labels to solve the puzzle.`);

    // Update the jar to show it's been revealed
    setJars(prev => prev.map(j => 
      j.id === jarId ? { ...j, revealed: true } : j
    ));
  };

  const handleDragStart = (e: React.DragEvent, label: string) => {
    setDraggedLabel(label);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, jarId: number) => {
    e.preventDefault();
    if (!draggedLabel || gameState !== 'revealed') return;

    // Update jar with user's label assignment
    setJars(prev => prev.map(jar => 
      jar.id === jarId ? { ...jar, userLabel: draggedLabel } : jar
    ));
    
    setDraggedLabel(null);
  };

  const checkSolution = () => {
    const allCorrect = jars.every(jar => jar.userLabel === jar.actualContent);
    if (allCorrect) {
      setGameState('solved');
      setMessage('🎉 Perfect! You\'ve correctly labeled all jars!');
    } else {
      setMessage('❌ Not quite right. Try again!');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const resetPuzzle = () => {
    setJars([
      { id: 1, label: '🍎', actualContent: '🍎🍊', revealed: false, userLabel: undefined },
      { id: 2, label: '🍊', actualContent: '🍎', revealed: false, userLabel: undefined },
      { id: 3, label: '🍎🍊', actualContent: '🍊', revealed: false, userLabel: undefined }
    ]);
    setGameState('initial');
    setSelectedJar(null);
    setMessage('');
    setDrawnFruit(null);
    setDraggedLabel(null);
  };

  const showSolution = () => {
    setJars([
      { id: 1, label: '🍎', actualContent: '🍎🍊', revealed: true, userLabel: '🍎🍊' },
      { id: 2, label: '🍊', actualContent: '🍎', revealed: true, userLabel: '🍎' },
      { id: 3, label: '🍎🍊', actualContent: '🍊', revealed: true, userLabel: '🍊' }
    ]);
    setGameState('solved');
    setMessage('Here\'s the solution! All labels are now correct.');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">🏺 Mislabeled Jars</h2>
        <p className="text-gray-600 mb-4">
          Three jars contain apples, oranges, and a mix of both. However, all labels are wrong! 
          Click on any jar to draw a fruit, then drag the correct labels to solve the puzzle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {jars.map((jar) => (
          <div key={jar.id} className="text-center">
            <div 
              className={`relative mx-auto w-32 h-40 rounded-lg border-4 cursor-pointer transition-all ${
                selectedJar === jar.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
              } flex items-center justify-center mb-4`}
              onClick={() => drawFromJar(jar.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, jar.id)}
            >
              <div className="text-6xl">🏺</div>
              {jar.revealed && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                  ✓
                </div>
              )}
              {drawnFruit && drawnFruit.fromJar === jar.id && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-3xl animate-bounce">
                  {drawnFruit.type === 'apple' ? '🍎' : '🍊'}
                </div>
              )}
            </div>
            
            {/* Original Label */}
            <div className="p-2 rounded-lg bg-gray-100 mb-2 min-h-[50px] flex items-center justify-center">
              <div>
                <div className="text-xs text-gray-500 mb-1">Original Label:</div>
                <div className="font-bold text-md text-black">{jar.label}</div>
              </div>
            </div>

            {/* User's Label */}
            <div 
              className={`p-2 rounded-lg mb-2 min-h-[50px] flex items-center justify-center transition-all border-2 border-dashed ${
                jar.userLabel 
                  ? 'bg-blue-100 border-blue-300' 
                  : 'bg-gray-50 border-gray-300 hover:border-blue-300'
              }`}
            >
              <div>
                <div className="text-xs text-gray-500 mb-1">Your Label:</div>
                <div className="font-bold text-md text-blue-500">
                  {jar.userLabel || 'Drop label here'}
                </div>
              </div>
            </div>

            {gameState === 'initial' && (
              <p className="text-sm text-gray-600">Click to draw a fruit!</p>
            )}
          </div>
        ))}
      </div>

      {/* Available labels for dragging */}
      {gameState === 'revealed' && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-center mb-4">Drag these labels to the correct jars:</h3>
          <div className="flex justify-center space-x-4 text-blue-500">
            {['🍎', '🍊', '🍎🍊'].map((label) => (
              <div
                key={label}
                className={`px-4 py-2 bg-yellow-200 border-2 border-yellow-400 rounded-lg cursor-move hover:bg-yellow-300 transition-all ${
                  draggedLabel === label ? 'opacity-50' : ''
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, label)}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      )}

      {message && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center">
          <p className="text-blue-800 font-medium">{message}</p>
        </div>
      )}

      <div className="text-center space-x-4">
        {gameState === 'revealed' && (
          <button
            onClick={checkSolution}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Check Solution
          </button>
        )}
        
        <button
          onClick={showSolution}
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

      {gameState === 'solved' && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-800 mb-3">How the solution works:</h3>
          <div className="text-green-700 space-y-2">
            <p>1. Since all labels are wrong, you can use logical deduction.</p>
            <p>2. By drawing from any jar, you learn what type of fruit it actually contains.</p>
            <p>3. Use this information to figure out the contents of the other jars:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>If a jar labeled &quot;Mixed&quot; contains only one type of fruit, the other jars must contain different contents.</li>
              <li>Since no label is correct, work backwards from what you know to be true.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
