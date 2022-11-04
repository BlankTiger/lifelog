import create from "zustand";
import { invoke } from "@tauri-apps/api";

export type CalendarEntries = {
  [key: string]: CalendarEntry[]
};
export type CalendarEntry = Record<string, Object>;
export const calendarPath: string = await invoke("get_calendar_path");

const getCalendarEntries = async (path: string): Promise<CalendarEntries> => {
  return await invoke("generate_from_file", { path: path })
    .then(entries => entries)
    .catch((error) => {
      console.error(error);
      return {};
    }) as Promise<CalendarEntries>;
};

const addCalendarEntry = async (date: string, entry: CalendarEntry): Promise<CalendarEntries> => {
  return await invoke("add_entry_for_date", { date: date, entry: entry })
    .then(entries => entries)
    .catch((error) => {
      console.error(error);
      return {};
    }) as Promise<CalendarEntries>;
};

const removeCalendarEntry = async (id: number): Promise<CalendarEntries> => {
  return await invoke("remove_entry_by_id", { id: id })
    .then(entries => entries)
    .catch((error) => {
      console.error(error);
      return {};
    }) as Promise<CalendarEntries>;
}


interface CalendarEntriesState {
  calendarEntries: Promise<CalendarEntries>;
  refreshEntries: () => void;
  addCalendarEntry: (date: string, entry: CalendarEntry) => void;
  removeCalendarEntry: (id: number) => void;
  currentEntry: number;
  currentEntryStart: string;
  setCurrentEntry: (entryId: number, newEntryStart: string) => void;
}

export const useCalendarEntriesStore = create<CalendarEntriesState>()((set) => ({
  calendarEntries: getCalendarEntries(calendarPath),
  refreshEntries: () => set(() => ({ calendarEntries: getCalendarEntries(calendarPath) })),
  addCalendarEntry: (date, entry) => set(() => ({ calendarEntries: addCalendarEntry(date, entry) })),
  removeCalendarEntry: (id) => set(() => ({ calendarEntries: removeCalendarEntry(id) })),
  currentEntry: 0,
  currentEntryStart: new Date().toLocaleString(),
  setCurrentEntry: (newEntry, newEntryStart) =>
    set(() => ({ currentEntry: newEntry, currentEntryStart: newEntryStart })),
}));

interface TodayState {
  today: Date;
  todayShowable: string;
  setToday: (newToday: Date) => void;
}

const showableDateFix = (date: Date) => {
  let baseShowableDate = new Date(date).toLocaleString("pl-PL").split(",")[0];
  let fixedShowableDate = date.getDate() >= 10 ? baseShowableDate : "0" + baseShowableDate;
  return fixedShowableDate;
}

export const useTodayStore = create<TodayState>()((set) => ({
  today: new Date(),
  todayShowable: showableDateFix(new Date()),
  setToday: (newToday) => set(() => ({ today: newToday, todayShowable: showableDateFix(newToday) })),
}));

interface ElapsedTimeState {
  elapsedTime: number;
  resumeTimes: Date[];
  pauseTimes: Date[];
  setElapsedTime: (newElapsedTime: number) => void;
  pushResumeTime: (resumeTime: Date) => void;
  clearResumeTimes: () => void;
  pushPauseTime: (pauseTime: Date) => void;
  clearPauseTimes: () => void;
}

export const useElapsedTimeStore = create<ElapsedTimeState>()((set) => ({
  elapsedTime: 0,
  resumeTimes: [],
  pauseTimes: [],
  setElapsedTime: (newElapsedTime) => set(() => ({ elapsedTime: newElapsedTime })),
  pushResumeTime: (resumeTime) => set((state) => ({ resumeTimes: [...state.resumeTimes, resumeTime] })),
  clearResumeTimes: () => set(() => ({ resumeTimes: [] })),
  pushPauseTime: (pauseTime) => set((state) => ({ pauseTimes: [...state.pauseTimes, pauseTime] })),
  clearPauseTimes: () => set(() => ({ pauseTimes: [] })),
}));

interface RefreshEntriesState {
  shouldRefresh: boolean;
  setShouldRefresh: () => void;
}

export const useShouldRefreshStore = create<RefreshEntriesState>()((set) => ({
  shouldRefresh: false,
  setShouldRefresh: () => set((state) => ({ shouldRefresh: !state.shouldRefresh })),
}));
