import create from "zustand";
import { invoke } from "@tauri-apps/api";

export type CalendarEntries = {
  [key: string]: CalendarEntry[]
};
export type CalendarEntry = Record<string, Object>;

const getCalendarEntries = async (path: string): Promise<CalendarEntries> => {
  return await invoke("generate_from_file", { path: path })
    .then(entries => entries)
    .catch((error) => {
      console.error(error);
      return {};
    }) as Promise<CalendarEntries>;
};


const addCalendarEntry = (entries: Promise<CalendarEntries>, date: string, entry: CalendarEntry): Promise<CalendarEntries> => {
  return entries.then((entries: CalendarEntries) => {
    if (date in entries) {
      entries[date].push(entry);
    } else {
      entries[date] = [entry];
    }
    return entries;
  }) as Promise<CalendarEntries>;
};

const removeCalendarEntry = (entries: Promise<CalendarEntries>, id: number): Promise<CalendarEntries> => {
  return entries.then((entries: CalendarEntries) => {
    for (let date in entries) {
      entries[date] = entries[date].filter((entry: CalendarEntry) => entry["id"] !== id);
    }
    return entries;
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
  calendarEntries: getCalendarEntries("./rozklad.json"),
  refreshEntries: () => set(() => ({ calendarEntries: getCalendarEntries("./rozklad.json") })),
  addCalendarEntry: (date, entry) => set((state) => ({ calendarEntries: addCalendarEntry(state.calendarEntries, date, entry) })),
  removeCalendarEntry: (id) => set((state) => ({ calendarEntries: removeCalendarEntry(state.calendarEntries, id) })),
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
