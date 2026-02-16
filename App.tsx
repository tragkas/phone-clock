
import React, { useState, useEffect, useRef } from 'react';
import { Plus, AlarmClock, Timer as TimerIcon, StopCircle, BellRing, X, Clock } from 'lucide-react';
import { Alarm, DayOfWeek } from './types';
import { AlarmItem } from './components/AlarmItem';
import { AddEditModal } from './components/AddEditModal';
import { Stopwatch } from './components/Stopwatch';
import { Timer } from './components/Timer';
import { audioService } from './services/audioService';

const STORAGE_KEY = 'nova_alarms_v1';

type Tab = 'alarm' | 'stopwatch' | 'timer';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('alarm');
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | undefined>();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);
  
  const lastRungMinute = useRef<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      checkAlarms(now);
    }, 1000);
    return () => clearInterval(timer);
  }, [alarms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
  }, [alarms]);

  const checkAlarms = (now: Date) => {
    const currentHM = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const dayNames: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDay = dayNames[now.getDay()];

    if (lastRungMinute.current === currentHM) return;

    const triggered = alarms.find(alarm => {
      if (!alarm.enabled) return false;
      if (alarm.time !== currentHM) return false;
      
      // If no repeat set, it rings any day (then disables)
      if (alarm.repeat.length === 0) return true;
      
      // If repeat set, must match today
      return alarm.repeat.includes(currentDay);
    });

    if (triggered) {
      lastRungMinute.current = currentHM;
      setRingingAlarm(triggered);
      audioService.startAlarm();

      // Disable if it's a one-time alarm
      if (triggered.repeat.length === 0) {
        setAlarms(prev => prev.map(a => a.id === triggered.id ? { ...a, enabled: false } : a));
      }
    }
  };

  const stopRinging = () => {
    setRingingAlarm(null);
    audioService.stopAlarm();
  };

  const snoozeRinging = () => {
    // Basic snooze: stop now, it won't ring again this minute because of lastRungMinute check
    // Real snooze would schedule a new temporary alarm for +9 mins
    stopRinging();
  };

  const handleAddAlarm = () => {
    audioService.resumeContext();
    setEditingAlarm(undefined);
    setIsModalOpen(true);
  };

  const handleEditAlarm = (alarm: Alarm) => {
    audioService.resumeContext();
    setEditingAlarm(alarm);
    setIsModalOpen(true);
  };

  const saveAlarm = (alarmData: Partial<Alarm>) => {
    if (editingAlarm) {
      setAlarms(prev => prev.map(a => a.id === editingAlarm.id ? { ...a, ...alarmData } as Alarm : a));
    } else {
      const newAlarm: Alarm = {
        id: crypto.randomUUID(),
        time: alarmData.time || '07:00',
        label: alarmData.label || 'Alarm',
        repeat: alarmData.repeat || [],
        enabled: true,
      };
      setAlarms(prev => [...prev, newAlarm].sort((a, b) => a.time.localeCompare(b.time)));
    }
    setIsModalOpen(false);
  };

  const toggleAlarm = (id: string) => {
    audioService.resumeContext();
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(a => a.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'stopwatch':
        return <Stopwatch />;
      case 'timer':
        return <Timer />;
      case 'alarm':
      default:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
            <div className="text-center mb-10 pt-4">
              <div className="text-6xl font-extralight tracking-tight tabular-nums">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </div>
              <div className="text-[#8e8e93] font-medium mt-1 text-sm">
                {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between px-1 mb-2">
                <h3 className="text-xl font-bold text-white">Other</h3>
              </div>
              <div className="divide-y divide-[#1c1c1e]">
                {alarms.length > 0 ? (
                  alarms.map(alarm => (
                    <AlarmItem 
                      key={alarm.id} 
                      alarm={alarm} 
                      onToggle={toggleAlarm} 
                      onDelete={deleteAlarm}
                      onEdit={handleEditAlarm}
                    />
                  ))
                ) : (
                  <div className="text-center py-24 text-[#3a3a3c]">
                    <p className="text-xl font-medium text-[#8e8e93]">No Alarms</p>
                    <p className="text-sm mt-1">Tap + to add an alarm</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-5 pt-8 pb-24 md:max-w-xl md:mx-auto relative overflow-x-hidden select-none">
      {/* Alarm Ringing Overlay */}
      {ringingAlarm && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
          <BellRing size={80} className="text-[#ff9f0a] animate-bounce mb-8" />
          <h2 className="text-6xl font-light mb-2">{ringingAlarm.time}</h2>
          <p className="text-2xl text-[#8e8e93] mb-20">{ringingAlarm.label}</p>
          
          <div className="flex flex-col gap-6 w-full max-w-xs">
            <button 
              onClick={snoozeRinging}
              className="w-full py-5 bg-[#1c1c1e] text-white rounded-2xl text-xl font-semibold active:scale-95 transition-transform"
            >
              Snooze
            </button>
            <button 
              onClick={stopRinging}
              className="w-full py-5 bg-[#ff453a] text-white rounded-2xl text-xl font-bold active:scale-95 transition-transform"
            >
              Stop
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex justify-between items-center mb-6 sticky top-0 bg-black/90 backdrop-blur-md z-10 py-3">
        <h1 className="text-3xl font-bold tracking-tight capitalize">{activeTab}</h1>
        {activeTab === 'alarm' && (
          <button 
            onClick={handleAddAlarm}
            className="text-[#ff9f0a] hover:bg-[#ff9f0a]/10 p-2 -mr-2 rounded-full transition-colors active:scale-95"
            aria-label="Add alarm"
          >
            <Plus size={30} />
          </button>
        )}
      </header>

      <main className="min-h-[70vh]">
        {renderContent()}
      </main>

      {isModalOpen && (
        <AddEditModal 
          alarm={editingAlarm} 
          onSave={saveAlarm} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-[#121212]/95 backdrop-blur-2xl border-t border-[#2c2c2e] py-4 px-10 flex justify-between items-center z-40 safe-area-bottom">
        <button 
          onClick={() => setActiveTab('alarm')}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${activeTab === 'alarm' ? 'text-[#ff9f0a]' : 'text-[#8e8e93]'}`}
        >
          <AlarmClock size={26} strokeWidth={activeTab === 'alarm' ? 2.5 : 2} />
          <span className="text-[10px] font-bold tracking-wide uppercase">Alarm</span>
        </button>
        <button 
          onClick={() => setActiveTab('stopwatch')}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${activeTab === 'stopwatch' ? 'text-[#ff9f0a]' : 'text-[#8e8e93]'}`}
        >
          <StopCircle size={26} strokeWidth={activeTab === 'stopwatch' ? 2.5 : 2} />
          <span className="text-[10px] font-bold tracking-wide uppercase">Stopwatch</span>
        </button>
        <button 
          onClick={() => setActiveTab('timer')}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${activeTab === 'timer' ? 'text-[#ff9f0a]' : 'text-[#8e8e93]'}`}
        >
          <TimerIcon size={26} strokeWidth={activeTab === 'timer' ? 2.5 : 2} />
          <span className="text-[10px] font-bold tracking-wide uppercase">Timer</span>
        </button>
      </nav>

      <style>{`
        .safe-area-bottom {
          padding-bottom: calc(1rem + env(safe-area-inset-bottom));
        }
      `}</style>
    </div>
  );
};

export default App;
