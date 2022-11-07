import create from "zustand";
import { invoke } from "@tauri-apps/api";

export type CalendarEntries = {
  [key: string]: CalendarEntry[]
};
export type CalendarEntry = Record<string, Object>;

const getCalendarEntries = async (): Promise<CalendarEntries> => {
  const path: string = await invoke("get_calendar_path");
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

const removeCalendarEntries = async (ids: number[], clearEntriesForRemoval: any): Promise<CalendarEntries> => {
  clearEntriesForRemoval();
  return await invoke("remove_entry_by_ids", { ids: ids })
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
  entriesForRemoval: number[];
  clearEntriesForRemoval: () => void;
  pushEntryForRemoval: (id: number) => void;
  popEntryForRemoval: (id: number) => void;
  removeCalendarEntries: () => void;
  currentEntry: number;
  currentEntryStart: string;
  currentEntryEnd: string;
  setCurrentEntry: (entryId: number, newEntryStart: string, newEntryEnd: string) => void;
}

export const useCalendarEntriesStore = create<CalendarEntriesState>()((set) => ({
  calendarEntries: getCalendarEntries(),
  refreshEntries: () => set(() => ({ calendarEntries: getCalendarEntries() })),
  addCalendarEntry: (date, entry) => set(() => ({ calendarEntries: addCalendarEntry(date, entry) })),
  entriesForRemoval: [],
  clearEntriesForRemoval: () => set(() => ({ entriesForRemoval: [] })),
  pushEntryForRemoval: (id) => set((state) => ({ entriesForRemoval: [...state.entriesForRemoval, id] })),
  popEntryForRemoval: (id) => set((state) => ({
    entriesForRemoval:
      [...state.entriesForRemoval.filter(entryId => entryId !== id)]
  })),
  removeCalendarEntries: () => set((state) => ({
    calendarEntries:
      removeCalendarEntries(state.entriesForRemoval, state.clearEntriesForRemoval)
  })),
  currentEntry: 0,
  currentEntryStart: new Date().toISOString(),
  currentEntryEnd: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  setCurrentEntry: (newEntry, newEntryStart, newEntryEnd) =>
    set(() => ({
      currentEntry: newEntry,
      currentEntryStart: newEntryStart,
      currentEntryEnd: newEntryEnd,
    })),
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
  setElapsedTime: (newElapsedTime: number) => void;
}

export const useElapsedTimeStore = create<ElapsedTimeState>()((set) => ({
  elapsedTime: 0,
  setElapsedTime: (newElapsedTime) => set(() => ({ elapsedTime: newElapsedTime })),
}));

const calcActualElapsedTime = (
  actualElapsedTime: number,
  resumeTimes: Date[],
  pauseTimes: Date[],
  isRunning: boolean
): number => {
  if (isRunning) {
    let actualElapsedTime = 0;
    /* ([5], []) */
    /* ([5], [10]) */
    /* ([5, 15], [10]) */
    /* ([5, 15], [10, 20]) */
    /* ([5, 15, 25], [10, 20]) */
    if (pauseTimes.length === 0) {
      return (Date.now() - new Date(resumeTimes[0]).getTime()) / 1000
    }
    for (let i = 0; i < pauseTimes.length; i++) {
      actualElapsedTime += (pauseTimes[i].getTime() - resumeTimes[i].getTime()) / 1000;
    }
    if (resumeTimes.length > pauseTimes.length) {
      actualElapsedTime += (Date.now() - resumeTimes[resumeTimes.length - 1].getTime()) / 1000;
    }
    return actualElapsedTime;
  }
  return actualElapsedTime;
}

interface ActualElapsedTimeState {
  actualElapsedTime: number;
  resumeTimes: Date[];
  pauseTimes: Date[];
  isRunning: boolean;
  setActualElapsedTime: (newActualElapsedTime: number) => void;
  calculateActualElapsedTime: () => void;
  pushResumeTime: (resumeTime: Date) => void;
  clearResumeTimes: () => void;
  pushPauseTime: (pauseTime: Date) => void;
  clearPauseTimes: () => void;
  setIsRunning: () => void;
}

export const useActualElapsedTimeStore = create<ActualElapsedTimeState>()((set) => ({
  actualElapsedTime: 0,
  resumeTimes: [],
  pauseTimes: [],
  isRunning: false,
  setActualElapsedTime: (newActualElapsedTime) => set(() => ({ actualElapsedTime: newActualElapsedTime })),
  calculateActualElapsedTime: () => set((state) => ({
    actualElapsedTime: calcActualElapsedTime(
      state.actualElapsedTime,
      state.resumeTimes,
      state.pauseTimes,
      state.isRunning
    )
  })),
  pushResumeTime: (resumeTime) => set((state) => ({ resumeTimes: [...state.resumeTimes, resumeTime] })),
  clearResumeTimes: () => set(() => ({ resumeTimes: [] })),
  pushPauseTime: (pauseTime) => set((state) => ({ pauseTimes: [...state.pauseTimes, pauseTime] })),
  clearPauseTimes: () => set(() => ({ pauseTimes: [] })),
  setIsRunning: () => set((state) => ({ isRunning: !state.isRunning })),
}));

interface RefreshEntriesState {
  shouldRefresh: boolean;
  setShouldRefresh: () => void;
}

export const useShouldRefreshStore = create<RefreshEntriesState>()((set) => ({
  shouldRefresh: false,
  setShouldRefresh: () => set((state) => ({ shouldRefresh: !state.shouldRefresh })),
}));
