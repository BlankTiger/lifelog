export interface CalendarEntry {
  id: number,
  title: string;
  desc: string;
  start: Date;
  end: Date;
  pause_times: PauseTimes[];
}

export interface PauseTimes {
  elapsed_time: number;
  actual_time: number;
  current_time: string;
}
