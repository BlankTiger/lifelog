export interface CalendarEntry {
  id: number,
  description: string;
  start: Date;
  end: Date;
  summary: string;
  location: string;
  status: string;
  entry_type: string;
}

export interface PauseTimes {
  elapsed_time: number;
  actual_time: number;
  current_time: string;
}
