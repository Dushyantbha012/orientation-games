import { PuzzleType } from '@/app/page';

interface PuzzleSelectorProps {
  activePuzzle: PuzzleType;
  setActivePuzzle: (puzzle: PuzzleType) => void;
}

export default function PuzzleSelector({ activePuzzle, setActivePuzzle }: PuzzleSelectorProps) {
  const puzzles = [
    {
      id: 'jars' as const,
      name: 'Mislabeled Jars',
      description: 'Three jars with incorrect labels - can you figure out what\'s in each?',
      icon: '🏺'
    },
    {
      id: 'jugs' as const,
      name: 'Water Jug Problem',
      description: 'Use two jugs to measure exactly 4 gallons of water',
      icon: '🪣'
    },
    // {
    //   id: 'ropes' as const,
    //   name: 'Burning Rope',
    //   description: 'Measure 45 minutes using two ropes that burn for 1 hour each',
    //   icon: '🔥'
    // },
    {
      id: 'hanoi' as const,
      name: 'Tower of Hanoi',
      description: 'Move all disks from left to right tower following the rules',
      icon: '🗼'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {puzzles.map((puzzle) => (
        <button
          key={puzzle.id}
          onClick={() => setActivePuzzle(puzzle.id)}
          className={`p-6 rounded-lg shadow-md transition-all duration-200 text-left ${
            activePuzzle === puzzle.id
              ? 'bg-blue-500 text-white shadow-lg transform scale-105'
              : 'bg-white text-black hover:bg-gray-50 hover:shadow-lg'
          }`}
        >
          <div className="text-4xl mb-3">{puzzle.icon}</div>
          <h3 className="text-xl font-bold mb-2">{puzzle.name}</h3>
          <p className={`text-sm ${activePuzzle === puzzle.id ? 'text-blue-100' : 'text-gray-600'}`}>
            {puzzle.description}
          </p>
        </button>
      ))}
    </div>
  );
}
