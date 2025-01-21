// GameSounds.tsx
import React, { useState, useEffect, useRef } from 'react';

interface GameSounds {
  hit: HTMLAudioElement;
  miss: HTMLAudioElement;
  spawn: HTMLAudioElement;
  gameStart: HTMLAudioElement;
  gameOver: HTMLAudioElement;
  combo: HTMLAudioElement;
}

interface GameSoundsProps {
  soundEnabled: boolean;
}

const GameSounds: React.FC<GameSoundsProps> = ({ soundEnabled }) => {
  // Sound references
  const soundsRef = useRef<GameSounds>({
    hit: new Audio('/sounds/hit.mp3'),
    miss: new Audio('/sounds/miss.mp3'),
    spawn: new Audio('/sounds/spawn.mp3'),
    gameStart: new Audio('/sounds/game-start.mp3'),
    gameOver: new Audio('/sounds/game-over.mp3'),
    combo: new Audio('/sounds/combo.mp3')
  });

  // Initialize sound volumes
  useEffect(() => {
    Object.values(soundsRef.current).forEach(audio => {
      audio.volume = 0.5; // Set default volume to 50%
      audio.preload = 'auto'; // Preload sounds
    });
  }, []);

  // Sound playing utility function
  const playSound = (soundType: keyof GameSounds) => {
    if (!soundEnabled) return; // Check if sound is enabled
    
    const sound = soundsRef.current[soundType];
    sound.currentTime = 0; // Reset sound to start
    sound.play().catch(error => console.log('Sound play failed:', error));
  };

  return {
    playSound
  };
};

export default GameSounds;
