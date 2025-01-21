// components/GameHeader.tsx
import React from 'react';
import { Button } from './ui/button';
import ScoreTimer from './ScoreTimer';

interface GameHeaderProps {
  score: number;
  timeLeft: number;
  combo: number;
  highestCombo: number;
  difficulty: 'easy' | 'medium' | 'hard';
  setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onStartGame: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ score, timeLeft, combo, highestCombo, difficulty, setDifficulty, onStartGame }) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Whack-a-Mole!</h1>
      <div className="flex justify-center space-x-4 mb-4">
        <ScoreTimer score={score} timeLeft={timeLeft} />
        <div className="text-lg">
          Combo: {combo}x | Highest: {highestCombo}x
        </div>
      </div>
      <div className="flex justify-center space-x-2 mb-4">
        {['easy', 'medium', 'hard'].map((d) => (
          <Button
            key={d}
            onClick={() => setDifficulty(d as 'easy' | 'medium' | 'hard')}
            className={`${difficulty === d ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GameHeader;
