import create from "zustand";
import { invoke } from "@tauri-apps/api";

const generateDailyEntries = async () => {
  return await invoke("generate_from_file")
    .then(entries => entries)
    .catch((error) => {
      console.log(error);
      return {};
    })
};

interface CurrentEntryState {
  currentEntry: number;
  currentEntryStart: string;
  setCurrentEntry: (newEntry: number, newEntryStart: string) => void;
}

export const useEntryStore = create<CurrentEntryState>()((set) => ({
  currentEntry: 0,
  currentEntryStart: new Date().toLocaleString(),
  setCurrentEntry: (newEntry, newEntryStart) =>
    set(() => ({ currentEntry: newEntry, currentEntryStart: newEntryStart })),
}));

interface DailyEntriesState {
  dailyEntries: Object;
  setDailyEntries: (newEntries: Object) => void;
}

export const useDailyEntriesStore = create<DailyEntriesState>()((set) => ({
  dailyEntries: generateDailyEntries(),
  setDailyEntries: (newEntries) => set(() => ({ dailyEntries: newEntries })),
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
