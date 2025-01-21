import React, { useState, useEffect, useRef } from 'react';
import Leaderboard from './components/Leaderboard';
import Prize from './components/Prize';
import { getRandomImage } from './utils'; // Assuming you created a utility function for random images

const moleImages = [
  'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=150',
  'https://images.unsplash.com/photo-1572442013801-2749c23b4699?w=150',
  'https://images.unsplash.com/photo-1584081259209-f0345ed57132?w=150',
  // Add more mole images
];

const whackerImages = [
  'https://example.com/whacker1.png',  // Add real image URLs
  'https://example.com/whacker2.png',
  'https://example.com/whacker3.png',
  // Add more whacker images
];

const Game = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [ranking, setRanking] = useState<number | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<{ player: string, score: number }[]>([]);

  const [whackerImage, setWhackerImage] = useState(getRandomImage(whackerImages));
  const [moleImage, setMoleImage] = useState(getRandomImage(moleImages));

  const handleEndGame = () => {
    // Sort leaderboard by score in descending order
    const sortedLeaderboard = [...leaderboardData, { player: 'Player1', score }]
      .sort((a, b) => b.score - a.score);

    // Get the player's rank
    const playerRank = sortedLeaderboard.findIndex(entry => entry.player === 'Player1') + 1;

    setRanking(playerRank);
    setLeaderboardData(sortedLeaderboard);
  };

  return (
    <div>
      {/* Game controls and grid */}

      {/* After game ends, display the leaderboard and prize */}
      <Leaderboard leaderboardData={leaderboardData} />
      {ranking && <Prize score={score} ranking={ranking} />}
    </div>
  );
};

export default Game;
