
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface Alarm {
  id: string;
  time: string; // HH:mm format
  label: string;
  repeat: DayOfWeek[];
  enabled: boolean;
}

// Fix: Added SmartScheduleResponse interface to match the responseSchema used in geminiService.ts
export interface SmartScheduleResponse {
  suggestedAlarms: {
    time: string;
    label: string;
    reason: string;
  }[];
  explanation: string;
}
