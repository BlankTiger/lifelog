export interface CalendarEntry {
  id: Number,
  title: String;
  desc: String;
  start: Date;
  end: Date;
  pause_times: PauseTimes[];
}

export interface PauseTimes {
  elapsed_time: Number;
  actual_time: Number;
  current_time: String;
}
