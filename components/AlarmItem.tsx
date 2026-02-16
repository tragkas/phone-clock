
import React from 'react';
import { Alarm, DayOfWeek } from '../types';
import { Trash2 } from 'lucide-react';

interface AlarmItemProps {
  alarm: Alarm;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (alarm: Alarm) => void;
}

const formatRepeat = (repeat: DayOfWeek[]): string => {
  if (repeat.length === 0) return 'Never';
  if (repeat.length === 7) return 'Every day';
  const weekdays: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const weekends: DayOfWeek[] = ['Sat', 'Sun'];
  
  const isEveryWeekday = weekdays.every(d => repeat.includes(d)) && repeat.length === 5;
  if (isEveryWeekday) return 'Every weekday';
  
  return repeat.join(' ');
};

export const AlarmItem: React.FC<AlarmItemProps> = ({ alarm, onToggle, onDelete, onEdit }) => {
  return (
    <div 
      className={`group relative py-4 border-b border-[#1c1c1e] transition-opacity duration-300 ${!alarm.enabled ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className="flex justify-between items-center pr-4" onClick={() => onEdit(alarm)}>
        <div className="flex flex-col">
          <span className="text-5xl font-light tracking-tight tabular-nums">
            {alarm.time}
          </span>
          <span className="text-[15px] font-normal text-[#8e8e93] mt-1">
            {alarm.label}, {formatRepeat(alarm.repeat)}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(alarm.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-all"
          >
            <Trash2 size={20} />
          </button>
          
          <label className="ios-switch" onClick={(e) => e.stopPropagation()}>
            <input 
              type="checkbox" 
              checked={alarm.enabled} 
              onChange={() => onToggle(alarm.id)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
};
