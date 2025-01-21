// components/Leaderboard.tsx
interface LeaderboardProps {
  leaderboardData: { player: string, score: number }[];
}

const Leaderboard = ({ leaderboardData }: LeaderboardProps) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-center mb-4">Leaderboard</h2>
      <div className="grid grid-cols-1 gap-4">
        {leaderboardData.map((entry, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <span className="font-semibold">{index + 1}. {entry.player}</span>
            <span className="font-semibold">{entry.score} points</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
