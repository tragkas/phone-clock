
import React, { useState, useEffect, useRef } from 'react';

export const Stopwatch: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<number | null>(null);

  const startStop = () => {
    if (isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      setIsRunning(true);
      const startTime = Date.now() - time;
      intervalRef.current = window.setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    }
  };

  const resetLap = () => {
    if (isRunning) {
      setLaps(prev => [time, ...prev]);
    } else {
      setTime(0);
      setLaps([]);
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <div className="text-7xl font-extralight tabular-nums tracking-tight">
          {formatTime(time)}
        </div>
      </div>

      <div className="flex justify-between px-4 mb-8">
        <button
          onClick={resetLap}
          className="w-20 h-20 rounded-full bg-[#1c1c1e] flex items-center justify-center text-white active:bg-[#2c2c2e] transition-colors"
        >
          {isRunning ? 'Lap' : 'Reset'}
        </button>
        <button
          onClick={startStop}
          className={`w-20 h-20 rounded-full flex items-center justify-center font-medium transition-colors ${
            isRunning 
              ? 'bg-[#320e0b] text-[#ff453a]' 
              : 'bg-[#0a2a12] text-[#34c759]'
          }`}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto border-t border-[#1c1c1e]">
        {laps.map((lapTime, index) => (
          <div key={index} className="flex justify-between py-3 border-b border-[#1c1c1e] px-4">
            <span className="text-white">Lap {laps.length - index}</span>
            <span className="text-[#8e8e93] tabular-nums">{formatTime(lapTime)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
