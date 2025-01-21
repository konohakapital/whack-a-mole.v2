import React, { useState, useEffect, useRef } from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { metaMask, walletConnect } from '@wagmi/connectors';
import ScoreTimer from './ScoreTimer';
import GameControls from './GameControls';
import MoleGrid from './MoleGrid';
import CustomCursor from './CustomCursor';
import Leaderboard from './Leaderboard';
import Prize from './Prize';
import { getRandomImage } from '../utils/getRandomImage';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import WalletConnect from './WalletConnect';
import { Account } from './Account';
import { WalletOptions } from './WalletOptions';

interface GameProps {
  initialWhackerImage?: string;
  initialMoleImage?: string;
  duration?: number;
  tokenRewardPerHit?: number;
  minScoreForReward?: number;
  isSoundEnabled?: boolean;
}

const moleImages = [
    'https://pbs.twimg.com/media/GbONGyfbwAAfPlK.jpg',
    'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=150',
    'https://images.unsplash.com/photo-1572442013801-2749c23b4699?w=150',
    'https://images.unsplash.com/photo-1584081259209-f0345ed57132?w=150',
];

const whackerImages = [
];

export default function Game({ 
  initialWhackerImage,
  initialMoleImage = 'https://pbs.twimg.com/media/GbONGyfbwAAfPlK.jpg',
  duration = 30,
  tokenRewardPerHit = 1,
  minScoreForReward = 50,
  isSoundEnabled = true,
}: GameProps) {
  // Game state
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [activeMole, setActiveMole] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [combo, setCombo] = useState(0);
  const [highestCombo, setHighestCombo] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  
  // Web3 connection state
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Cursor state
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showHit, setShowHit] = useState(false);
  
  // Game intervals
  const gameInterval = useRef<NodeJS.Timeout | null>(null);
  const timeInterval = useRef<NodeJS.Timeout | null>(null);

  // Sound effects
  const [soundEnabled, setSoundEnabled] = useState(isSoundEnabled);

  // Sound references and utility function
  const soundsRef = useRef({
    hit: new Audio('/sounds/hit.mp3'),
    miss: new Audio('/sounds/miss.mp3'),
    spawn: new Audio('/sounds/spawn.mp3'),
    gameStart: new Audio('/sounds/game-start.mp3'),
    gameOver: new Audio('/sounds/game-over.mp3'),
    combo: new Audio('/sounds/combo.mp3')
  });

  useEffect(() => {
    Object.values(soundsRef.current).forEach(audio => {
      audio.volume = 0.5; // Set default volume to 50%
      audio.preload = 'auto'; // Preload sounds
    });
  }, []);

  const playSound = (soundType: keyof typeof soundsRef.current) => {
    if (!soundEnabled) return; // Check if sound is enabled
    
    const sound = soundsRef.current[soundType];
    sound.currentTime = 0; // Reset sound to start
    sound.play().catch(error => console.log('Sound play failed:', error));
  };

  // Leaderboard state
  const [ranking, setRanking] = useState<number | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<Array<{ player: string; score: number }>>([]);
  
  // Images state
  const [whackerImage, setWhackerImage] = useState(initialWhackerImage || getRandomImage(whackerImages));
  const [moleImage, setMoleImage] = useState(initialMoleImage || getRandomImage(moleImages));

  // Difficulty settings
  const difficultySettings = {
    easy: { spawnInterval: 1000, despawnInterval: 2000, reward: 1 },
    medium: { spawnInterval: 800, despawnInterval: 1500, reward: 2 },
    hard: { spawnInterval: 600, despawnInterval: 1000, reward: 3 }
  };

  const startGame = async () => {
//    if (!isConnected) {
//      alert('Please connect your wallet to play!');
//      return;
//    }

    playSound('gameStart');
    setScore(0);
    setTimeLeft(duration);
    setIsPlaying(true);
    setRanking(null);
    setCombo(0);
    setHighestCombo(0);
    spawnMole();
    startTimer();
  };

  const spawnMole = () => {
    if (gameInterval.current) {
      clearInterval(gameInterval.current);
    }
    
    const { spawnInterval, despawnInterval } = difficultySettings[difficulty];
    
    gameInterval.current = setInterval(() => {
      setActiveMole(prev => {
        let newPosition;
        do {
          newPosition = Math.floor(Math.random() * 9);
        } while (newPosition === prev);
        playSound('spawn');
        return newPosition;
      });

      // Despawn mole after interval
      setTimeout(() => {
        setActiveMole(null);
        setCombo(0); // Reset combo when mole despawns
      }, despawnInterval);
      
    }, spawnInterval);
  };

  const startTimer = () => {
    if (timeInterval.current) {
      clearInterval(timeInterval.current);
    }
    
    timeInterval.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    setIsPlaying(false);
    if (gameInterval.current) {
      clearInterval(gameInterval.current);
      gameInterval.current = null;
    }
    if (timeInterval.current) {
      clearInterval(timeInterval.current);
      timeInterval.current = null;
    }
    setActiveMole(null);
    playSound('gameOver');
    updateLeaderboard();
  };

  const handleClick = (index: number) => {
    if (!isPlaying) return;

    if (index === activeMole) {
      const comboMultiplier = Math.min(combo, 5); // Cap combo multiplier at 5x
      const newScore = 10 * (1 + comboMultiplier * 0.2); // 20% bonus per combo level
      
      setScore(prev => prev + newScore);
      setCombo(prev => {
        const newCombo = prev + 1;
        setHighestCombo(current => Math.max(current, newCombo));
        return newCombo;
      });
      
      setShowHit(true);
      playSound('hit');
      setTimeout(() => setShowHit(false), 200);
      
      // Immediately spawn a new mole
      setActiveMole(prev => {
        let newPosition;
        do {
          newPosition = Math.floor(Math.random() * 9);
        } while (newPosition === prev);
        return newPosition;
      });
    } else {
      setScore(prev => Math.max(0, prev - 5));
      setCombo(0); // Reset combo on miss
      playSound('miss');
    }
  };

  const handleGameEnd = async () => {
    endGame();
    
    if (score >= minScoreForReward) {
      try {
        // Here you would integrate with your smart contract to mint/transfer tokens
        const tokenReward = Math.floor(score / 10) * tokenRewardPerHit;
        // Mock token balance update - replace with actual contract call
        setTokenBalance(prev => prev + tokenReward);
        
        alert(`Congratulations! You earned ${tokenReward} tokens!`);
      } catch (error) {
        console.error('Failed to distribute tokens:', error);
        alert('Failed to distribute tokens. Please try again later.');
      }
    }
  };

  
  function ConnectWallet() {
    const { isConnected } = useAccount()
    if (isConnected) return <Account />
    return <WalletOptions />
  }

  const updateLeaderboard = () => {
    const newLeaderboardData = [...leaderboardData, { player: 'Player1', score }].sort((a, b) => b.score - a.score);
    const playerRank = newLeaderboardData.findIndex(entry => entry.player === 'Player1' && entry.score === score) + 1;
    setRanking(playerRank);
    setLeaderboardData(newLeaderboardData);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    return () => {
      if (gameInterval.current) clearInterval(gameInterval.current);
      if (timeInterval.current) clearInterval(timeInterval.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-green-600 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Wallet Connection */}
          <div className="flex justify-center mb-4">
            <ConnectWallet />
          </div>

          {/* Game Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Whack-a-Mole!</h1>
            <div className="flex justify-center space-x-4 mb-4">
              <ScoreTimer score={score} timeLeft={timeLeft} />
              <div className="text-lg">
                Combo: {combo}x | Highest: {highestCombo}x
              </div>
            </div>
            
            {/* Difficulty Selection */}
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

          {/* Game Info */}
          <Alert className="mb-4">
            <AlertDescription>
              Hit moles to earn MOLE tokens! Each 10 points = {tokenRewardPerHit} MOLE.
              Minimum score for rewards: {minScoreForReward} points.
              Build combos for bonus points!
            </AlertDescription>
          </Alert>

          <GameControls 
            isPlaying={isPlaying} 
            onStartGame={startGame} 
            timeLeft={timeLeft} 
          />

          <MoleGrid 
            activeMole={activeMole} 
            onMoleClick={handleClick} 
            moleImage={moleImage} 
          />

          <CustomCursor 
            showHit={showHit} 
            cursorPosition={cursorPosition} 
            whackerImage={whackerImage} 
          />
        </div>
        
        {!isPlaying && timeLeft === 0 && (
          <>
            <Leaderboard leaderboardData={leaderboardData} />
            {ranking && <Prize score={score} ranking={ranking} />}
          </>
        )}
      </div>
    </div>
  );
}
