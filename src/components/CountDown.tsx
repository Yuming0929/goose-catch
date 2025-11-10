import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../stores/useGameStore';

interface CountDownProps {
  onComplete?: () => void;
}

const CountDown = ({ onComplete }: CountDownProps) => {
  const { time, gamePhase } = useGameStore();
  const [timeLeft, setTimeLeft] = useState<number>(time);
  const prevPhaseRef = useRef<string>(gamePhase);


  useEffect(() => {
    if (gamePhase === 'playing' && prevPhaseRef.current === 'ready') {
      setTimeLeft(time);
    }
    if (gamePhase === 'ready' && prevPhaseRef.current !== 'ready') {
      setTimeLeft(time);
    }
    prevPhaseRef.current = gamePhase;
  }, [gamePhase, time]);


  useEffect(() => {
    if (gamePhase !== 'playing') return;

    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gamePhase, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="countdown-timer">
      {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </div>
  );
};

export default CountDown;