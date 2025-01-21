// components/GameControls.tsx
interface GameControlsProps {
  isPlaying: boolean;
  onStartGame: () => void;
  timeLeft: number;
}

const GameControls = ({ isPlaying, onStartGame, timeLeft }: GameControlsProps) => (
  <div className="text-center mb-8">
    <button
      onClick={onStartGame}
      className="bg-green-500 text-white px-8 py-3 rounded-lg text-xl font-semibold hover:bg-green-600 transition-colors"
    >
      {timeLeft === 30 ? 'Start Game' : 'Play Again'}
    </button>
  </div>
);

export default GameControls;
