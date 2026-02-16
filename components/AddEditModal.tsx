
import React, { useState, useEffect } from 'react';
import { Alarm, DayOfWeek } from '../types';
import { X } from 'lucide-react';

interface AddEditModalProps {
  alarm?: Alarm;
  onSave: (alarm: Partial<Alarm>) => void;
  onClose: () => void;
}

const DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const AddEditModal: React.FC<AddEditModalProps> = ({ alarm, onSave, onClose }) => {
  const [time, setTime] = useState(alarm?.time || '07:00');
  const [label, setLabel] = useState(alarm?.label || 'Alarm');
  const [repeat, setRepeat] = useState<DayOfWeek[]>(alarm?.repeat || []);

  const toggleDay = (day: DayOfWeek) => {
    setRepeat(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    onSave({
      time,
      label,
      repeat,
      enabled: true
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-0">
      <div className="w-full max-w-sm bg-[#1c1c1e] rounded-t-3xl sm:rounded-2xl overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 shadow-2xl ring-1 ring-white/10">
        <div className="flex justify-between items-center p-4 border-b border-[#2c2c2e]">
          <button onClick={onClose} className="text-[#ff9f0a] text-lg font-medium px-2 py-1 active:opacity-70">Cancel</button>
          <span className="text-white font-semibold text-lg">{alarm ? 'Edit Alarm' : 'Add Alarm'}</span>
          <button onClick={handleSave} className="text-[#ff9f0a] text-lg font-bold px-2 py-1 active:opacity-70">Save</button>
        </div>

        <div className="p-6 flex flex-col items-center safe-area-bottom pb-8">
          <div className="relative w-full flex justify-center mb-8">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-transparent text-5xl sm:text-6xl font-light text-white focus:outline-none text-center appearance-none w-full"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <div className="w-full space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-[#8e8e93] text-xs font-semibold uppercase px-1 tracking-wider">Label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Alarm Label"
                className="w-full bg-[#2c2c2e] text-white px-4 py-4 rounded-xl focus:outline-none text-lg placeholder:text-[#5c5c5e]"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[#8e8e93] text-xs font-semibold uppercase px-1 tracking-wider">Repeat</label>
              <div className="flex justify-between bg-[#2c2c2e] p-2 rounded-xl">
                {DAYS.map(day => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full text-sm font-medium transition-all active:scale-90 flex items-center justify-center ${repeat.includes(day)
                        ? 'bg-[#ff9f0a] text-black shadow-lg shadow-orange-500/20'
                        : 'text-white hover:bg-white/10'
                      }`}
                  >
                    {day.charAt(0)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
