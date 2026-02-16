
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-[#1c1c1e] rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-[#2c2c2e]">
          <button onClick={onClose} className="text-[#ff9f0a] text-lg font-medium">Cancel</button>
          <span className="text-white font-semibold">{alarm ? 'Edit Alarm' : 'Add Alarm'}</span>
          <button onClick={handleSave} className="text-[#ff9f0a] text-lg font-bold">Save</button>
        </div>

        <div className="p-6 flex flex-col items-center">
          <input 
            type="time" 
            value={time} 
            onChange={(e) => setTime(e.target.value)}
            className="bg-transparent text-6xl font-light text-white focus:outline-none mb-8"
          />

          <div className="w-full space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-[#8e8e93] text-sm uppercase px-1">Label</label>
              <input 
                type="text" 
                value={label} 
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Alarm Label"
                className="w-full bg-[#2c2c2e] text-white px-4 py-3 rounded-xl focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[#8e8e93] text-sm uppercase px-1">Repeat</label>
              <div className="flex justify-between bg-[#2c2c2e] p-2 rounded-xl">
                {DAYS.map(day => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                      repeat.includes(day) 
                        ? 'bg-[#ff9f0a] text-black' 
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
