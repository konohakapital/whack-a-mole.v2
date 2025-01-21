// components/ScoreTimer.tsx
interface ScoreTimerProps {
  score: number;
  timeLeft: number;
}

const ScoreTimer = ({ score, timeLeft }: ScoreTimerProps) => (
  <div className="flex justify-center gap-8 text-xl">
    <p className="font-semibold">Score: {score}</p>
    <p className="font-semibold">Time: {timeLeft}s</p>
  </div>
);

export default ScoreTimer;
