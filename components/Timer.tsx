
import React, { useState, useEffect, useRef } from 'react';
import { audioService } from '../services/audioService';
import { BellRing } from 'lucide-react';

export const Timer: React.FC = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [isPaused, setIsPaused] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const startTimer = () => {
    audioService.resumeContext();
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds === 0) return;

    setTimeLeft(totalSeconds);
    setIsStarted(true);
    setIsPaused(false);
    setIsFinished(false);
  };

  const togglePause = () => {
    audioService.resumeContext();
    setIsPaused(!isPaused);
  };

  const cancelTimer = () => {
    setIsStarted(false);
    setIsPaused(true);
    setTimeLeft(0);
    setIsFinished(false);
  };

  useEffect(() => {
    if (!isPaused && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isStarted) {
      setIsStarted(false);
      setIsPaused(true);
      setIsFinished(true);
      audioService.playTimerDone();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, timeLeft, isStarted]);

  const formatDisplay = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-in fade-in duration-500 text-center">
        <BellRing size={64} className="text-[#ff9f0a] mb-6" />
        <h2 className="text-3xl font-bold mb-3">Timer Finished</h2>
        <p className="text-[#8e8e93] mb-10">Your time is up!</p>
        <button
          onClick={cancelTimer}
          className="px-12 py-4 bg-[#ff9f0a] text-black font-bold rounded-2xl text-xl active:scale-95 transition-transform"
        >
          OK
        </button>
      </div>
    );
  }

  if (isStarted) {
    const totalInitialSeconds = hours * 3600 + minutes * 60 + seconds;
    const progress = totalInitialSeconds > 0 ? (timeLeft / totalInitialSeconds) : 0;

    return (
      <div className="flex flex-col items-center justify-between h-[60vh] py-6 animate-in zoom-in duration-300">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="#1c1c1e"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="#ff9f0a"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={754}
              strokeDashoffset={754 - (754 * progress)}
              strokeLinecap="round"
              className="transition-all duration-1000 linear"
            />
          </svg>
          <div className="text-6xl font-extralight tabular-nums tracking-tighter">
            {formatDisplay(timeLeft)}
          </div>
        </div>

        <div className="flex justify-between w-full px-8 mt-8">
          <button
            onClick={cancelTimer}
            className="w-20 h-20 rounded-full bg-[#1c1c1e] text-white flex items-center justify-center text-lg active:bg-[#2c2c2e] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={togglePause}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-lg font-medium transition-colors ${isPaused
              ? 'bg-[#0a2a12] text-[#34c759] active:bg-[#0f3d1b]'
              : 'bg-[#1c1c1e] text-[#ff9f0a] active:bg-[#2c2c2e]'
              }`}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex-1 flex items-center justify-center space-x-4 py-8">
        <div className="flex flex-col items-center">
          <input
            type="number"
            min="0"
            max="23"
            value={hours.toString().padStart(2, '0')}
            onChange={(e) => {
              let val = parseInt(e.target.value);
              if (isNaN(val)) val = 0;
              if (val < 0) val = 0;
              if (val > 23) val = 23;
              setHours(val);
            }}
            className="bg-transparent text-6xl font-light text-white appearance-none focus:outline-none text-center w-24 border-b border-transparent focus:border-[#ff9f0a] transition-colors"
          />
          <span className="text-sm text-[#8e8e93] mt-2 font-medium">hours</span>
        </div>

        <div className="text-6xl font-light text-[#2c2c2e] pb-8">:</div>

        <div className="flex flex-col items-center">
          <input
            type="number"
            min="0"
            max="59"
            value={minutes.toString().padStart(2, '0')}
            onChange={(e) => {
              let val = parseInt(e.target.value);
              if (isNaN(val)) val = 0;
              if (val < 0) val = 0;
              if (val > 59) val = 59;
              setMinutes(val);
            }}
            className="bg-transparent text-6xl font-light text-white appearance-none focus:outline-none text-center w-24 border-b border-transparent focus:border-[#ff9f0a] transition-colors"
          />
          <span className="text-sm text-[#8e8e93] mt-2 font-medium">min</span>
        </div>

        <div className="text-6xl font-light text-[#2c2c2e] pb-8">:</div>

        <div className="flex flex-col items-center">
          <input
            type="number"
            min="0"
            max="59"
            value={seconds.toString().padStart(2, '0')}
            onChange={(e) => {
              let val = parseInt(e.target.value);
              if (isNaN(val)) val = 0;
              if (val < 0) val = 0;
              if (val > 59) val = 59;
              setSeconds(val);
            }}
            className="bg-transparent text-6xl font-light text-white appearance-none focus:outline-none text-center w-24 border-b border-transparent focus:border-[#ff9f0a] transition-colors"
          />
          <span className="text-sm text-[#8e8e93] mt-2 font-medium">sec</span>
        </div>
      </div>

      <div className="flex justify-between px-8 mb-8">
        <button
          onClick={() => {
            setHours(0);
            setMinutes(0);
            setSeconds(0);
          }}
          disabled={hours === 0 && minutes === 0 && seconds === 0}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-lg font-medium transition-colors ${(hours > 0 || minutes > 0 || seconds > 0)
              ? 'bg-[#1c1c1e] text-[#ff9f0a] active:bg-[#2c2c2e]'
              : 'bg-[#1c1c1e] text-[#48484a] cursor-not-allowed'
            }`}
        >
          Cancel
        </button>
        <button
          onClick={startTimer}
          disabled={hours === 0 && minutes === 0 && seconds === 0}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-lg font-medium transition-colors ${(hours > 0 || minutes > 0 || seconds > 0)
              ? 'bg-[#0a2a12] text-[#34c759] active:bg-[#0f3d1b]'
              : 'bg-[#1c1c1e] text-[#1c4a24] cursor-not-allowed opacity-50'
            }`}
        >
          Start
        </button>
      </div>
    </div >
  );
};
