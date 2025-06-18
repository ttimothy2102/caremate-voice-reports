
export interface QuickAction {
  id: string;
  title: string;
  type: 'medical' | 'therapy' | 'social' | 'hygiene' | 'meal';
  defaultDuration: number; // in minutes
}

export interface ScheduleSlot {
  date: Date;
  hour: number;
}
